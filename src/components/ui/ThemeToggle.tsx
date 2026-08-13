'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('devgraph-theme') as 'dark' | 'light' | null;
    const initial = stored || 'dark';
    setTheme(initial);
    if (initial === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('devgraph-theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{
        background: 'var(--bg-surface-2)',
        color: 'var(--text-primary)',
        borderRadius: 0,
        padding: '6px 10px',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        fontWeight: 500,
        transition: 'all 0.15s ease',
      }}
    >
      {theme === 'dark' ? (
        <>
          <Sun size={14} style={{ color: '#fbbf24' }} />
        </>
      ) : (
        <>
          <Moon size={14} style={{ color: '#6366f1' }} />
        </>
      )}
    </button>
  );
}
