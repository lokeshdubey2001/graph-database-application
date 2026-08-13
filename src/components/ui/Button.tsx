import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export function Button({
  variant = 'secondary',
  children,
  style,
  ...props
}: ButtonProps) {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--accent)',
          color: '#ffffff',
          border: '1px solid transparent',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid transparent',
        };
      case 'secondary':
      default:
        return {
          background: 'var(--bg-surface-2)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
        };
    }
  };

  return (
    <button
      style={{
        padding: '6px 14px',
        borderRadius: 0,
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        transition: 'all 0.15s ease',
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
