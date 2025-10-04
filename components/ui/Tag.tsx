import React from 'react';
import { X } from 'lucide-react';

type TagVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  icon?: React.ElementType;
  onRemove?: () => void;
  className?: string;
  removableLabel?: string;
}

const VARIANT_STYLES: Record<TagVariant, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-200',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  danger: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200',
  info: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200',
};

const buildClassName = (classes: string[]) => classes.filter(Boolean).join(' ');

const Tag: React.FC<TagProps> = ({
  children,
  variant = 'default',
  icon: Icon,
  onRemove,
  className,
  removableLabel = 'Quitar etiqueta',
}) => {
  const containerClassName = buildClassName([
    'inline-flex',
    'items-center',
    'gap-1.5',
    'rounded-full',
    'px-3',
    'py-1',
    'text-sm',
    'font-semibold',
    VARIANT_STYLES[variant],
    onRemove ? 'pr-2' : '',
    className || '',
  ]);

  return (
    <span className={containerClassName} data-variant={variant}>
      {Icon ? <Icon size={14} className="shrink-0" aria-hidden="true" /> : null}
      <span>{children}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 rounded-full p-1 transition-colors hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500 dark:hover:bg-white/10"
          aria-label={removableLabel}
        >
          <X size={12} aria-hidden="true" />
        </button>
      ) : null}
    </span>
  );
};

export default Tag;
