'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Network } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-primary)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="header-container">
        <Link
          href="/"
          aria-label="DevGraph home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: 0,
              backgroundColor: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0,
            }}
          >
            <Network size={14} />
          </div>
          <span className="header-brand-title" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Dev<span style={{ color: 'var(--accent)' }}>Graph</span>
          </span>
        </Link>

        <div className="header-right-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <nav role="navigation" aria-label="Main navigation" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <Link
              href="/"
              className="nav-link"
              style={{
                color: pathname === '/' ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: pathname === '/' ? 'var(--bg-surface-2)' : 'transparent',
              }}
            >
              Developers
            </Link>
            <Link
              href="/explore"
              className="nav-link"
              style={{
                color: pathname === '/explore' ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: pathname === '/explore' ? 'var(--bg-surface-2)' : 'transparent',
              }}
            >
              Explore
            </Link>
          </nav>

          <div />

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
