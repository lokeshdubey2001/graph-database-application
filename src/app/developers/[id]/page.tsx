'use client';

import { use } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useFetch } from '@/hooks/useFetch';
import SkillBadge from '@/components/SkillBadge';
import ProjectCard from '@/components/ProjectCard';
import { LoadingSpinner, ErrorMessage } from '@/components/ui/StateComponents';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DeveloperProfilePage({ params }: PageProps) {
  const { id } = use(params);

  const profileState = useFetch(() => api.developers.get(id), [id]);
  const relatedState = useFetch(() => api.developers.related(id), [id]);

  if (profileState.status === 'loading') {
    return <LoadingSpinner />;
  }

  if (profileState.status === 'error') {
    return <ErrorMessage message={profileState.message} onRetry={profileState.refetch} />;
  }

  if (profileState.status !== 'success') {
    return null;
  }

  const { developer, skills, projects } = profileState.data;

  const allTechnologiesMap = new Map<string, { id: string; name: string; domain: string }>();
  const allCompaniesMap = new Map<string, { id: string; name: string; industry: string }>();

  projects.forEach((p) => {
    if (p.company) {
      allCompaniesMap.set(p.company.id, p.company);
    }
    p.technologies.forEach((t) => {
      allTechnologiesMap.set(t.id, t);
    });
  });

  const technologies = Array.from(allTechnologiesMap.values());
  const companies = Array.from(allCompaniesMap.values());

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 font-medium transition-colors"
      >
        <span>&larr;</span> Back to Developers
      </Link>

      <div className="card p-8 bg-slate-900/60 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <img
            src={developer.avatarUrl}
            alt={developer.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500/50 shadow-xl"
          />
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
                  {developer.name}
                </h1>
                <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                  <span>📍 {developer.location}</span>
                  <span>&bull;</span>
                  <span>{developer.yearsExp} Years Professional Experience</span>
                </p>
              </div>
            </div>
            <p className="text-base text-slate-300 max-w-3xl leading-relaxed pt-1">
              {developer.bio}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <span>⚡</span> Known Skills &amp; Proficiencies
          </h2>
          {skills.length === 0 ? (
            <p className="text-sm text-slate-400">No skills recorded.</p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <SkillBadge key={skill.id} skill={skill} />
              ))}
            </div>
          )}
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <span>🏢</span> Associated Clients &amp; Companies
          </h2>
          {companies.length === 0 ? (
            <p className="text-sm text-slate-400">No client companies linked to projects.</p>
          ) : (
            <div className="space-y-3 pt-1">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/50"
                >
                  <span className="text-sm font-semibold text-slate-200">
                    {company.name}
                  </span>
                  <span className="text-xs text-indigo-300 font-medium px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40">
                    {company.industry}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <span>🚀</span> Featured Projects ({projects.length})
        </h2>
        {projects.length === 0 ? (
          <p className="text-sm text-slate-400">No projects found for this developer.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {relatedState.status === 'success' && (
        <div className="space-y-6 pt-6 border-t border-slate-800">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>🕸️</span> Multi-Hop Graph Traversal Insights
            </h2>
            <p className="text-sm text-slate-400">
              Developers connected to {developer.name} through shared skills and multi-hop tech stack affinities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <span>🎯</span> Shared Skill Peers (3-Hop)
              </h3>
              <div className="space-y-3">
                {relatedState.data.skillPeers.length === 0 ? (
                  <p className="text-xs text-slate-400">No skill peers found.</p>
                ) : (
                  relatedState.data.skillPeers.map((peer) => (
                    <div
                      key={peer.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={peer.avatarUrl}
                          alt={peer.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <Link
                            href={`/developers/${peer.id}`}
                            className="text-sm font-semibold text-slate-200 hover:text-indigo-400 transition-colors"
                          >
                            {peer.name}
                          </Link>
                          <p className="text-xs text-slate-400">
                            {peer.sharedSkills.join(', ')}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-indigo-300">
                        {peer.sharedCount} shared
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <span>🔗</span> Tech Stack Trajectory Peers (5-Hop)
              </h3>
              <div className="space-y-3">
                {relatedState.data.techPeers.length === 0 ? (
                  <p className="text-xs text-slate-400">No tech peers found.</p>
                ) : (
                  relatedState.data.techPeers.map((peer) => (
                    <div
                      key={peer.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={peer.avatarUrl}
                          alt={peer.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <Link
                            href={`/developers/${peer.id}`}
                            className="text-sm font-semibold text-slate-200 hover:text-indigo-400 transition-colors"
                          >
                            {peer.name}
                          </Link>
                          <p className="text-xs text-slate-400">
                            Bridge: {peer.bridgeTechs.join(', ')}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400">
                        {peer.relevance} match score
                      </span>
                    </div>
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
