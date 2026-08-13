'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useFetch } from '@/hooks/useFetch';
import TechTag from '@/components/TechTag';
import { AvatarRow } from '@/components/ui/AvatarRow';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner, ErrorMessage } from '@/components/ui/StateComponents';
import type { TechEcosystemResponse, Technology } from '@/lib/types';

function ColHeader({ hop, label, query }: { hop: string; label: string; query: string }) {
  return (
    <div style={{ marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
      <span
        style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          display: 'block',
          marginBottom: '4px',
        }}
      >
        {hop}
      </span>
      <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
        {label}
      </h3>
      <code
        style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}
      >
        {query}
      </code>
    </div>
  );
}

export default function ExplorePage() {
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);

  const techsState = useFetch(() => api.technologies.list(), []);

  useEffect(() => {
    if (techsState.status === 'success' && selectedTechId === null && techsState.data.technologies.length > 0) {
      setSelectedTechId(techsState.data.technologies[0].id);
    }
  }, [techsState, selectedTechId]);

  const ecosystemState = useFetch(
    () => api.technologies.ecosystem(selectedTechId!),
    [selectedTechId],
    { enabled: selectedTechId !== null }
  );

  const availableTechs: Technology[] = techsState.status === 'success' ? techsState.data.technologies : [];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '0 0 6px' }}>
          Graph Traversal Explorer
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          Select an anchor technology to trace connections across developers, projects, and related technologies.
        </p>
      </div>

      <div className="card" style={{ padding: '20px', marginBottom: '28px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Anchor Technology
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {availableTechs.map((tech) => (
            <Button
              key={tech.id}
              variant={selectedTechId === tech.id ? 'primary' : 'secondary'}
              onClick={() => setSelectedTechId(tech.id)}
              aria-pressed={selectedTechId === tech.id}
            >
              {tech.name}
            </Button>
          ))}
        </div>
      </div>

      {(selectedTechId === null || ecosystemState.status === 'loading') && <LoadingSpinner />}

      {ecosystemState.status === 'error' && (
        <ErrorMessage message={ecosystemState.message} onRetry={ecosystemState.refetch} />
      )}

      {ecosystemState.status === 'success' && (() => {
        const data = ecosystemState.data as TechEcosystemResponse;
        return (
          <div>
            <div className="card-inset" style={{ padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Traversal path:</span>
              <code style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', wordBreak: 'break-all' }}>
                (Developer)-[:BUILT]-&gt;(Project)-[:USES]-&gt;({data.technology.name})-[:RELATED_TO]-&gt;(Technology)
              </code>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
              }}
            >
              <div className="card" style={{ padding: '20px' }}>
                <ColHeader
                  hop="Hop 1-2"
                  label="Developers & Projects"
                  query={`(d)-[:BUILT]->(p)-[:USES]->(${data.technology.name})`}
                />
                {data.developers.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No developers found.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {data.developers.map((dev, idx) => (
                      <AvatarRow
                        key={`${dev.id}-${dev.projectName}-${idx}`}
                        id={dev.id}
                        name={dev.name}
                        avatarUrl={dev.avatarUrl}
                        subtitle={dev.projectName}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <ColHeader
                  hop="Hop 3"
                  label="Co-occurring Technologies"
                  query="(p)-[:USES]->(coTech)"
                />
                {data.coTechnologies.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>None found.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {data.coTechnologies.map((co) => (
                      <div
                        key={co.id}
                        className="card-inset"
                        style={{ padding: '9px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <TechTag tech={co} />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {co.projectCount}p
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <ColHeader
                  hop="Hop 4"
                  label="Graph-Related Technologies"
                  query={`(${data.technology.name})-[:RELATED_TO]->(adj)`}
                />
                {data.relatedTechnologies.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>None found.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {data.relatedTechnologies
                      .slice()
                      .sort((a, b) => b.strength - a.strength)
                      .map((rel) => (
                        <div
                          key={rel.id}
                          className="card-inset"
                          style={{ padding: '9px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                          <TechTag tech={rel} />
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {rel.strength}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
