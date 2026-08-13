import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'DevGraph — Developer Knowledge & Skill Explorer',
    template: '%s | DevGraph',
  },
  description:
    'Explore developer skills, projects, and technology relationships powered by a graph database.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <nav
          style={{
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-surface-1)',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 1.5rem',
              height: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <a
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
              }}
            >
              <span
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background:
                    'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                D
              </span>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                Dev<span style={{ color: 'var(--color-accent-light)' }}>Graph</span>
              </span>
            </a>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <a href="/" className="nav-link">
                Developers
              </a>
              <a href="/explore" className="nav-link">
                Explore
              </a>
            </div>
          </div>
        </nav>

        <main
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem 1.5rem',
          }}
        >
          {children}
        </main>

        <style>{`
          .nav-link {
            padding: 6px 14px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            color: var(--color-text-secondary);
            text-decoration: none;
            transition: background 0.15s ease, color 0.15s ease;
          }
          .nav-link:hover {
            background: var(--color-surface-3);
            color: var(--color-text-primary);
          }
        `}</style>
      </body>
    </html>
  );
}
