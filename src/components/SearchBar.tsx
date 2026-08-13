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
    <div className="flex flex-col md:flex-row gap-3 mb-8">
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
          onChange={(e) => onSkillChange(e.target.value)}
          className="input-base px-3 py-2.5 text-sm cursor-pointer"
        >
          <option value="">All Skills</option>
          {skills.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={selectedTech}
          onChange={(e) => onTechChange(e.target.value)}
          className="input-base px-3 py-2.5 text-sm cursor-pointer"
        >
          <option value="">All Techs</option>
          {techs.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
