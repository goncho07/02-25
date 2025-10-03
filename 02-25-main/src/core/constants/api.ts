// Configuración de endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Usuarios
  USERS: {
    BASE: '/users',
    GET_BY_ID: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    BULK_DELETE: '/users/bulk-delete',
    SEARCH: '/users/search',
  },

  // Estudiantes
  STUDENTS: {
    BASE: '/students',
    GET_BY_ID: (id: string) => `/students/${id}`,
    CREATE: '/students',
    UPDATE: (id: string) => `/students/${id}`,
    DELETE: (id: string) => `/students/${id}`,
    GET_GRADES: (id: string) => `/students/${id}/grades`,
    GET_ATTENDANCE: (id: string) => `/students/${id}/attendance`,
  },

  // Profesores
  TEACHERS: {
    BASE: '/teachers',
    GET_BY_ID: (id: string) => `/teachers/${id}`,
    CREATE: '/teachers',
    UPDATE: (id: string) => `/teachers/${id}`,
    DELETE: (id: string) => `/teachers/${id}`,
    GET_COURSES: (id: string) => `/teachers/${id}/courses`,
    GET_SCHEDULE: (id: string) => `/teachers/${id}/schedule`,
  },

  // Cursos
  COURSES: {
    BASE: '/courses',
    GET_BY_ID: (id: string) => `/courses/${id}`,
    CREATE: '/courses',
    UPDATE: (id: string) => `/courses/${id}`,
    DELETE: (id: string) => `/courses/${id}`,
    GET_STUDENTS: (id: string) => `/courses/${id}/students`,
    GET_ATTENDANCE: (id: string) => `/courses/${id}/attendance`,
    GET_GRADES: (id: string) => `/courses/${id}/grades`,
  },

  // Calificaciones
  GRADES: {
    BASE: '/grades',
    GET_BY_ID: (id: string) => `/grades/${id}`,
    CREATE: '/grades',
    UPDATE: (id: string) => `/grades/${id}`,
    DELETE: (id: string) => `/grades/${id}`,
    BULK_CREATE: '/grades/bulk-create',
    BULK_UPDATE: '/grades/bulk-update',
  },

  // Asistencia
  ATTENDANCE: {
    BASE: '/attendance',
    GET_BY_ID: (id: string) => `/attendance/${id}`,
    CREATE: '/attendance',
    UPDATE: (id: string) => `/attendance/${id}`,
    DELETE: (id: string) => `/attendance/${id}`,
    BULK_CREATE: '/attendance/bulk-create',
    BULK_UPDATE: '/attendance/bulk-update',
  },

  // Reportes
  REPORTS: {
    ACADEMIC_PERFORMANCE: '/reports/academic-performance',
    ATTENDANCE_SUMMARY: '/reports/attendance-summary',
    COURSE_PROGRESS: '/reports/course-progress',
    STUDENT_REPORT_CARD: (studentId: string) => `/reports/student/${studentId}/report-card`,
    CLASS_STATISTICS: (courseId: string) => `/reports/course/${courseId}/statistics`,
  },

  // Notificaciones
  NOTIFICATIONS: {
    BASE: '/notifications',
    GET_BY_ID: (id: string) => `/notifications/${id}`,
    CREATE: '/notifications',
    UPDATE: (id: string) => `/notifications/${id}`,
    DELETE: (id: string) => `/notifications/${id}`,
    MARK_AS_READ: (id: string) => `/notifications/${id}/read`,
    GET_UNREAD: '/notifications/unread',
  },

  // Configuración
  SETTINGS: {
    BASE: '/settings',
    GET_ALL: '/settings',
    UPDATE: '/settings',
    ACADEMIC_CALENDAR: '/settings/academic-calendar',
    GRADING_SYSTEM: '/settings/grading-system',
    SCHOOL_INFO: '/settings/school-info',
  },
} as const;

// Configuración de headers comunes para las peticiones
export const API_HEADERS = {
  COMMON: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  MULTIPART: {
    'Content-Type': 'multipart/form-data',
  },
} as const;

// Configuración de tiempo de espera para las peticiones
export const API_TIMEOUTS = {
  DEFAULT: 30000, // 30 segundos
  UPLOAD: 60000, // 60 segundos para subidas
  DOWNLOAD: 60000, // 60 segundos para descargas
  REPORT_GENERATION: 120000, // 120 segundos para generación de reportes
} as const;

// Códigos de estado HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Mensajes de error comunes
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
  TIMEOUT_ERROR: 'La solicitud ha excedido el tiempo de espera.',
  SERVER_ERROR: 'Error en el servidor. Por favor, intenta más tarde.',
  UNAUTHORIZED: 'No autorizado. Por favor, inicia sesión nuevamente.',
  FORBIDDEN: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  VALIDATION_ERROR: 'Error de validación. Por favor, verifica los datos ingresados.',
} as const;