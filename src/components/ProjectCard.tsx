import type { DeveloperProject } from '@/lib/types';
import TechTag from '@/components/TechTag';

interface ProjectCardProps {
  project: DeveloperProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const roleBadgeClass =
    project.role === 'lead'
      ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60'
      : project.role === 'solo'
      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
      : 'bg-slate-800/80 text-slate-300 border-slate-700/60';

  return (
    <div className="card p-6 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>{project.name}</span>
            </h4>
            {project.company && (
              <p className="text-xs text-indigo-400 font-medium mt-0.5">
                Built for {project.company.name} ({project.company.industry})
              </p>
            )}
          </div>
          <span
            className={`px-2.5 py-0.5 text-xs font-medium rounded-full border capitalize ${roleBadgeClass}`}
          >
            {project.role} &bull; {project.year}
          </span>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          {project.description}
        </p>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-800">
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs font-semibold text-slate-400 mr-1">
            Tech Stack:
          </span>
          {project.technologies.map((tech) => (
            <TechTag key={tech.id} tech={tech} />
          ))}
        </div>

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            <span>View Source Repository</span>
            <span>&nearr;</span>
          </a>
        )}
      </div>
    </div>
  );
}
