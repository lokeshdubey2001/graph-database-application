import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

export function Input({
  value,
  onChange,
  icon,
  style,
  placeholder,
  ...props
}: InputProps) {
  return (
    <div style={{ position: 'relative', flex: '1 1 240px' }}>
      {icon && (
        <span
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {icon}
        </span>
      )}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-color)',
          borderRadius: 0,
          color: 'var(--text-primary)',
          fontSize: '13px',
          padding: icon ? '8px 12px 8px 34px' : '8px 12px',
          outline: 'none',
          transition: 'border-color 0.15s ease',
          ...style,
        }}
        {...props}
      />
    </div>
  );
}
