import type { Technology } from '@/lib/types';

interface TechTagProps {
  tech: Technology;
}

export default function TechTag({ tech }: TechTagProps) {
  const domainClass = `tag-${tech.domain || 'backend'}`;

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-mono font-medium rounded ${domainClass} inline-block`}
    >
      {tech.name}
    </span>
  );
}
