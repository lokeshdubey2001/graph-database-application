import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'expert' | 'intermediate' | 'beginner' | 'frontend' | 'backend' | 'infra' | 'data' | 'neutral';
  mono?: boolean;
}

export function Badge({ children, variant = 'neutral', mono = false }: BadgeProps) {
  const getBadgeClass = () => {
    switch (variant) {
      case 'expert': return 'badge-expert';
      case 'intermediate': return 'badge-intermediate';
      case 'beginner': return 'badge-beginner';
      case 'frontend': return 'tag-frontend';
      case 'backend': return 'tag-backend';
      case 'infra': return 'tag-infra';
      case 'data': return 'tag-data';
      default: return 'card-inset';
    }
  };

  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium ${getBadgeClass()} ${mono ? 'mono' : ''}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', borderRadius: 0 }}
    >
      {children}
    </span>
  );
}
