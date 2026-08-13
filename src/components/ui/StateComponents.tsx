import { AlertCircle, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function DeveloperCardSkeleton() {
  return (
    <div className="card card-responsive-padding" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: 0, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', minWidth: 0 }}>
        <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: 0, flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
            <div className="skeleton" style={{ height: '14px', width: '60%', borderRadius: 0 }} />
            <div className="skeleton" style={{ height: '11px', width: '25px', borderRadius: 0 }} />
          </div>
          <div className="skeleton" style={{ height: '12px', width: '40%', borderRadius: 0 }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div className="skeleton" style={{ height: '12px', width: '100%', borderRadius: 0 }} />
        <div className="skeleton" style={{ height: '12px', width: '80%', borderRadius: 0 }} />
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton" style={{ height: '12px', width: '70px', borderRadius: 0 }} />
        <div className="skeleton" style={{ height: '14px', width: '14px', borderRadius: 0 }} />
      </div>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '16px',
      }}
      role="status"
      aria-label="Loading content"
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <DeveloperCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DeveloperProfileSkeleton() {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
      <div className="skeleton" style={{ height: '14px', width: '100px', marginBottom: '28px', borderRadius: 0 }} />

      <div className="card card-responsive-padding" style={{ padding: '24px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', borderRadius: 0, minWidth: 0 }}>
        <div className="skeleton" style={{ width: '56px', height: '56px', borderRadius: 0, flexShrink: 0 }} />
        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
          <div className="skeleton" style={{ height: '22px', width: '160px', borderRadius: 0 }} />
          <div className="skeleton" style={{ height: '14px', width: '120px', borderRadius: 0 }} />
          <div className="skeleton" style={{ height: '14px', width: '100%', borderRadius: 0 }} />
          <div className="skeleton" style={{ height: '14px', width: '80%', borderRadius: 0 }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card card-responsive-padding" style={{ padding: '20px', borderRadius: 0, minWidth: 0 }}>
          <div className="skeleton" style={{ height: '12px', width: '120px', marginBottom: '14px', borderRadius: 0 }} />
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: '24px', width: '64px', borderRadius: 0 }} />
            ))}
          </div>
        </div>
        <div className="card card-responsive-padding" style={{ padding: '20px', borderRadius: 0, minWidth: 0 }}>
          <div className="skeleton" style={{ height: '12px', width: '120px', marginBottom: '14px', borderRadius: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[1, 2].map((i) => (
              <div key={i} className="skeleton" style={{ height: '36px', width: '100%', borderRadius: 0 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="card-responsive-padding"
      style={{
        maxWidth: '420px',
        margin: '48px auto',
        padding: '24px',
        background: 'var(--bg-surface-1)',
        border: '1px solid rgba(224, 82, 82, 0.3)',
        borderRadius: 0,
        textAlign: 'center',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: 0,
          background: 'rgba(224, 82, 82, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px',
          color: '#e05252',
        }}
        aria-hidden="true"
      >
        <AlertCircle size={18} />
      </div>
      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
        Failed to load data
      </p>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: onRetry ? '16px' : '0', wordBreak: 'break-word' }}>
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" style={{ padding: '7px 16px' }}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your filters.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div
      style={{
        maxWidth: '360px',
        margin: '64px auto',
        textAlign: 'center',
        width: '100%',
        padding: '0 16px',
      }}
    >
      <SearchX
        size={36}
        style={{ margin: '0 auto 16px', display: 'block', color: 'var(--text-muted)' }}
        aria-hidden="true"
      />
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
        {description}
      </p>
    </div>
  );
}
