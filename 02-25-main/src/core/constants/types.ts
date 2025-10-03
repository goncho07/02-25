// Tipos para las constantes del sistema
export type AcademicGradingScale = {
  MIN: number;
  MAX: number;
  PASS_THRESHOLD: number;
};

export type AcademicPeriods = {
  BIMESTER: 'bimester';
  TRIMESTER: 'trimester';
  SEMESTER: 'semester';
};

export type StudentStatus = {
  ACTIVE: 'active';
  INACTIVE: 'inactive';
  SUSPENDED: 'suspended';
  GRADUATED: 'graduated';
};

export type AttendanceStatus = {
  PRESENT: 'present';
  ABSENT: 'absent';
  LATE: 'late';
  JUSTIFIED: 'justified';
};

export type SystemRoles = {
  SUPER_ADMIN: 'super_admin';
  ADMIN: 'admin';
  DIRECTOR: 'director';
  TEACHER: 'teacher';
  STUDENT: 'student';
  PARENT: 'parent';
  STAFF: 'staff';
};

export type SystemPermissions = {
  VIEW_DASHBOARD: 'view_dashboard';
  MANAGE_USERS: 'manage_users';
  MANAGE_ROLES: 'manage_roles';
  MANAGE_GRADES: 'manage_grades';
  MANAGE_ATTENDANCE: 'manage_attendance';
  MANAGE_REPORTS: 'manage_reports';
  MANAGE_SETTINGS: 'manage_settings';
};

export type SystemStatus = {
  ACTIVE: 'active';
  INACTIVE: 'inactive';
  PENDING: 'pending';
  COMPLETED: 'completed';
  CANCELLED: 'cancelled';
  FAILED: 'failed';
};

export type PriorityLevels = {
  LOW: 'low';
  MEDIUM: 'medium';
  HIGH: 'high';
  URGENT: 'urgent';
};

export type NotificationTypes = {
  SUCCESS: 'success';
  ERROR: 'error';
  WARNING: 'warning';
  INFO: 'info';
};

export type DateFormats = {
  DISPLAY: string;
  API: string;
  DISPLAY_WITH_TIME: string;
  API_WITH_TIME: string;
};

export type SystemLimits = {
  ITEMS_PER_PAGE: number;
  MAX_ITEMS_PER_PAGE: number;
  MAX_FILE_UPLOAD_SIZE: number;
  MAX_FILES_PER_UPLOAD: number;
};

export type SystemRoutes = {
  HOME: '/';
  LOGIN: '/login';
  DASHBOARD: '/dashboard';
  USERS: '/users';
  ACADEMIC: '/academic';
  ATTENDANCE: '/attendance';
  REPORTS: '/reports';
  SETTINGS: '/settings';
};

// Tipos para el tema
export type ColorShades = {
  MAIN: string;
  LIGHT: string;
  DARK: string;
};

export type GreyScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

export type TextColors = {
  PRIMARY: string;
  SECONDARY: string;
  DISABLED: string;
};

export type BackgroundColors = {
  DEFAULT: string;
  PAPER: string;
};

export type SpacingScale = {
  UNIT: number;
  XS: number;
  SM: number;
  MD: number;
  LG: number;
  XL: number;
  XXL: number;
};

export type Typography = {
  FONT_FAMILY: {
    PRIMARY: string;
    SECONDARY: string;
    MONO: string;
  };
  FONT_WEIGHT: {
    LIGHT: number;
    REGULAR: number;
    MEDIUM: number;
    BOLD: number;
  };
  FONT_SIZE: {
    XS: string;
    SM: string;
    MD: string;
    LG: string;
    XL: string;
    XXL: string;
  };
  LINE_HEIGHT: {
    XS: number;
    SM: number;
    MD: number;
    LG: number;
    XL: number;
  };
};

export type Breakpoints = {
  XS: number;
  SM: number;
  MD: number;
  LG: number;
  XL: number;
};

export type BorderRadius = {
  NONE: string;
  XS: string;
  SM: string;
  MD: string;
  LG: string;
  XL: string;
  ROUND: string;
};

export type BorderWidth = {
  NONE: number;
  XS: string;
  SM: string;
  MD: string;
  LG: string;
  XL: string;
};

export type TransitionDuration = {
  SHORTEST: number;
  SHORTER: number;
  SHORT: number;
  STANDARD: number;
  COMPLEX: number;
  ENTERING_SCREEN: number;
  LEAVING_SCREEN: number;
};

export type TransitionEasing = {
  EASE_IN_OUT: string;
  EASE_OUT: string;
  EASE_IN: string;
  SHARP: string;
};

export type ZIndex = {
  MODAL: number;
  SNACKBAR: number;
  TOOLTIP: number;
  POPOVER: number;
  DRAWER: number;
  APP_BAR: number;
  MENU: number;
  BACKDROP: number;
};

// Tipos para la API
export type ApiEndpoint = string;
export type ApiEndpointWithParam = (id: string) => string;

export type ApiHeaders = {
  'Content-Type': string;
  'Accept': string;
  'Authorization'?: string;
};

export type ApiTimeouts = {
  DEFAULT: number;
  UPLOAD: number;
  DOWNLOAD: number;
  REPORT_GENERATION: number;
};

export type HttpStatus = {
  OK: number;
  CREATED: number;
  ACCEPTED: number;
  NO_CONTENT: number;
  BAD_REQUEST: number;
  UNAUTHORIZED: number;
  FORBIDDEN: number;
  NOT_FOUND: number;
  METHOD_NOT_ALLOWED: number;
  CONFLICT: number;
  UNPROCESSABLE_ENTITY: number;
  INTERNAL_SERVER_ERROR: number;
  SERVICE_UNAVAILABLE: number;
};

export type ApiErrorMessages = {
  NETWORK_ERROR: string;
  TIMEOUT_ERROR: string;
  SERVER_ERROR: string;
  UNAUTHORIZED: string;
  FORBIDDEN: string;
  NOT_FOUND: string;
  VALIDATION_ERROR: string;
};