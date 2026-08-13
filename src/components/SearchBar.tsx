'use client';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedSkill: string;
  onSkillChange: (skill: string) => void;
  selectedTech: string;
  onTechChange: (tech: string) => void;
  skills: string[];
  techs: string[];
}

export function SearchBar({
  query,
  onQueryChange,
  selectedSkill,
  onSkillChange,
  selectedTech,
  onTechChange,
  skills,
  techs,
}: SearchBarProps) {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search developers by name, bio, location..."
            className="input-base w-full px-4 py-2.5 pl-10 text-sm"
          />
          <span className="absolute left-3.5 top-3 text-slate-400 text-sm">
            🔍
          </span>
        </div>

        <div className="flex gap-2">
          <select
            value={selectedSkill}
            onChange={(e) => {
              onSkillChange(e.target.value);
              if (e.target.value) onTechChange('');
            }}
            className="input-base px-3 py-2.5 text-sm cursor-pointer border-indigo-900/50 bg-indigo-950/20 text-indigo-200"
          >
            <option value="">Direct Skill (KNOWS)</option>
            {skills.map((s) => (
              <option key={s} value={s}>
                ⚡ {s}
              </option>
            ))}
          </select>

          <select
            value={selectedTech}
            onChange={(e) => {
              onTechChange(e.target.value);
              if (e.target.value) onSkillChange('');
            }}
            className="input-base px-3 py-2.5 text-sm cursor-pointer border-emerald-900/50 bg-emerald-950/20 text-emerald-200"
          >
            <option value="">Project Tech (USES)</option>
            {techs.map((t) => (
              <option key={t} value={t}>
                🛠️ {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(selectedSkill || selectedTech) && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300">
          <div className="flex items-center gap-2">
            <span>Graph Filter Active:</span>
            {selectedSkill && (
              <span className="font-semibold bg-indigo-900/60 px-2 py-0.5 rounded text-indigo-200">
                (Developer)-[:KNOWS]-&gt;(:Skill &#123;name: &quot;{selectedSkill}&quot;&#125;)
              </span>
            )}
            {selectedTech && (
              <span className="font-semibold bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-200">
                (Developer)-[:BUILT]-&gt;(:Project)-[:USES]-&gt;(:Technology &#123;name: &quot;{selectedTech}&quot;&#125;)
              </span>
            )}
          </div>
          <button
            onClick={() => {
              onSkillChange('');
              onTechChange('');
            }}
            className="text-slate-400 hover:text-slate-200 underline font-medium"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
}
