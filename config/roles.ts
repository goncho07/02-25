export const ROLES = {
  DIRECTOR: 'director',
  TEACHER: 'teacher',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABEL_KEYS: Record<Role, string> = {
  [ROLES.DIRECTOR]: 'auth.roles.director',
  [ROLES.TEACHER]: 'auth.roles.teacher',
};
