import { ReactElement } from 'react';
import Layout from '../components/layout/Layout';
import TeacherLayout from '../components/layout/TeacherLayout';
import AcademicoPage from '../pages/AcademicoPage';
import AccessTypePage from '../pages/AccessTypePage';
import ActasCertificadosPage from '../pages/ActasCertificadosPage';
import ActivityLogPage from '../pages/ActivityLogPage';
import AdminFinanzasPage from '../pages/AdminFinanzasPage';
import AsistenciaPage from '../pages/AsistenciaPage';
import AvanceDocentesPage from '../pages/AvanceDocentesPage';
import AyudaPage from '../pages/AyudaPage';
import ComunicacionesPage from '../pages/ComunicacionesPage';
import ConfiguracionAcademicaPage from '../pages/ConfiguracionAcademicaPage';
import ConvivenciaPage from '../pages/ConvivenciaPage';
import Dashboard from '../pages/Dashboard';
import LibroCalificacionesPage from '../pages/LibroCalificacionesPage';
import LoginPage from '../pages/LoginPage';
import MatriculaPage from '../pages/MatriculaPage';
import MonitoreoCursosPage from '../pages/MonitoreoCursosPage';
import MonitoreoEstudiantesPage from '../pages/MonitoreoEstudiantesPage';
import QRScannerPage from '../pages/QRScannerPage';
import RegistrarNotasPage from '../pages/RegistrarNotasPage';
import ReportesAcademicosPage from '../pages/ReportesAcademicosPage';
import ReportesPage from '../pages/ReportesPage';
import RecursosPage from '../pages/RecursosPage';
import RolesPage from '../pages/RolesPage';
import SettingsPage from '../pages/SettingsPage';
import TeacherDashboard from '../pages/TeacherDashboard';
import UsersPage from '../pages/UsersPage';
import { ROUTES } from './routes';

export interface RouteDefinition {
  path: string;
  element: ReactElement;
}

export const DIRECTOR_LAYOUT = Layout;
export const TEACHER_LAYOUT = TeacherLayout;

export const DIRECTOR_ROUTES: RouteDefinition[] = [
  { path: ROUTES.director.dashboard, element: <Dashboard /> },
  { path: ROUTES.director.users, element: <UsersPage /> },
  { path: ROUTES.director.enrollment, element: <MatriculaPage /> },
  { path: ROUTES.director.academic, element: <AcademicoPage /> },
  { path: ROUTES.director.academicProgress, element: <AvanceDocentesPage /> },
  { path: ROUTES.director.courseMonitoring, element: <MonitoreoCursosPage /> },
  { path: ROUTES.director.studentMonitoring, element: <MonitoreoEstudiantesPage /> },
  { path: ROUTES.director.certificates, element: <ActasCertificadosPage /> },
  { path: ROUTES.director.downloads, element: <ReportesAcademicosPage /> },
  { path: ROUTES.director.academicSettings, element: <ConfiguracionAcademicaPage /> },
  { path: ROUTES.director.attendance, element: <AsistenciaPage /> },
  { path: ROUTES.director.attendanceScanner, element: <QRScannerPage /> },
  { path: ROUTES.director.communications, element: <ComunicacionesPage /> },
  { path: ROUTES.director.reports, element: <ReportesPage /> },
  { path: ROUTES.director.resources, element: <RecursosPage /> },
  { path: ROUTES.director.admin, element: <AdminFinanzasPage /> },
  { path: ROUTES.director.settings, element: <SettingsPage /> },
  { path: ROUTES.director.roles, element: <RolesPage /> },
  { path: ROUTES.director.activityLog, element: <ActivityLogPage /> },
  { path: ROUTES.director.help, element: <AyudaPage /> },
  { path: ROUTES.director.coexistence, element: <ConvivenciaPage /> },
];

export const TEACHER_ROUTES: RouteDefinition[] = [
  { path: ROUTES.teacher.dashboard, element: <TeacherDashboard /> },
  { path: ROUTES.teacher.gradeEntry, element: <RegistrarNotasPage /> },
  { path: ROUTES.teacher.gradebook, element: <LibroCalificacionesPage /> },
  { path: ROUTES.teacher.communications, element: <ComunicacionesPage /> },
  { path: ROUTES.teacher.help, element: <AyudaPage /> },
];

export const AUTH_ROUTES: RouteDefinition[] = [
  { path: ROUTES.auth.login, element: <LoginPage /> },
  { path: ROUTES.auth.accessType, element: <AccessTypePage /> },
];
