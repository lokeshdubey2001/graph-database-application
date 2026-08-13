import Link from 'next/link';
import type { Developer } from '@/lib/types';

interface DeveloperCardProps {
  developer: Developer;
}

export default function DeveloperCard({ developer }: DeveloperCardProps) {
  return (
    <div className="card p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-200 group">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <img
              src={developer.avatarUrl}
              alt={developer.name}
              className="w-12 h-12 rounded-full object-cover border border-slate-700 group-hover:border-indigo-500/40 transition-colors"
            />
            <div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                {developer.name}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <span>📍</span> {developer.location}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 whitespace-nowrap">
            {developer.yearsExp} yrs exp
          </span>
        </div>

        <p className="text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {developer.bio}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-2">
        <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
          View Graph Profile &rarr;
        </span>
        <Link
          href={`/developers/${developer.id}`}
          className="btn-ghost px-3 py-1.5 text-xs font-medium"
        >
          Explore Profile
        </Link>
      </div>
    </div>
  );
}
