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

  const techOptions = [
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Python',
    'Go',
    'PostgreSQL',
    'CognoDB',
    'Redis',
    'Docker',
    'Kubernetes',
    'Kafka',
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto space-y-3 py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-xs font-semibold text-indigo-300 mb-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Powered by CognoDB openCypher Graph Engine
        </div>
        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight sm:text-5xl">
          Dev<span className="text-indigo-400">Graph</span>
        </h1>
        <p className="text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Explore developer profiles, technical proficiencies, project portfolios, and multi-hop technology relationships across the graph ecosystem.
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
          title="No developers match your filters"
          description="Try clearing your search term or skill/technology filters to view developers."
        />
      )}

      {state.status === 'success' && filteredDevelopers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevelopers.map((dev) => (
            <DeveloperCard key={dev.id} developer={dev} />
          ))}
        </div>
      )}
    </div>
  );
}
