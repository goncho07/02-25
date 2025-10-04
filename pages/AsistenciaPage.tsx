import React, { useMemo, useState } from 'react';
import {
  ClipboardCheck,
  Download,
  FileText,
  Calendar as CalendarIcon,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { students } from '../data/students';
import { staff } from '../data/users';
import ModulePage from '../layouts/ModulePage';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import { track } from '../analytics/track';

type PopulationFilter = 'estudiantes' | 'docentes';
type LevelFilter = 'Inicial' | 'Primaria' | 'Secundaria' | 'Todos';
type RangeFilter = 'Hoy' | 'Semana' | 'Mes' | 'Bimestre';
type ShiftFilter = 'Todos' | 'Mañana' | 'Tarde';

interface SummaryMetric {
  attendance: number;
  delta: number;
  absences: number;
  tardiness: number;
  unjustified: number;
  coverage: number;
  sparkline: number[];
}

const SUMMARY_DATA: Record<PopulationFilter, Record<RangeFilter, SummaryMetric>> = {
  estudiantes: {
    Hoy: {
      attendance: 92,
      delta: -2,
      absences: 18,
      tardiness: 24,
      unjustified: 6,
      coverage: 87,
      sparkline: [88, 90, 94, 95, 92],
    },
    Semana: {
      attendance: 93,
      delta: 1,
      absences: 74,
      tardiness: 92,
      unjustified: 24,
      coverage: 89,
      sparkline: [87, 89, 92, 94, 93, 95, 93],
    },
    Mes: {
      attendance: 95,
      delta: 2,
      absences: 240,
      tardiness: 310,
      unjustified: 60,
      coverage: 91,
      sparkline: [90, 92, 93, 94, 95, 96, 95, 94],
    },
    Bimestre: {
      attendance: 94,
      delta: 0,
      absences: 520,
      tardiness: 672,
      unjustified: 130,
      coverage: 92,
      sparkline: [88, 89, 90, 92, 93, 94, 94, 95],
    },
  },
  docentes: {
    Hoy: {
      attendance: 97,
      delta: 1,
      absences: 2,
      tardiness: 5,
      unjustified: 1,
      coverage: 93,
      sparkline: [91, 92, 94, 95, 97],
    },
    Semana: {
      attendance: 96,
      delta: -1,
      absences: 12,
      tardiness: 18,
      unjustified: 4,
      coverage: 94,
      sparkline: [90, 92, 95, 94, 96, 97, 96],
    },
    Mes: {
      attendance: 95,
      delta: 0,
      absences: 40,
      tardiness: 54,
      unjustified: 10,
      coverage: 95,
      sparkline: [89, 91, 93, 94, 95, 96, 95, 95],
    },
    Bimestre: {
      attendance: 96,
      delta: 1,
      absences: 86,
      tardiness: 120,
      unjustified: 20,
      coverage: 96,
      sparkline: [88, 90, 92, 94, 95, 95, 96, 97],
    },
  },
};

const ATTENDANCE_TREND: Record<PopulationFilter, Record<RangeFilter, { label: string; value: number }[]>> = {
  estudiantes: {
    Hoy: [
      { label: '07:00', value: 76 },
      { label: '08:00', value: 88 },
      { label: '09:00', value: 92 },
      { label: '10:00', value: 93 },
    ],
    Semana: ['L', 'M', 'M', 'J', 'V'].map((label, index) => ({ label, value: [89, 90, 92, 93, 95][index] })),
    Mes: Array.from({ length: 4 }, (_, index) => ({ label: `Sem ${index + 1}`, value: [92, 93, 95, 94][index] })),
    Bimestre: Array.from({ length: 8 }, (_, index) => ({ label: `Sem ${index + 1}`, value: [90, 91, 92, 93, 94, 95, 95, 94][index] })),
  },
  docentes: {
    Hoy: [
      { label: '07:00', value: 88 },
      { label: '08:00', value: 95 },
      { label: '09:00', value: 97 },
      { label: '10:00', value: 98 },
    ],
    Semana: ['L', 'M', 'M', 'J', 'V'].map((label, index) => ({ label, value: [94, 95, 96, 96, 97][index] })),
    Mes: Array.from({ length: 4 }, (_, index) => ({ label: `Sem ${index + 1}`, value: [95, 94, 96, 95][index] })),
    Bimestre: Array.from({ length: 8 }, (_, index) => ({ label: `Sem ${index + 1}`, value: [93, 94, 95, 95, 96, 96, 97, 96][index] })),
  },
};

const STUDENT_SHIFTS: Record<string, ShiftFilter> = {
  'A': 'Mañana',
  'B': 'Mañana',
  'C': 'Tarde',
  'D': 'Tarde',
};

const STAFF_SHIFTS: Record<string, ShiftFilter> = {
  Docente_Inicial: 'Mañana',
  Docente_Primaria: 'Mañana',
  Docente_Secundaria: 'Tarde',
  Docente: 'Mañana',
  Administrador: 'Mañana',
};

const levelFromGrade = (grade: string): LevelFilter => {
  const normalized = grade.toLowerCase();
  if (normalized.includes('inicial')) return 'Inicial';
  if (normalized.includes('prim') || normalized.includes('sexto') || normalized.includes('quinto') || normalized.includes('cuarto')) return 'Primaria';
  return 'Secundaria';
};

const levelFromStaffArea = (area: string): LevelFilter => {
  const normalized = area.toLowerCase();
  if (normalized.includes('inicial')) return 'Inicial';
  if (normalized.includes('primaria')) return 'Primaria';
  if (normalized.includes('secundaria') || normalized.includes('tecnología') || normalized.includes('comunicación') || normalized.includes('cultura')) return 'Secundaria';
  return 'Todos';
};

const formatDelta = (delta: number) => `${delta > 0 ? '+' : ''}${delta}`;

const Sparkline: React.FC<{ values: number[]; colorClass: string }> = ({ values, colorClass }) => {
  if (values.length === 0) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * 100;
      const y = max === min ? 50 : 100 - ((value - min) / (max - min)) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 100 100" className="w-full h-12" aria-hidden="true" focusable="false">
      <polyline points={points} className={colorClass} fill="none" strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
};

const FilterChip: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 h-10 text-sm font-semibold rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${
      isActive
        ? 'bg-indigo-600 text-white border-indigo-600'
        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
    }`}
    aria-pressed={isActive}
  >
    {label}
  </button>
);

const TableHeaderCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800">
    {children}
  </th>
);

const TableCell: React.FC<{ children: React.ReactNode; className?: string; colSpan?: number }> = ({ children, className = '', colSpan }) => (
  <td className={`px-4 py-3 text-sm text-slate-700 dark:text-slate-200 ${className}`} colSpan={colSpan}>
    {children}
  </td>
);

const PAGE_SIZE = 5;

const AsistenciaPage: React.FC = () => {
  const [population, setPopulation] = useState<PopulationFilter>('estudiantes');
  const [level, setLevel] = useState<LevelFilter>('Todos');
  const [range, setRange] = useState<RangeFilter>('Hoy');
  const [shift, setShift] = useState<ShiftFilter>('Todos');
  const [studentPage, setStudentPage] = useState(1);
  const [teacherPage, setTeacherPage] = useState(1);
  const [downloadFormat, setDownloadFormat] = useState<'xlsx' | 'pdf'>('xlsx');

  const summary = SUMMARY_DATA[population][range];

  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => (level === 'Todos' ? true : levelFromGrade(student.grade) === level))
      .filter((student) => (shift === 'Todos' ? true : STUDENT_SHIFTS[student.section] === shift))
      .map((student) => ({
        id: student.documentNumber,
        nombre: student.fullName,
        grado: `${student.grade} – ${student.section}`,
        estadoHoy: student.attendancePercentage > 90 ? 'Presente' : student.attendancePercentage > 80 ? 'Tarde' : 'Falta',
        tardanzas: student.tardinessCount,
        faltasInjustificadas: Math.max(0, Math.round((100 - student.attendancePercentage) / 10)),
      }));
  }, [level, shift]);

  const filteredStaff = useMemo(() => {
    return staff
      .filter((person) => (level === 'Todos' ? true : levelFromStaffArea(person.area || person.role || '') === level))
      .filter((person) => (shift === 'Todos' ? true : (STAFF_SHIFTS[person.role || person.category || ''] || 'Todos') === shift))
      .map((person) => {
        const nivel = levelFromStaffArea(person.area || person.role || '');
        return {
          id: person.dni,
          nombre: person.name,
          estadoHoy: person.attendancePercentage && person.attendancePercentage >= 95 ? 'Registrado' : 'Pendiente',
          cobertura: person.attendancePercentage ?? 0,
          ultimoRegistro: person.lastLogin ? new Date(person.lastLogin).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }) : 'Sin registro',
          nivel,
        };
      });
  }, [level, shift]);

  const totalStudentPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const totalTeacherPages = Math.max(1, Math.ceil(filteredStaff.length / PAGE_SIZE));

  const pagedStudents = filteredStudents.slice((studentPage - 1) * PAGE_SIZE, studentPage * PAGE_SIZE);
  const pagedStaff = filteredStaff.slice((teacherPage - 1) * PAGE_SIZE, teacherPage * PAGE_SIZE);

  const trendData = ATTENDANCE_TREND[population][range];

  const distributionData = useMemo(() => {
    if (population === 'estudiantes') {
      const counts = filteredStudents.reduce<Record<string, { presentes: number; total: number }>>((acc, student) => {
        const key = student.grado;
        if (!acc[key]) {
          acc[key] = { presentes: 0, total: 0 };
        }
        acc[key].total += 1;
        if (student.estadoHoy === 'Presente') {
          acc[key].presentes += 1;
        }
        return acc;
      }, {});

      return Object.entries(counts).map(([grado, valores]) => ({
        name: grado,
        presente: Math.round((valores.presentes / Math.max(1, valores.total)) * 100),
        tardanza: Math.round((Math.max(0, valores.total - valores.presentes) / Math.max(1, valores.total)) * 100),
      }));
    }

    const counts = filteredStaff.reduce<Record<string, { cobertura: number; total: number }>>((acc, person) => {
      const key = person.nivel && person.nivel !== 'Todos' ? person.nivel : 'General';
      if (!acc[key]) {
        acc[key] = { cobertura: 0, total: 0 };
      }
      acc[key].total += 1;
      acc[key].cobertura += person.cobertura;
      return acc;
    }, {});

    return Object.entries(counts).map(([nivel, valores]) => ({
      name: nivel,
      cobertura: Math.round(valores.cobertura / Math.max(1, valores.total)),
    }));
  }, [filteredStudents, filteredStaff, population]);

  const alerts = useMemo(
    () => [
      {
        id: 'secciones-criticas',
        title: 'Secciones con asistencia < 85%',
        description: '2 secciones requieren revisión inmediata.',
        actionLabel: 'Ver detalle',
      },
      {
        id: 'tardanzas-altas',
        title: 'Grados con +15% tardanzas',
        description: '1 grado supera el umbral de tardanzas.',
        actionLabel: 'Descargar listado',
      },
      {
        id: 'sin-registro',
        title: 'Cursos sin registro docente',
        description: '3 cursos aún no cargan asistencia.',
        actionLabel: 'Revisar cursos',
      },
    ],
    [],
  );

  const handleDownload = () => {
    track('attendance_download', { formato: downloadFormat, rango: range, nivel: level, turno: shift, poblacion: population });
  };

  const handleGenerateReport = () => {
    track('attendance_generate_report', { rango: range, nivel: level, turno: shift, poblacion: population });
  };

  const populationLabel = population === 'estudiantes' ? 'Estudiantes' : 'Docentes';

  return (
    <ModulePage
      title="Módulo de Asistencia"
      description="Diagnóstico rápido de asistencia para estudiantes y docentes."
      icon={ClipboardCheck}
      actionsRight={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="download-format" className="text-sm font-semibold text-slate-600 dark:text-slate-300">Formato</label>
            <select
              id="download-format"
              value={downloadFormat}
              onChange={(event) => setDownloadFormat(event.target.value as 'xlsx' | 'pdf')}
              className="h-11 px-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <option value="xlsx">XLSX</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          <Button
            variant="secondary"
            icon={Download}
            aria-label="Descargar resumen de asistencia"
            onClick={handleDownload}
          >
            Descargar
          </Button>
          <Button
            variant="primary"
            icon={FileText}
            aria-label="Generar reporte consolidado"
            onClick={handleGenerateReport}
          >
            Generar reporte
          </Button>
        </div>
      }
      filters={
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 grid gap-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Población</span>
              <div className="flex gap-2">
                <FilterChip label="Estudiantes" isActive={population === 'estudiantes'} onClick={() => { setPopulation('estudiantes'); setStudentPage(1); setTeacherPage(1); }} />
                <FilterChip label="Docentes" isActive={population === 'docentes'} onClick={() => { setPopulation('docentes'); setStudentPage(1); setTeacherPage(1); }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nivel</span>
              <div className="flex gap-2">
                {(['Todos', 'Inicial', 'Primaria', 'Secundaria'] as LevelFilter[]).map((option) => (
                  <FilterChip key={option} label={option} isActive={level === option} onClick={() => { setLevel(option); setStudentPage(1); setTeacherPage(1); }} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Rango</span>
              <div className="flex gap-2">
                {(['Hoy', 'Semana', 'Mes', 'Bimestre'] as RangeFilter[]).map((option) => (
                  <FilterChip key={option} label={option} isActive={range === option} onClick={() => { setRange(option); setStudentPage(1); setTeacherPage(1); }} />
                ))}
              </div>
              <Button
                variant="tertiary"
                icon={CalendarIcon}
                aria-label="Seleccionar fecha personalizada"
                onClick={() => track('attendance_custom_calendar_opened')}
                className="ml-2"
              >
                Calendario
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Turno</span>
              <div className="flex gap-2">
                {(['Todos', 'Mañana', 'Tarde'] as ShiftFilter[]).map((option) => (
                  <FilterChip key={option} label={option} isActive={shift === option} onClick={() => { setShift(option); setStudentPage(1); setTeacherPage(1); }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      }
      content={
        <div className="space-y-5">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
          >
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wide">Asistencia de hoy</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{summary.attendance}%</p>
                </div>
                <div className={`text-sm font-semibold ${summary.delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatDelta(summary.delta)}%
                </div>
              </div>
              <Sparkline values={summary.sparkline} colorClass="stroke-indigo-500" />
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wide">Ausencias</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{summary.absences}</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <AlertTriangle size={16} className="text-amber-500" />
                <span>Comparado con periodo anterior</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wide">Tardanzas</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{summary.tardiness}</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <TrendingUp size={16} className="text-sky-500" />
                <span>Tendencia del {range.toLowerCase()}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wide">Faltas injustificadas</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{summary.unjustified}</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span>Actualizado {range === 'Hoy' ? '12:00' : '08:00'} h</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wide">{population === 'docentes' ? 'Cobertura docente' : 'Cursos con registro completo'}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{summary.coverage}%</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span>Meta institucional: 95%</span>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-4 lg:grid-cols-2"
          >
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Tendencia de asistencia</h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">{populationLabel} · {range}</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="label" stroke="#64748B" fontSize={12} tickLine={false} axisLine={{ stroke: '#CBD5F5' }} />
                    <YAxis domain={[70, 100]} stroke="#64748B" fontSize={12} tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={{ stroke: '#CBD5F5' }} />
                    <Tooltip formatter={(value: number) => `${value}%`} labelClassName="text-sm font-semibold" contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                    <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Distribución por grado/sección</h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">Focos de alerta</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={{ stroke: '#CBD5F5' }} />
                    <YAxis stroke="#64748B" fontSize={12} tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={{ stroke: '#CBD5F5' }} />
                    <Tooltip formatter={(value: number) => `${value}%`} contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                    {population === 'estudiantes' ? (
                      <>
                        <Bar dataKey="presente" stackId="a" fill="#22C55E" radius={[8, 8, 0, 0]} name="Presente" />
                        <Bar dataKey="tardanza" stackId="a" fill="#F97316" radius={[0, 0, 8, 8]} name="Tarde/Falta" />
                      </>
                    ) : (
                      <Bar dataKey="cobertura" fill="#6366F1" radius={[8, 8, 0, 0]} name="Cobertura" />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid gap-4 lg:grid-cols-2"
          >
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Estudiantes</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Resumen diario · {filteredStudents.length} registros</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <TableHeaderCell>Nombre y apellidos</TableHeaderCell>
                      <TableHeaderCell>Grado/Sección</TableHeaderCell>
                      <TableHeaderCell>Estado hoy</TableHeaderCell>
                      <TableHeaderCell>Tardanzas ({range.toLowerCase()})</TableHeaderCell>
                      <TableHeaderCell>Faltas injustificadas ({range.toLowerCase()})</TableHeaderCell>
                      <TableHeaderCell>Acciones</TableHeaderCell>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedStudents.length === 0 ? (
                      <tr>
                        <TableCell className="text-center" colSpan={6}>
                          No hay datos para este periodo.
                        </TableCell>
                      </tr>
                    ) : (
                      pagedStudents.map((student) => (
                        <tr key={student.id} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-800 dark:even:bg-slate-800/80">
                          <TableCell>{student.nombre}</TableCell>
                          <TableCell>{student.grado}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                student.estadoHoy === 'Presente'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                                  : student.estadoHoy === 'Tarde'
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                                    : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                              }`}
                            >
                              {student.estadoHoy}
                            </span>
                          </TableCell>
                          <TableCell>{student.tardanzas}</TableCell>
                          <TableCell>{student.faltasInjustificadas}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => track('attendance_student_detail', { id: student.id })}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                              >
                                Ver detalle
                              </button>
                              <button
                                type="button"
                                onClick={() => track('attendance_student_download', { id: student.id })}
                                className="text-sm font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                              >
                                Descargar
                              </button>
                            </div>
                          </TableCell>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination currentPage={studentPage} totalPages={totalStudentPages} onPageChange={setStudentPage} />
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Docentes</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Cobertura diaria · {filteredStaff.length} registros</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <TableHeaderCell>Nombres y apellidos</TableHeaderCell>
                      <TableHeaderCell>Estado hoy</TableHeaderCell>
                      <TableHeaderCell>Cobertura de clases</TableHeaderCell>
                      <TableHeaderCell>Último registro</TableHeaderCell>
                      <TableHeaderCell>Acciones</TableHeaderCell>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedStaff.length === 0 ? (
                      <tr>
                        <TableCell className="text-center" colSpan={5}>
                          No hay datos para este periodo.
                        </TableCell>
                      </tr>
                    ) : (
                      pagedStaff.map((person) => (
                        <tr key={person.id} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-800 dark:even:bg-slate-800/80">
                          <TableCell>{person.nombre}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                person.estadoHoy === 'Registrado'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                              }`}
                            >
                              {person.estadoHoy}
                            </span>
                          </TableCell>
                          <TableCell>{person.cobertura}%</TableCell>
                          <TableCell>{person.ultimoRegistro}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => track('attendance_teacher_detail', { id: person.id })}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                              >
                                Ver detalle
                              </button>
                              <button
                                type="button"
                                onClick={() => track('attendance_teacher_download', { id: person.id })}
                                className="text-sm font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                              >
                                Descargar
                              </button>
                            </div>
                          </TableCell>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination currentPage={teacherPage} totalPages={totalTeacherPages} onPageChange={setTeacherPage} />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4"
          >
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Alertas y acciones</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{alert.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{alert.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => track('attendance_alert_action', { id: alert.id })}
                    className="mt-3 self-start text-sm font-semibold text-indigo-600 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                  >
                    {alert.actionLabel}
                  </button>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      }
    />
  );
};

export default AsistenciaPage;
