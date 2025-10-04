import React, { ReactElement, ReactNode, useEffect, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AUTH_ROUTES, DIRECTOR_LAYOUT, DIRECTOR_ROUTES, TEACHER_LAYOUT, TEACHER_ROUTES } from './config/appRoutes';
import { DEFAULT_REDIRECTS, ROLES, THEME, ThemeMode, ENV } from './config';
import { Role } from './config/roles';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';
import ToastProvider from './components/ui/ToastProvider';

type LayoutComponent = React.ComponentType<{ children: ReactNode }>;
type RouteConfig = { path: string; element: ReactElement };

const renderRoutes = (routes: RouteConfig[], fallback: string) => (
    <Routes>
        {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
        ))}
        <Route path="*" element={<Navigate to={fallback} replace />} />
    </Routes>
);

const renderRoutesWithLayout = (Layout: LayoutComponent, routes: RouteConfig[], fallback: string) => (
    <Layout>
        {renderRoutes(routes, fallback)}
    </Layout>
);

const resolveTheme = (storedTheme: string | null, systemPrefersDark: boolean): ThemeMode => {
    if (storedTheme === THEME.dark || storedTheme === THEME.light) {
        return storedTheme;
    }
    return systemPrefersDark ? THEME.dark : THEME.light;
};

const App: React.FC = () => {
    const { isAuthenticated, user } = useAuthStore();
    const { setTheme } = useUIStore();
    const { i18n } = useTranslation();

    useEffect(() => {
        const storedTheme = localStorage.getItem(THEME.storageKey);
        const systemPrefersDark = window.matchMedia(THEME.mediaQuery).matches;
        const mode = resolveTheme(storedTheme, systemPrefersDark);
        setTheme(mode);
    }, [setTheme]);

    useEffect(() => {
        if (ENV.defaultLanguage && ENV.defaultLanguage !== i18n.language) {
            i18n.changeLanguage(ENV.defaultLanguage).catch((error) => {
                console.error('Failed to change language', error);
            });
        }
    }, [i18n]);

    const appContent = useMemo(() => {
        if (!isAuthenticated) {
            return renderRoutes(AUTH_ROUTES, DEFAULT_REDIRECTS.unauthorized);
        }

        const role: Role | undefined = user?.role;
        if (role === ROLES.DIRECTOR) {
            return renderRoutesWithLayout(DIRECTOR_LAYOUT, DIRECTOR_ROUTES, DEFAULT_REDIRECTS.fallback);
        }

        return renderRoutesWithLayout(TEACHER_LAYOUT, TEACHER_ROUTES, DEFAULT_REDIRECTS.teacher);
    }, [isAuthenticated, user?.role]);

    return (
        <>
            {appContent}
            <ToastProvider />
        </>
    );
};

export default App;
