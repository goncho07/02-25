import { ROLES, Role } from './roles';

export interface MockCredential {
  username: string;
  password: string;
}

export const MOCK_CREDENTIALS: Record<Role, MockCredential> = {
  [ROLES.DIRECTOR]: { username: 'director', password: 'password' },
  [ROLES.TEACHER]: { username: 'docente', password: 'password' },
};
