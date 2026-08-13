import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
  style,
  ...props
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: 'var(--bg-surface-1)',
        border: '1px solid var(--border-color)',
        borderRadius: 0,
        color: 'var(--text-primary)',
        fontSize: '13px',
        padding: '8px 12px',
        cursor: 'pointer',
        outline: 'none',
        transition: 'border-color 0.15s ease',
        ...style,
      }}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const lbl = typeof opt === 'string' ? opt : opt.label;
        return (
          <option key={val} value={val}>
            {lbl}
          </option>
        );
      })}
    </select>
  );
}
