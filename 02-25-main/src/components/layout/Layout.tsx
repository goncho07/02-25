import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { COLORS, SPACING, Z_INDEX } from '@/core/constants';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  isOffline?: boolean;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: COLORS.BACKGROUND.DEFAULT,
  },
  main: {
    display: 'flex',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.MD,
    overflow: 'auto',
  },
  offlineBanner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.WARNING.MAIN,
    color: '#fff',
    padding: SPACING.SM,
    textAlign: 'center',
    zIndex: Z_INDEX.SNACKBAR,
  },
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  showSidebar = true,
  isOffline = false,
}) => {
  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.main}>
        {showSidebar && <Sidebar />}
        <main style={styles.content}>{children}</main>
      </div>
      {isOffline && (
        <div style={styles.offlineBanner}>
          Estás trabajando sin conexión. Los cambios se sincronizarán cuando vuelvas a estar en línea.
        </div>
      )}
    </div>
  );
};

export default Layout;