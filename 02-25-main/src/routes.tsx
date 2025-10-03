import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ROUTES } from '@/core/constants';

// Páginas
import Dashboard from '@/pages/Dashboard';
import UsersPage from '@/pages/UsersPage';
import GradesPage from '@/pages/GradesPage';
import LoginPage from '@/pages/LoginPage';

// Auth Guard
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <>{children}</>;
};

// Public Guard
const PublicGuard = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  return <>{children}</>;
};

// Layout con autenticación
const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard>
    <Layout>{children}</Layout>
  </AuthGuard>
);

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: (
      <PublicGuard>
        <LoginPage />
      </PublicGuard>
    ),
  },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <AuthLayout>
        <Dashboard />
      </AuthLayout>
    ),
  },
  {
    path: ROUTES.USERS,
    element: (
      <AuthLayout>
        <UsersPage />
      </AuthLayout>
    ),
  },
  {
    path: ROUTES.ACADEMIC,
    children: [
      {
        path: 'grades',
        element: (
          <AuthLayout>
            <GradesPage />
          </AuthLayout>
        ),
      },
      // Agregar más rutas académicas aquí
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);