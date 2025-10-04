import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  titleId?: string;
}

const joinClasses = (...values: Array<string | undefined>) => values.filter(Boolean).join(' ');

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  actions,
  children,
  className,
  contentClassName,
  titleId,
}) => {
  const headingId = titleId ?? (typeof title === 'string' ? `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-heading` : undefined);

  return (
    <header className={joinClasses('flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className={joinClasses('flex flex-1 items-start gap-4', contentClassName)}>
        {Icon && (
          <span
            className="mt-1 inline-flex rounded-full bg-slate-100 p-2 text-slate-600 dark:bg-slate-700 dark:text-slate-200"
            aria-hidden="true"
          >
            <Icon size={24} />
          </span>
        )}
        <div className="flex flex-1 flex-col gap-2">
          <h1 id={headingId} className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          {description ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {description}
            </p>
          ) : null}
          {children}
        </div>
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          {actions}
        </div>
      ) : null}
    </header>
  );
};

export default PageHeader;
