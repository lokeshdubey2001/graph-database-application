'use client';

import { useState, useMemo } from 'react';
import { api } from '@/lib/api';
import { useFetch } from '@/hooks/useFetch';
import DeveloperCard from '@/components/DeveloperCard';
import { SearchBar } from '@/components/SearchBar';
import { LoadingSpinner, ErrorMessage, EmptyState } from '@/components/ui/StateComponents';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedTech, setSelectedTech] = useState('');

  const state = useFetch(
    () => api.developers.list({ skill: selectedSkill, tech: selectedTech }),
    [selectedSkill, selectedTech]
  );

  const skillsState = useFetch(() => api.skills.list(), []);
  const techsState = useFetch(() => api.technologies.list(), []);

  const filteredDevelopers = useMemo(() => {
    if (state.status !== 'success') return [];
    if (!query.trim()) return state.data.developers;
    const q = query.toLowerCase().trim();
    return state.data.developers.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.bio.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q)
    );
  }, [state, query]);

  const skillOptions = useMemo(() => {
    if (skillsState.status !== 'success') return [];
    return skillsState.data.skills.map((s) => s.name);
  }, [skillsState]);

  const techOptions = useMemo(() => {
    if (techsState.status !== 'success') return [];
    return techsState.data.technologies.map((t) => t.name);
  }, [techsState]);

  const count = state.status === 'success' ? filteredDevelopers.length : null;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            margin: '0 0 6px',
          }}
        >
          Developer Explorer
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          Browse developers by direct skills{' '}
          <code className="mono" style={{ color: 'var(--accent)' }}>[:KNOWS]</code>
          {' '}or project technology{' '}
          <code className="mono" style={{ color: '#34d399' }}>[:BUILT]→[:USES]</code>.
        </p>
      </div>

      <SearchBar
        query={query}
        onQueryChange={setQuery}
        selectedSkill={selectedSkill}
        onSkillChange={setSelectedSkill}
        selectedTech={selectedTech}
        onTechChange={setSelectedTech}
        skills={skillOptions}
        techs={techOptions}
      />

      {state.status === 'loading' && <LoadingSpinner />}

      {state.status === 'error' && (
        <ErrorMessage message={state.message} onRetry={state.refetch} />
      )}

      {state.status === 'success' && filteredDevelopers.length === 0 && (
        <EmptyState
          title="No developers match"
          description="Try a different skill or technology filter, or clear the search term."
        />
      )}

      {state.status === 'success' && filteredDevelopers.length > 0 && (
        <>
          {count !== null && (
            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginBottom: '16px',
              }}
            >
              {count} {count === 1 ? 'developer' : 'developers'} found
            </p>
          )}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {filteredDevelopers.map((dev) => (
              <DeveloperCard key={dev.id} developer={dev} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
