export const ROUTES = {
  auth: {
    login: '/login',
    accessType: '/access-type',
  },
  director: {
    dashboard: '/',
    users: '/usuarios',
    enrollment: '/matricula',
    academic: '/academico',
    academicProgress: '/academico/avance-docentes',
    courseMonitoring: '/academico/monitoreo-cursos',
    studentMonitoring: '/academico/monitoreo-estudiantes',
    certificates: '/academico/actas-certificados',
    downloads: '/academico/reportes-descargas',
    academicSettings: '/academico/configuracion',
    attendance: '/asistencia',
    attendanceScanner: '/asistencia/scan',
    communications: '/comunicaciones',
    reports: '/reportes',
    resources: '/recursos',
    admin: '/admin',
    settings: '/settings',
    roles: '/settings/roles',
    activityLog: '/settings/activity-log',
    help: '/ayuda',
    coexistence: '/convivencia',
  },
  teacher: {
    dashboard: '/',
    gradeEntry: '/registrar-notas',
    gradebook: '/libro-calificaciones',
    communications: '/comunicaciones',
    help: '/ayuda',
  },
} as const;

export type RouteCollection<T> = T[keyof T];
export type DirectorRoute = RouteCollection<typeof ROUTES.director>;
export type TeacherRoute = RouteCollection<typeof ROUTES.teacher>;
export type AuthRoute = RouteCollection<typeof ROUTES.auth>;
export type AppRoute = DirectorRoute | TeacherRoute | AuthRoute;

export const DEFAULT_REDIRECTS = {
  fallback: ROUTES.director.dashboard,
  unauthorized: ROUTES.auth.accessType,
  teacher: ROUTES.teacher.dashboard,
} as const;
