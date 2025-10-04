import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface DynamicChartProps {
  title: string;
  data: Array<Record<string, number | string>>;
  dataKeys: string[];
  nameKey?: string;
  chartType?: 'line' | 'bar';
  colorPalette?: string[];
}

const DEFAULT_COLORS = ['#4f46e5', '#f97316', '#14b8a6', '#facc15'];

const tooltipStyle: React.CSSProperties = {
  backgroundColor: 'rgba(15, 23, 42, 0.95)',
  color: '#f8fafc',
  borderRadius: '0.75rem',
  border: '1px solid rgba(148, 163, 184, 0.35)',
  padding: '0.75rem 1rem',
};

const axisStyle = {
  stroke: '#94a3b8',
  fontSize: 12,
};

const gridColor = 'rgba(148, 163, 184, 0.2)';

const DynamicChart: React.FC<DynamicChartProps> = ({
  title,
  data,
  dataKeys,
  nameKey = 'name',
  chartType,
  colorPalette = DEFAULT_COLORS,
}) => {
  const effectiveChartType = useMemo(() => {
    if (chartType) {
      return chartType;
    }

    if (dataKeys.length === 1 && dataKeys[0] === 'value') {
      return 'bar';
    }

    return 'line';
  }, [chartType, dataKeys]);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 flex items-center justify-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">Sin datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="h-64 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-4">
      <header className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      </header>
      <ResponsiveContainer width="100%" height="calc(100% - 1.5rem)">
        {effectiveChartType === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} stroke={axisStyle.stroke} tick={{ fontSize: axisStyle.fontSize, fill: axisStyle.stroke }} tickLine={false} axisLine={false} />
            <YAxis stroke={axisStyle.stroke} tick={{ fontSize: axisStyle.fontSize, fill: axisStyle.stroke }} tickLine={false} axisLine={false} allowDecimals />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: '#6366f1', strokeWidth: 1 }} />
            <Legend wrapperStyle={{ color: '#1e293b' }} />
            {dataKeys.map((key, index) => (
              <Line key={key} type="monotone" dataKey={key} stroke={colorPalette[index % colorPalette.length]} strokeWidth={2.5} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            ))}
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} stroke={axisStyle.stroke} tick={{ fontSize: axisStyle.fontSize, fill: axisStyle.stroke }} tickLine={false} axisLine={false} />
            <YAxis stroke={axisStyle.stroke} tick={{ fontSize: axisStyle.fontSize, fill: axisStyle.stroke }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(99, 102, 241, 0.12)' }} />
            <Legend wrapperStyle={{ color: '#1e293b' }} />
            {dataKeys.map((key, index) => (
              <Bar key={key} dataKey={key} fill={colorPalette[index % colorPalette.length]} radius={[12, 12, 12, 12]} barSize={28} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default DynamicChart;
