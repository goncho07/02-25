import { ENV } from './environment';

const DEFAULT_LOGO_URL = 'https://cdn-icons-png.flaticon.com/512/2602/2602414.png';
const DEFAULT_USER_AVATAR_URL = 'https://picsum.photos/seed/director/48/48';
const DEFAULT_INSTITUTION_NAME = 'IEE 6049 Ricardo Palma';
const DEFAULT_USER_NAME = 'Ángel G. Morales';

export const BRANDING = {
  logoUrl: ENV.logoUrl || DEFAULT_LOGO_URL,
  institutionName: ENV.institutionName || DEFAULT_INSTITUTION_NAME,
  userAvatar: ENV.userAvatar || DEFAULT_USER_AVATAR_URL,
  defaultUserName: ENV.defaultUserName || DEFAULT_USER_NAME,
};
