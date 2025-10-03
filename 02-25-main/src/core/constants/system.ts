// Constantes del sistema académico
export const ACADEMIC = {
  GRADING_SCALE: {
    MIN: 0,
    MAX: 20,
    PASS_THRESHOLD: 11,
  },
  PERIODS: {
    BIMESTER: 'bimester',
    TRIMESTER: 'trimester',
    SEMESTER: 'semester',
  },
  STUDENT_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    GRADUATED: 'graduated',
  },
  ATTENDANCE_STATUS: {
    PRESENT: 'present',
    ABSENT: 'absent',
    LATE: 'late',
    JUSTIFIED: 'justified',
  },
} as const;

// Roles del sistema
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  DIRECTOR: 'director',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
  STAFF: 'staff',
} as const;

// Permisos del sistema
export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_GRADES: 'manage_grades',
  MANAGE_ATTENDANCE: 'manage_attendance',
  MANAGE_REPORTS: 'manage_reports',
  MANAGE_SETTINGS: 'manage_settings',
} as const;

// Estado de elementos del sistema
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
} as const;

// Prioridades
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

// Tipos de notificación
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Formatos de fecha
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  API: 'yyyy-MM-dd',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  API_WITH_TIME: 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'',
} as const;

// Límites y paginación
export const LIMITS = {
  ITEMS_PER_PAGE: 10,
  MAX_ITEMS_PER_PAGE: 100,
  MAX_FILE_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES_PER_UPLOAD: 10,
} as const;

// Rutas de navegación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  ACADEMIC: '/academic',
  ATTENDANCE: '/attendance',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;