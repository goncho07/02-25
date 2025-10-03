import React from 'react';
import { COLORS, SPACING, TYPOGRAPHY, Z_INDEX, SHADOWS } from '@/core/constants';
import { Button } from '../common/Button';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onMenuClick?: () => void;
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${SPACING.SM}px ${SPACING.MD}px`,
    backgroundColor: COLORS.BACKGROUND.PAPER,
    boxShadow: SHADOWS.SM,
    position: 'sticky',
    top: 0,
    zIndex: Z_INDEX.APP_BAR,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  logoText: {
    fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.PRIMARY.MAIN,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.MD,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  userName: {
    fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT.PRIMARY,
  },
  userRole: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    color: COLORS.TEXT.SECONDARY,
  },
};

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <button onClick={onMenuClick} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
          <span className="menu-icon" />
        </button>
        <span style={styles.logoText}>Sistema Académico</span>
      </div>
      <div style={styles.actions}>
        <div style={styles.userInfo}>
          <div>
            <div style={styles.userName}>{user?.name}</div>
            <div style={styles.userRole}>{user?.role}</div>
          </div>
          <Button
            variant="secondary"
            size="small"
            onClick={logout}
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;