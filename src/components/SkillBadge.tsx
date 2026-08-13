import type { DeveloperSkill, Skill } from '@/lib/types';

interface SkillBadgeProps {
  skill: Skill | DeveloperSkill;
}

export default function SkillBadge({ skill }: SkillBadgeProps) {
  const isDevSkill = 'level' in skill;
  const levelClass = isDevSkill ? `badge-${(skill as DeveloperSkill).level}` : 'badge-intermediate';

  return (
    <span
      className={`px-2.5 py-1 text-xs font-medium rounded-md border ${levelClass} inline-flex items-center gap-1.5`}
    >
      <span>{skill.name}</span>
      {isDevSkill && (
        <span className="opacity-75 text-[10px] uppercase tracking-wider font-semibold">
          {(skill as DeveloperSkill).level}
        </span>
      )}
    </span>
  );
}
