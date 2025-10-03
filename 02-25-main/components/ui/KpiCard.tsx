import React from 'react';
import { LucideProps } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: React.ComponentType<LucideProps>;
  variant?: 'default' | 'gradient';
  color?: string;
  className?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon: Icon,
  variant = 'default',
  color = 'from-indigo-600 to-blue-800',
  className = '',
}) => {
  const defaultClasses = 'p-6 rounded-2xl h-full shadow-sm flex flex-col transition-all';
  const baseClasses = variant === 'gradient'
    ? `${defaultClasses} bg-gradient-to-br ${color} shadow-lg`
    : `${defaultClasses} bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80`;

  return (
    <div className={`${baseClasses} ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <span className={`text-sm font-semibold ${variant === 'gradient' ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
          {title}
        </span>
        {Icon && <Icon size={24} className={variant === 'gradient' ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'} />}
      </div>
      <h3 className={`font-bold text-3xl ${variant === 'gradient' ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
        {value}
      </h3>
    </div>
  );
};

export default KpiCard;