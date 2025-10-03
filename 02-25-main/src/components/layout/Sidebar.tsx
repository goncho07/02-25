import React from 'react';
import { COLORS, SPACING, TYPOGRAPHY, Z_INDEX, SHADOWS } from '@/core/constants';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ComponentType;
  children?: NavItem[];
}

interface SidebarProps {
  navItems?: NavItem[];
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 280,
    backgroundColor: COLORS.BACKGROUND.PAPER,
    borderRight: `1px solid ${COLORS.GREY[200]}`,
    height: '100vh',
    position: 'sticky',
    top: 0,
    left: 0,
    overflowY: 'auto',
    boxShadow: SHADOWS.SM,
    zIndex: Z_INDEX.DRAWER,
  },
  navGroup: {
    padding: SPACING.SM,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.SM,
    padding: `${SPACING.SM}px ${SPACING.MD}px`,
    color: COLORS.TEXT.PRIMARY,
    textDecoration: 'none',
    borderRadius: '4px',
    margin: `${SPACING.XS}px 0`,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: COLORS.GREY[100],
    },
  },
  navItemActive: {
    backgroundColor: COLORS.PRIMARY.LIGHT,
    color: COLORS.PRIMARY.MAIN,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
  navItemIcon: {
    width: 20,
    height: 20,
    color: 'currentColor',
  },
  navItemLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
  },
  subNavItem: {
    paddingLeft: SPACING.XL,
  },
};

export const Sidebar: React.FC<SidebarProps> = ({ navItems = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const renderNavItem = (item: NavItem, isSubItem = false) => {
    const isActive = location.pathname === item.path;
    const itemStyle = {
      ...styles.navItem,
      ...(isActive && styles.navItemActive),
      ...(isSubItem && styles.subNavItem),
    };

    return (
      <div key={item.id}>
        <div
          style={itemStyle}
          onClick={() => navigate(item.path)}
          role="button"
          tabIndex={0}
        >
          {item.icon && <item.icon />}
          <span style={styles.navItemLabel}>{item.label}</span>
        </div>
        {item.children?.map((child) => renderNavItem(child, true))}
      </div>
    );
  };

  return (
    <nav style={styles.sidebar}>
      <div style={styles.navGroup}>
        {navItems.map((item) => renderNavItem(item))}
      </div>
    </nav>
  );
};

export default Sidebar;