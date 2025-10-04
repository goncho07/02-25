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
  type LegendProps,
  type TooltipProps,
} from 'recharts';
import { useTranslation } from 'react-i18next';

interface DynamicChartProps {
  title: string;
  data: Array<Record<string, number | string>>;
  dataKeys: string[];
  nameKey?: string;
  chartType?: 'line' | 'bar';
  colorPalette?: string[];
  noDataLabel?: string;
  legendProps?: Partial<LegendProps>;
  legendStyle?: React.CSSProperties;
  tooltipProps?: Partial<TooltipProps<number, string>>;
  colorByKey?: Record<string, string>;
  className?: string;
}

const DEFAULT_COLORS = ['rgb(79 70 229)', 'rgb(249 115 22)', 'rgb(20 184 166)', 'rgb(250 204 21)'];

const BASE_TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: 'rgb(15 23 42 / 0.95)',
  color: 'rgb(248 250 252)',
  borderRadius: '0.75rem',
  border: '1px solid rgb(148 163 184 / 0.35)',
  padding: '0.75rem 1rem',
};

const axisStyle = {
  stroke: 'rgb(148 163 184)',
  fontSize: 12,
};

const gridColor = 'rgb(148 163 184 / 0.2)';

const DynamicChart: React.FC<DynamicChartProps> = ({
  title,
  data,
  dataKeys,
  nameKey = 'name',
  chartType,
  colorPalette = DEFAULT_COLORS,
  noDataLabel,
  legendProps,
  legendStyle,
  tooltipProps,
  colorByKey,
  className,
}) => {
  const { t } = useTranslation();

  const effectiveChartType = useMemo(() => {
    if (chartType) {
      return chartType;
    }

    if (dataKeys.length === 1 && dataKeys[0] === 'value') {
      return 'bar';
    }

    return 'line';
  }, [chartType, dataKeys]);

  const resolvedNoDataLabel = noDataLabel ?? t('ui.chart.noData');

  const colorAssignments = useMemo(() => {
    const palette = colorPalette.length > 0 ? colorPalette : DEFAULT_COLORS;

    return dataKeys.reduce<Record<string, string>>((accumulator, key, index) => {
      const assignedColor = colorByKey?.[key] ?? palette[index % palette.length];
      accumulator[key] = assignedColor;
      return accumulator;
    }, {});
  }, [colorByKey, colorPalette, dataKeys]);

  const { cursor, contentStyle, ...restTooltipProps } = tooltipProps ?? {};

  const baseTooltipProps: Partial<TooltipProps<number, string>> = {
    ...restTooltipProps,
    contentStyle: { ...BASE_TOOLTIP_STYLE, ...(contentStyle ?? {}) },
  };

  const lineTooltipProps: Partial<TooltipProps<number, string>> = {
    cursor: cursor ?? { stroke: 'rgb(99 102 241)', strokeWidth: 1 },
    ...baseTooltipProps,
  };

  const barTooltipProps: Partial<TooltipProps<number, string>> = {
    cursor: cursor ?? { fill: 'rgb(99 102 241 / 0.12)' },
    ...baseTooltipProps,
  };

  const mergedLegendProps: Partial<LegendProps> = {
    ...legendProps,
    wrapperStyle: {
      color: 'inherit',
      ...(legendStyle ?? {}),
      ...(legendProps?.wrapperStyle ?? {}),
    },
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-64 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 flex items-center justify-center text-slate-500 dark:text-slate-400">
        <p className="text-sm">{resolvedNoDataLabel}</p>
      </div>
    );
  }

  return (
    <div
      className={
        `h-64 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-4 text-slate-700 dark:text-slate-200 ${className ?? ''}`.trim()
      }
    >
      <header className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      </header>
      <ResponsiveContainer width="100%" height="calc(100% - 1.5rem)">
        {effectiveChartType === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} stroke={axisStyle.stroke} tick={{ fontSize: axisStyle.fontSize, fill: axisStyle.stroke }} tickLine={false} axisLine={false} />
            <YAxis stroke={axisStyle.stroke} tick={{ fontSize: axisStyle.fontSize, fill: axisStyle.stroke }} tickLine={false} axisLine={false} allowDecimals />
            <Tooltip {...lineTooltipProps} />
            <Legend {...mergedLegendProps} />
            {dataKeys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colorAssignments[key]}
                strokeWidth={2.5}
                dot={{ strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} stroke={axisStyle.stroke} tick={{ fontSize: axisStyle.fontSize, fill: axisStyle.stroke }} tickLine={false} axisLine={false} />
            <YAxis stroke={axisStyle.stroke} tick={{ fontSize: axisStyle.fontSize, fill: axisStyle.stroke }} tickLine={false} axisLine={false} />
            <Tooltip {...barTooltipProps} />
            <Legend {...mergedLegendProps} />
            {dataKeys.map((key) => (
              <Bar key={key} dataKey={key} fill={colorAssignments[key]} radius={[12, 12, 12, 12]} barSize={28} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default DynamicChart;
