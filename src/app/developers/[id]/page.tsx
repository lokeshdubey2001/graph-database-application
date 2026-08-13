'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useFetch } from '@/hooks/useFetch';
import SkillBadge from '@/components/SkillBadge';
import ProjectCard from '@/components/ProjectCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AvatarRow } from '@/components/ui/AvatarRow';
import { DeveloperProfileSkeleton, ErrorMessage } from '@/components/ui/StateComponents';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DeveloperProfilePage({ params }: PageProps) {
  const { id } = use(params);

  const profileState = useFetch(() => api.developers.get(id), [id]);
  const relatedState = useFetch(() => api.developers.related(id), [id]);

  if (profileState.status === 'loading') {
    return <DeveloperProfileSkeleton />;
  }

  if (profileState.status === 'error') {
    return <ErrorMessage message={profileState.message} onRetry={profileState.refetch} />;
  }

  if (profileState.status !== 'success') return null;

  const { developer, skills, projects } = profileState.data;

  const allTechsMap = new Map<string, { id: string; name: string; domain: string }>();
  const allCompaniesMap = new Map<string, { id: string; name: string; industry: string }>();
  projects.forEach((p) => {
    if (p.company) allCompaniesMap.set(p.company.id, p.company);
    p.technologies.forEach((t) => allTechsMap.set(t.id, t));
  });
  const companies = Array.from(allCompaniesMap.values());

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          marginBottom: '20px',
        }}
      >
        <ArrowLeft size={14} />
        <span>All developers</span>
      </Link>

      <div
        className="card card-responsive-padding"
        style={{ padding: '24px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '16px', borderRadius: 0, minWidth: 0 }}
      >
        <img
          src={developer.avatarUrl}
          alt={developer.name}
          style={{ width: '56px', height: '56px', borderRadius: 0, objectFit: 'cover', border: '1px solid var(--border-color)', flexShrink: 0 }}
        />
        <div style={{ flex: '1 1 200px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.015em', color: 'var(--text-primary)', margin: '0 0 4px', wordBreak: 'break-word' }}>
                {developer.name}
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                {developer.location} • {developer.yearsExp} years experience
              </p>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '10px 0 0', wordBreak: 'break-word' }}>
            {developer.bio}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card card-responsive-padding" style={{ padding: '20px', borderRadius: 0, minWidth: 0 }}>
          <SectionHeading>Skills &amp; Proficiencies</SectionHeading>
          {skills.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No skills recorded.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skills.map((skill) => (
                <SkillBadge key={skill.id} skill={skill} />
              ))}
            </div>
          )}
        </div>

        <div className="card card-responsive-padding" style={{ padding: '20px', borderRadius: 0, minWidth: 0 }}>
          <SectionHeading>Client Companies</SectionHeading>
          {companies.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No companies linked.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="card-inset"
                  style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 0, minWidth: 0 }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {company.name}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>
                    {company.industry}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <SectionHeading>Projects ({projects.length})</SectionHeading>
        </div>
        {projects.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No projects recorded.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {relatedState.status === 'success' && (
        <div>
          <div style={{ height: '1px', background: 'var(--border-subtle)', marginBottom: '28px' }} />

          <div style={{ marginBottom: '16px' }}>
            <SectionHeading>Graph Traversal: Related Developers</SectionHeading>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              Developers connected to {developer.name} through shared skills or complementary technology stacks.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="card card-responsive-padding" style={{ padding: '20px', borderRadius: 0, minWidth: 0 }}>
              <div style={{ marginBottom: '14px' }}>
                <SectionHeading>Skill Peers</SectionHeading>
                <code className="mono" style={{ color: 'var(--text-muted)', fontSize: '11px', wordBreak: 'break-all' }}>
                  (d)-[:KNOWS]-&gt;(s)&lt;-[:KNOWS]-(peer)
                </code>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {relatedState.data.skillPeers.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>None found.</p>
                ) : (
                  relatedState.data.skillPeers.map((peer) => (
                    <AvatarRow
                      key={peer.id}
                      id={peer.id}
                      name={peer.name}
                      avatarUrl={peer.avatarUrl}
                      subtitle={peer.sharedSkills.join(', ')}
                      badgeText={peer.sharedCount}
                      badgeColor="var(--accent)"
                    />
                  ))
                )}
              </div>
            </div>

            <div className="card card-responsive-padding" style={{ padding: '20px', borderRadius: 0, minWidth: 0 }}>
              <div style={{ marginBottom: '14px' }}>
                <SectionHeading>Tech Stack Peers (5-hop)</SectionHeading>
                <code className="mono" style={{ color: 'var(--text-muted)', fontSize: '11px', wordBreak: 'break-all' }}>
                  (d)-[:BUILT]-&gt;[:USES]-&gt;(t)-[:RELATED_TO]-&gt;(adj)
                </code>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {relatedState.data.techPeers.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>None found.</p>
                ) : (
                  relatedState.data.techPeers.map((peer) => (
                    <AvatarRow
                      key={peer.id}
                      id={peer.id}
                      name={peer.name}
                      avatarUrl={peer.avatarUrl}
                      subtitle={`via ${peer.bridgeTechs.join(', ')}`}
                      badgeText={peer.relevance}
                      badgeColor="#34d399"
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
