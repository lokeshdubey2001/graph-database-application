'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFetch } from '@/hooks/useFetch';
import TechTag from '@/components/TechTag';
import { LoadingSpinner, ErrorMessage } from '@/components/ui/StateComponents';

const SAMPLE_TECHS = [
  { id: 'tech_react', name: 'React' },
  { id: 'tech_next', name: 'Next.js' },
  { id: 'tech_go', name: 'Go' },
  { id: 'tech_ts', name: 'TypeScript' },
  { id: 'tech_cogno', name: 'CognoDB' },
  { id: 'tech_python', name: 'Python' },
  { id: 'tech_k8s', name: 'Kubernetes' },
  { id: 'tech_redis', name: 'Redis' },
  { id: 'tech_pg', name: 'PostgreSQL' },
];

export default function ExplorePage() {
  const [selectedTechId, setSelectedTechId] = useState('tech_react');

  const state = useFetch(
    async () => {
      const res = await fetch(`/api/technologies/${selectedTechId}/ecosystem`);
      if (!res.ok) throw new Error('Failed to fetch ecosystem');
      return res.json();
    },
    [selectedTechId]
  );

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="text-center max-w-3xl mx-auto space-y-3 py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-xs font-semibold text-emerald-300 mb-2">
          <span>🌿</span> Multi-Hop Traversal Showcase
        </div>
        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight sm:text-5xl">
          Ecosystem <span className="text-emerald-400">Explorer</span>
        </h1>
        <p className="text-base text-slate-300 leading-relaxed font-medium">
          What technologies are connected to this technology through projects built by developers?
        </p>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Select Anchor Technology:
        </h2>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_TECHS.map((tech) => (
            <button
              key={tech.id}
              onClick={() => setSelectedTechId(tech.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                selectedTechId === tech.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 border border-emerald-500'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/50'
              }`}
            >
              {tech.name}
            </button>
          ))}
        </div>
      </div>

      {state.status === 'loading' && <LoadingSpinner />}

      {state.status === 'error' && (
        <ErrorMessage message={state.message} onRetry={state.refetch} />
      )}

      {state.status === 'success' && (
        <div className="space-y-8">
          <div className="card p-6 bg-slate-900/80 border-emerald-900/50">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚛️</span>
              <div>
                <h2 className="text-2xl font-bold text-slate-100">
                  {state.data.technology.name} Traversal Path
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  (Technology &#123;id: &quot;{state.data.technology.id}&quot;&#125;) &larr;[:USES]-- (:Project) &larr;[:BUILT]-- (:Developer)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 space-y-4 border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Hop 1 &amp; Hop 2: Developers &amp; Projects
                </span>
                <h3 className="text-base font-bold text-slate-100">
                  Developers Building with {state.data.technology.name}
                </h3>
              </div>
              <div className="space-y-3">
                {state.data.developers.length === 0 ? (
                  <p className="text-xs text-slate-400">No developers found.</p>
                ) : (
                  state.data.developers.map((dev: { id: string; name: string; avatarUrl: string; projectName: string }) => (
                    <div
                      key={dev.id}
                      className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={dev.avatarUrl}
                          alt={dev.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <Link
                            href={`/developers/${dev.id}`}
                            className="text-sm font-semibold text-slate-200 hover:text-indigo-400 transition-colors"
                          >
                            {dev.name}
                          </Link>
                          <p className="text-xs text-slate-400 truncate max-w-[150px]">
                            Built &quot;{dev.projectName}&quot;
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card p-6 space-y-4 border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Hop 3: Co-Occurring Tech Stack
                </span>
                <h3 className="text-base font-bold text-slate-100">
                  Technologies Used in Same Projects
                </h3>
              </div>
              <div className="space-y-3">
                {state.data.coTechnologies.length === 0 ? (
                  <p className="text-xs text-slate-400">No co-occurring technologies.</p>
                ) : (
                  state.data.coTechnologies.map((co: { id: string; name: string; domain: 'frontend' | 'backend' | 'infra' | 'data'; projectCount: number }) => (
                    <div
                      key={co.id}
                      className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 flex items-center justify-between"
                    >
                      <TechTag tech={co} />
                      <span className="text-xs font-semibold text-emerald-300">
                        {co.projectCount} project(s)
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card p-6 space-y-4 border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Hop 4: Graph Ecosystem Affinity
                </span>
                <h3 className="text-base font-bold text-slate-100">
                  Directly Related Technologies
                </h3>
              </div>
              <div className="space-y-3">
                {state.data.relatedTechnologies.length === 0 ? (
                  <p className="text-xs text-slate-400">No related technologies found.</p>
                ) : (
                  state.data.relatedTechnologies.map((rel: { id: string; name: string; domain: 'frontend' | 'backend' | 'infra' | 'data'; strength: number }) => (
                    <div
                      key={rel.id}
                      className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 flex items-center justify-between"
                    >
                      <TechTag tech={rel} />
                      <span className="text-xs font-semibold text-amber-400">
                        Affinity: {rel.strength}
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
