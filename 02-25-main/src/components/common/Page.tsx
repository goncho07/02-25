import React from 'react';
import { COLORS, SPACING } from '@/core/constants';
import { Card } from '../common/Card';

interface PageProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.MD,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.XS,
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: COLORS.TEXT.PRIMARY,
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: COLORS.TEXT.SECONDARY,
    margin: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.MD,
  },
  error: {
    padding: SPACING.MD,
    backgroundColor: COLORS.ERROR.LIGHT,
    color: COLORS.ERROR.DARK,
    borderRadius: '4px',
  },
};

export const Page: React.FC<PageProps> = ({
  children,
  title,
  subtitle,
  actions,
  loading,
  error,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>{title}</h1>
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>

      {error && (
        <Card variant="outlined">
          <div style={styles.error}>{error}</div>
        </Card>
      )}

      {loading ? (
        <Card>
          <div>Cargando...</div>
        </Card>
      ) : (
        <div style={styles.content}>{children}</div>
      )}
    </div>
  );
};

export default Page;