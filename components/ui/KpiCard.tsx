import React from 'react';
import type { LucideIcon } from 'lucide-react';

type KpiCardVariant = 'default' | 'gradient';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  variant?: KpiCardVariant;
  color?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  iconSize?: number;
  isToggle?: boolean;
}

const buildClassName = (classes: string[]) => classes.filter(Boolean).join(' ');

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  variant = 'default',
  color,
  active = false,
  onClick,
  className,
  iconSize = 28,
  isToggle = false,
}) => {
  const isGradient = variant === 'gradient';
  const Tag = (onClick ? 'button' : 'div') as 'button' | 'div';
  const gradientFallback = 'from-indigo-500 to-purple-600';
  const gradientClasses = color && /from-[\w-]+.*to-[\w-]+/.test(color) ? color : gradientFallback;

  const containerClassName = buildClassName([
    'rounded-2xl',
    'p-5',
    'flex',
    'flex-col',
    'gap-3',
    'transition-all',
    'duration-200',
    'shadow-sm',
    'hover:shadow-lg',
    onClick ? 'cursor-pointer hover:-translate-y-1' : '',
    isGradient
      ? buildClassName([
          'text-white',
          'bg-gradient-to-br',
          gradientClasses,
          'shadow-lg',
        ])
      : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60',
    active
      ? isGradient
        ? 'ring-2 ring-white/70 ring-offset-2 ring-offset-transparent'
        : 'ring-2 ring-indigo-500 dark:ring-indigo-400'
      : '',
    onClick
      ? buildClassName([
          'focus:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-indigo-500',
          'focus-visible:ring-offset-2',
          isGradient ? 'focus-visible:ring-offset-transparent' : 'focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900',
        ])
      : '',
    className || '',
  ]);

  const iconWrapperClassName = isGradient
    ? 'w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white'
    : 'w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300 flex items-center justify-center';

  const valueClassName = buildClassName([
    'text-3xl',
    'font-bold',
    isGradient ? 'text-white' : 'text-slate-800 dark:text-slate-100',
  ]);

  const titleClassName = buildClassName([
    'text-sm',
    'font-medium',
    isGradient ? 'text-white/80' : 'text-slate-500 dark:text-slate-400',
  ]);

  const descriptionClassName = buildClassName([
    'text-sm',
    isGradient ? 'text-white/70' : 'text-slate-500 dark:text-slate-400',
  ]);

  const interactiveProps = onClick
    ? ({
        onClick,
        type: 'button',
        ...(isToggle ? { 'aria-pressed': active } : {}),
      } as const)
    : ({} as const);

  return (
    <Tag className={containerClassName} {...interactiveProps}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className={titleClassName}>{title}</span>
          <span className={valueClassName}>{value}</span>
        </div>
        <div className={iconWrapperClassName} aria-hidden="true">
          <Icon size={iconSize} />
        </div>
      </div>
      {description ? <p className={descriptionClassName}>{description}</p> : null}
    </Tag>
  );
};

export default KpiCard;
