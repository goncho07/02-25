import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DIRECTOR_NAVIGATION, TEACHER_NAVIGATION } from '../config/navigation';
import { Role, ROLES } from '../config/roles';
import { NavigationItemConfig } from '../types';

export interface NavigationItem extends NavigationItemConfig {
  label: string;
}

export const useNavigationItems = (role: Role): NavigationItem[] => {
  const { t } = useTranslation();

  return useMemo(() => {
    const navigation = role === ROLES.DIRECTOR ? DIRECTOR_NAVIGATION : TEACHER_NAVIGATION;

    return navigation.map((item) => ({
      ...item,
      label: t(item.labelKey),
    }));
  }, [role, t]);
};
