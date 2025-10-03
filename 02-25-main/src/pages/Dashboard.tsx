import React from 'react';
import { Page } from '@/components/common/Page';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { COLORS, SPACING } from '@/core/constants';
import { useAuth } from '@/hooks/useAuth';

const styles: Record<string, React.CSSProperties> = {
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: SPACING.MD,
    marginBottom: SPACING.LG,
  },
  statCard: {
    textAlign: 'center',
    padding: SPACING.MD,
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: COLORS.PRIMARY.MAIN,
    marginBottom: SPACING.XS,
  },
  statLabel: {
    fontSize: '14px',
    color: COLORS.TEXT.SECONDARY,
  },
  chartsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: SPACING.MD,
  },
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState({
    totalStudents: 0,
    totalTeachers: 0,
    activeClasses: 0,
    averageAttendance: 0,
  });

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Aquí iría la llamada a la API
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) {
          throw new Error('Error al cargar los datos del dashboard');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const renderStatCard = (value: number, label: string) => (
    <Card variant="elevated" style={styles.statCard}>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </Card>
  );

  return (
    <Page
      title={`Bienvenido, ${user?.name}`}
      subtitle="Resumen general del sistema"
      loading={isLoading}
      error={error}
      actions={
        <Button
          variant="primary"
          onClick={() => {/* Generar reporte */}}
        >
          Generar Reporte
        </Button>
      }
    >
      <div style={styles.statsContainer}>
        {renderStatCard(stats.totalStudents, 'Estudiantes Totales')}
        {renderStatCard(stats.totalTeachers, 'Profesores')}
        {renderStatCard(stats.activeClasses, 'Clases Activas')}
        {renderStatCard(stats.averageAttendance, 'Asistencia Promedio (%)')}
      </div>

      <div style={styles.chartsContainer}>
        <Card variant="default" padding="medium">
          {/* Aquí iría el componente de gráfico de asistencia */}
          <h3>Asistencia por Período</h3>
        </Card>

        <Card variant="default" padding="medium">
          {/* Aquí iría el componente de gráfico de rendimiento */}
          <h3>Rendimiento Académico</h3>
        </Card>
      </div>
    </Page>
  );
};

export default Dashboard;