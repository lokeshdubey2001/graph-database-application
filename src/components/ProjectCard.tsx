import { ExternalLink } from 'lucide-react';
import type { DeveloperProject } from '@/lib/types';
import TechTag from '@/components/TechTag';

interface ProjectCardProps {
  project: DeveloperProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const roleColors: Record<string, string> = {
    lead: 'var(--accent)',
    solo: '#34d399',
    contributor: 'var(--text-muted)',
  };

  return (
    <div
      className="card"
      style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: '1.4' }}>
            {project.name}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: roleColors[project.role] ?? roleColors.contributor,
                textTransform: 'capitalize',
              }}
            >
              {project.role}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {project.year}
            </span>
          </div>
        </div>

        {project.company && (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 8px' }}>
            {project.company.name} | {project.company.industry}
          </p>
        )}

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.55', margin: 0 }}>
          {project.description}
        </p>
      </div>

      {project.technologies.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {project.technologies.map((tech) => (
            <TechTag key={tech.id} tech={tech} />
          ))}
        </div>
      )}

      {project.url && (
        <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '12px',
              color: 'var(--text-link)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>View repository</span>
            <ExternalLink size={12} />
          </a>
        </div>
      )}
    </div>
  );
}
