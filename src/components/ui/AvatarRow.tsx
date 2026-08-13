import Link from 'next/link';

interface AvatarRowProps {
  id?: string;
  name: string;
  avatarUrl: string;
  subtitle: string;
  badgeText?: string | number;
  badgeColor?: string;
}

export function AvatarRow({
  id,
  name,
  avatarUrl,
  subtitle,
  badgeText,
  badgeColor = 'var(--accent)',
}: AvatarRowProps) {
  return (
    <div
      className="card-inset"
      style={{
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        <img
          src={avatarUrl}
          alt={name}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: 0,
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
        <div style={{ minWidth: 0 }}>
          {id ? (
            <Link
              href={`/developers/${id}`}
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                textDecoration: 'none',
              }}
            >
              {name}
            </Link>
          ) : (
            <span
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}
            >
              {name}
            </span>
          )}
          <p
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
      {badgeText !== undefined && (
        <span
          style={{
            fontSize: '11px',
            color: badgeColor,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {badgeText}
        </span>
      )}
    </div>
  );
}
