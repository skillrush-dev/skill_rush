// src/components/InteractiveButton.tsx
import React from 'react';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  ariaLabel?: string;
};

export default function InteractiveButton({ children, onClick, variant = 'primary', className = '', ariaLabel }: Props) {
  const base = 'inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform active:scale-95';
  const variants: Record<string,string> = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500',
    secondary: 'bg-white text-teal-700 border border-teal-200 hover:bg-teal-50 focus:ring-teal-400',
    ghost: 'bg-transparent text-teal-700 hover:bg-teal-50 focus:ring-teal-300'
  };
  const classes = `${base} ${variants[variant]} ${className}`;

  return (
    <button aria-label={ariaLabel} type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
