import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { ROUTES } from '../../config/routes';

type BreadcrumbConfig = Record<string, string>;

const BREADCRUMB_LABELS: BreadcrumbConfig = {
  [ROUTES.director.dashboard]: 'navigation.director.dashboard',
  [ROUTES.director.users]: 'navigation.director.users',
  [ROUTES.director.enrollment]: 'navigation.director.enrollment',
  [ROUTES.director.academic]: 'navigation.director.academic',
  [ROUTES.director.academicProgress]: 'navigation.director.academicProgress',
  [ROUTES.director.courseMonitoring]: 'navigation.director.courseMonitoring',
  [ROUTES.director.studentMonitoring]: 'navigation.director.studentMonitoring',
  [ROUTES.director.certificates]: 'navigation.director.certificates',
  [ROUTES.director.downloads]: 'navigation.director.downloads',
  [ROUTES.director.academicSettings]: 'navigation.director.academicSettings',
  [ROUTES.director.attendance]: 'navigation.director.attendance',
  [ROUTES.director.attendanceScanner]: 'navigation.director.attendanceScanner',
  [ROUTES.director.communications]: 'navigation.director.communications',
  [ROUTES.director.reports]: 'navigation.director.reports',
  [ROUTES.director.resources]: 'navigation.director.resources',
  [ROUTES.director.admin]: 'navigation.director.admin',
  [ROUTES.director.settings]: 'navigation.director.settings',
  [ROUTES.director.roles]: 'navigation.director.roles',
  [ROUTES.director.activityLog]: 'navigation.director.activityLog',
  [ROUTES.director.help]: 'navigation.director.help',
  [ROUTES.director.coexistence]: 'navigation.director.coexistence',
};

const formatFallbackLabel = (path: string) => {
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || '';

  return decodeURIComponent(lastSegment)
    .replace(/-/g, ' ')
    .replace(/\b\p{L}/gu, (match) => match.toUpperCase());
};

interface BreadcrumbItem {
  path: string;
  label: string;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const breadcrumbs = useMemo(() => {
    const normalizedPath = location.pathname.replace(/\/+$/, '') || '/';
    const segments = normalizedPath.split('/').filter(Boolean);
    const cumulativePaths = segments.map((_, index) => `/${segments.slice(0, index + 1).join('/')}`);
    const allPaths = ['/', ...cumulativePaths];
    const uniquePaths = Array.from(new Set(allPaths));

    return uniquePaths
      .map<BreadcrumbItem | null>((path) => {
        const labelKey = BREADCRUMB_LABELS[path];
        const label = labelKey ? t(labelKey) : formatFallbackLabel(path);

        if (!label) {
          return null;
        }

        return { path, label };
      })
      .filter((item): item is BreadcrumbItem => Boolean(item));
  }, [location.pathname, t]);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6" data-testid="breadcrumbs">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  aria-hidden="true"
                  className="mx-2 h-4 w-4 text-slate-400 dark:text-slate-600"
                />
              )}
              {isLast ? (
                <span className="font-semibold text-slate-600 dark:text-slate-200" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
