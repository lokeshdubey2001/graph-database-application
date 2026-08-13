import type { DeveloperSkill, Skill } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';

interface SkillBadgeProps {
  skill: Skill | DeveloperSkill;
}

export default function SkillBadge({ skill }: SkillBadgeProps) {
  const isDevSkill = 'level' in skill;
  const level = isDevSkill ? (skill as DeveloperSkill).level : 'intermediate';

  return (
    <Badge variant={level as 'expert' | 'intermediate' | 'beginner'}>
      <span>{skill.name}</span>
      {isDevSkill && (
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            opacity: 0.7,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {level}
        </span>
      )}
    </Badge>
  );
}
