import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Developer } from '@/lib/types';

interface DeveloperCardProps {
  developer: Developer;
}

export default function DeveloperCard({ developer }: DeveloperCardProps) {
  return (
    <Link
      href={`/developers/${developer.id}`}
      className="card-interactive p-5 flex flex-col gap-4 block"
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', borderRadius: 0 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <img
          src={developer.avatarUrl}
          alt={developer.name}
          width={40}
          height={40}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 0,
            objectFit: 'cover',
            border: '1px solid var(--border-color)',
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <h3
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
                lineHeight: '1.4',
              }}
            >
              {developer.name}
            </h3>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {developer.yearsExp}y exp
            </span>
          </div>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              margin: '2px 0 0',
              lineHeight: '1.4',
            }}
          >
            {developer.location}
          </p>
        </div>
      </div>

      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: '1.55',
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {developer.bio}
      </p>

      <div
        style={{
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          View profile
        </span>
        <ArrowRight size={14} style={{ color: 'var(--accent)' }} />
      </div>
    </Link>
  );
}
