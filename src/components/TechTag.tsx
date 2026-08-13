import type { Technology } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';

interface TechTagProps {
  tech: Pick<Technology, 'id' | 'name' | 'domain'>;
}

export default function TechTag({ tech }: TechTagProps) {
  const domain = tech.domain || 'backend';

  return (
    <Badge variant={domain as 'frontend' | 'backend' | 'infra' | 'data'} mono>
      {tech.name}
    </Badge>
  );
}
