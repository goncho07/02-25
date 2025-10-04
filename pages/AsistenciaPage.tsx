import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ClipboardCheck,
  Download,
  Info,
  List,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ModulePage from '../layouts/ModulePage';
import Button from '../components/ui/Button';
import { students } from '../data/students';
import { staff } from '../data/users';
import { track } from '../analytics/track';

const METRIC_DESCRIPTIONS = {
  attendance: 'Porcentaje de estudiantes o docentes que registraron asistencia en el periodo seleccionado.',
  absences: 'Cantidad total de ausencias registradas. Incluye inasistencias justificadas y no justificadas.',
  tardiness: 'Número de llegadas tarde registradas durante el periodo seleccionado.',
  coverage: 'Porcentaje de cursos o clases que cuentan con registro docente completo.',
};

const ALERT_CONTENT = {
  title: '2 secciones tienen asistencia crítica (< 85%)',
  description:
    'Revise y contacte a los responsables para confirmar asistencia o registrar novedades. Se sugiere actuar dentro de las próximas 24 horas.',
  actionLabel: 'Revisar secciones',
};

type PopulationFilter = 'estudiantes' | 'docentes';
type RangeFilter = 'Hoy' | 'Semana' | 'Mes' | 'Bimestre';

type SummaryMetric = {
  attendance: number;
  delta: number;
  absences: number;
  tardiness: number;
  coverage: number;
};

const SUMMARY_DATA: Record<PopulationFilter, Record<RangeFilter, SummaryMetric>> = {
  estudiantes: {
    Hoy: { attendance: 92, delta: -2, absences: 18, tardiness: 24, coverage: 87 },
    Semana: { attendance: 93, delta: 1, absences: 74, tardiness: 92, coverage: 89 },
    Mes: { attendance: 95, delta: 2, absences: 240, tardiness: 310, coverage: 91 },
    Bimestre: { attendance: 94, delta: 0, absences: 520, tardiness: 672, coverage: 92 },
  },
  docentes: {
    Hoy: { attendance: 97, delta: 1, absences: 2, tardiness: 5, coverage: 93 },
    Semana: { attendance: 96, delta: -1, absences: 12, tardiness: 18, coverage: 94 },
    Mes: { attendance: 95, delta: 0, absences: 40, tardiness: 54, coverage: 95 },
    Bimestre: { attendance: 96, delta: 1, absences: 86, tardiness: 120, coverage: 96 },
  },
};

const POPULATION_LABEL: Record<PopulationFilter, string> = {
  estudiantes: 'Estudiantes',
  docentes: 'Docentes',
};

const RANGE_OPTIONS: RangeFilter[] = ['Hoy', 'Semana', 'Mes', 'Bimestre'];

const InfoTooltip: React.FC<{ id: string; description: string }> = ({ id, description }) => (
  <div className="relative inline-flex group">
    <button
      type="button"
      aria-describedby={id}
      className="ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 group-hover:text-slate-900"
    >
      <Info size={20} aria-hidden="true" />
      <span id={id} className="sr-only">
        {description}
      </span>
    </button>
    <div
      role="tooltip"
      className="pointer-events-none absolute left-1/2 top-12 z-20 w-64 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700 shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
    >
      {description}
    </div>
  </div>
);

const ToggleButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`min-h-[44px] rounded-full border px-4 py-2 text-[18px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
      isActive
        ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
    }`}
    aria-pressed={isActive}
  >
    {label}
  </button>
);

const MetricItem: React.FC<{
  title: string;
  value: string;
  accent?: 'positive' | 'negative' | null;
  tooltipId: string;
  tooltipDescription: string;
  helperText?: string;
}> = ({ title, value, accent = null, tooltipId, tooltipDescription, helperText }) => {
  const accentColor =
    accent === 'positive'
      ? 'text-emerald-700'
      : accent === 'negative'
        ? 'text-rose-700'
        : 'text-slate-700';

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[18px] shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-slate-800">{title}</p>
        <InfoTooltip id={tooltipId} description={tooltipDescription} />
      </div>
      <p className={`mt-4 text-3xl font-bold text-slate-900 ${accentColor}`}>{value}</p>
      {helperText && <p className="mt-3 text-base text-slate-600">{helperText}</p>}
    </div>
  );
};

const formatDelta = (delta: number) => `${delta > 0 ? '+' : ''}${delta}% vs periodo anterior`;

const AsistenciaPage: React.FC = () => {
  const [population, setPopulation] = useState<PopulationFilter>('estudiantes');
  const [range, setRange] = useState<RangeFilter>('Hoy');

  const summary = SUMMARY_DATA[population][range];

  const distributionData = useMemo(() => {
    if (population === 'estudiantes') {
      const grouped = students.reduce<Record<string, { total: number; attendance: number }>>((acc, student) => {
        const key = `${student.grade} · ${student.section}`;
        if (!acc[key]) {
          acc[key] = { total: 0, attendance: 0 };
        }
        acc[key].total += 1;
        acc[key].attendance += student.attendancePercentage ?? 0;
        return acc;
      }, {});

      return Object.entries(grouped)
        .map(([name, data]) => ({
          name,
          asistencia: Math.round(data.attendance / Math.max(1, data.total)),
        }))
        .sort((a, b) => a.asistencia - b.asistencia)
        .slice(0, 6);
    }

    const groupedStaff = staff.reduce<Record<string, { total: number; coverage: number }>>((acc, person) => {
      const key = person.area || person.role || 'General';
      if (!acc[key]) {
        acc[key] = { total: 0, coverage: 0 };
      }
      acc[key].total += 1;
      acc[key].coverage += person.attendancePercentage ?? 0;
      return acc;
    }, {});

    return Object.entries(groupedStaff)
      .map(([name, data]) => ({
        name,
        asistencia: Math.round(data.coverage / Math.max(1, data.total)),
      }))
      .sort((a, b) => a.asistencia - b.asistencia)
      .slice(0, 6);
  }, [population]);

  const handleDownload = () => {
    track('attendance_download_panel', { poblacion: population, rango: range });
  };

  const handleViewList = () => {
    track('attendance_view_full_list', { poblacion: population, rango: range });
  };

  const metrics = [
    {
      key: 'attendance',
      title: 'Asistencia general',
      value: `${summary.attendance}%`,
      tooltip: METRIC_DESCRIPTIONS.attendance,
      helper: formatDelta(summary.delta),
      accent: summary.delta >= 0 ? 'positive' : 'negative',
    },
    {
      key: 'absences',
      title: 'Ausencias registradas',
      value: summary.absences.toString(),
      tooltip: METRIC_DESCRIPTIONS.absences,
      helper: 'Revise justificantes pendientes.',
      accent: 'negative' as const,
    },
    {
      key: 'tardiness',
      title: 'Tardanzas',
      value: summary.tardiness.toString(),
      tooltip: METRIC_DESCRIPTIONS.tardiness,
      helper: 'Alerta cuando supera el 10% del grupo.',
      accent: summary.tardiness > 0 ? 'negative' : null,
    },
    {
      key: 'coverage',
      title: 'Registros docentes completos',
      value: `${summary.coverage}%`,
      tooltip: METRIC_DESCRIPTIONS.coverage,
      helper: summary.coverage >= 95 ? 'Meta alcanzada.' : 'Meta institucional: 95%.',
      accent: summary.coverage >= 95 ? 'positive' : null,
    },
  ];

  return (
    <ModulePage
      title="Panel de Asistencia"
      description="Resumen claro y accesible del estado de asistencia institucional."
      icon={ClipboardCheck}
      content={
        <div className="mx-auto flex max-w-6xl flex-col gap-6 p-2 text-[18px]">
          <section className="flex flex-col gap-4 rounded-3xl border border-amber-300 bg-amber-50 p-6 text-[18px] shadow-sm">
            <div className="flex items-start gap-3">
              <span className="mt-1 rounded-full bg-amber-200 p-2 text-amber-800" aria-hidden="true">
                <AlertTriangle size={28} />
              </span>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-amber-900">{ALERT_CONTENT.title}</h2>
                <p className="mt-2 text-[18px] text-amber-900">{ALERT_CONTENT.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="danger"
                size="lg"
                aria-label="Revisar secciones críticas de asistencia"
                onClick={() => track('attendance_alert_action', { poblacion: population })}
                className="text-[18px]"
              >
                {ALERT_CONTENT.actionLabel}
              </Button>
              <p className="text-[18px] text-amber-900">
                Priorice contacto telefónico y verifique registros docentes.
              </p>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <header className="flex flex-col gap-4">
                <div>
                  <p className="text-[18px] font-semibold text-slate-600">
                    {POPULATION_LABEL[population]} · {range}
                  </p>
                  <h2 className="mt-1 text-3xl font-bold text-slate-900">Resumen en un vistazo</h2>
                </div>
                <div className="flex flex-wrap gap-3" role="group" aria-label="Cambiar población">
                  <ToggleButton
                    label="Estudiantes"
                    isActive={population === 'estudiantes'}
                    onClick={() => setPopulation('estudiantes')}
                  />
                  <ToggleButton
                    label="Docentes"
                    isActive={population === 'docentes'}
                    onClick={() => setPopulation('docentes')}
                  />
                </div>
                <div className="flex flex-wrap gap-3" role="group" aria-label="Cambiar periodo">
                  {RANGE_OPTIONS.map((option) => (
                    <ToggleButton key={option} label={option} isActive={range === option} onClick={() => setRange(option)} />
                  ))}
                </div>
              </header>

              <div className="grid gap-4 sm:grid-cols-2">
                {metrics.map((metric) => (
                  <MetricItem
                    key={metric.key}
                    title={metric.title}
                    value={metric.value}
                    helperText={metric.helper}
                    tooltipId={`tooltip-${metric.key}`}
                    tooltipDescription={metric.tooltip}
                    accent={metric.accent}
                  />
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  icon={List}
                  aria-label="Ver lista completa de asistencia"
                  onClick={handleViewList}
                  className="text-[18px]"
                >
                  Ver lista completa
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  icon={Download}
                  aria-label="Descargar registro de asistencia en formato XLSX"
                  onClick={handleDownload}
                  className="text-[18px]"
                >
                  Descargar XLSX
                </Button>
              </div>
            </section>

            <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-slate-900">Distribución por grado/sección</h2>
                <p className="text-[18px] text-slate-600">
                  Identifique rápidamente los grupos con menor porcentaje de asistencia para priorizar acciones.
                </p>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData} barSize={36}>
                    <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" tickLine={false} axisLine={{ stroke: '#CBD5F5' }} fontSize={16} />
                    <YAxis stroke="#475569" tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={{ stroke: '#CBD5F5' }} fontSize={16} />
                    <RechartsTooltip
                      cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                      contentStyle={{
                        borderRadius: 16,
                        border: '1px solid #CBD5F5',
                        fontSize: 16,
                        padding: 12,
                      }}
                      formatter={(value: number) => [`${value}%`, 'Asistencia']}
                    />
                    <Bar dataKey="asistencia" radius={[12, 12, 12, 12]} fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        </div>
      }
    />
  );
};

export default AsistenciaPage;
