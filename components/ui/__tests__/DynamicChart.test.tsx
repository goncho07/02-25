import React from 'react';
import { vi } from 'vitest';
import DynamicChart from '../DynamicChart';
import { render, screen } from '../../../tests/test-utils';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: ({ dataKey, stroke }: { dataKey: string; stroke: string }) => (
    <div data-testid={`line-${dataKey}`} data-stroke={stroke} />
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: ({ dataKey, fill }: { dataKey: string; fill: string }) => (
    <div data-testid={`bar-${dataKey}`} data-fill={fill} />
  ),
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
  Legend: ({ children, wrapperStyle }: { children?: React.ReactNode; wrapperStyle?: React.CSSProperties }) => (
    <div data-testid="legend" data-color={wrapperStyle?.color}>
      {children}
    </div>
  ),
}));

describe('DynamicChart', () => {
  const baseData = [
    { name: 'Jan', apples: 10, oranges: 5 },
    { name: 'Feb', apples: 8, oranges: 7 },
  ];

  it('uses consistent colors when colorByKey is provided regardless of key order', () => {
    const colorByKey = {
      apples: 'rgb(255 0 0)',
      oranges: 'rgb(255 165 0)',
    };

    const { rerender } = render(
      <DynamicChart
        title="Fruits"
        data={baseData}
        dataKeys={['apples', 'oranges']}
        colorByKey={colorByKey}
      />,
    );

    expect(screen.getByTestId('line-apples')).toHaveAttribute('data-stroke', colorByKey.apples);
    expect(screen.getByTestId('line-oranges')).toHaveAttribute('data-stroke', colorByKey.oranges);

    rerender(
      <DynamicChart
        title="Fruits"
        data={baseData}
        dataKeys={['oranges', 'apples']}
        colorByKey={colorByKey}
      />,
    );

    expect(screen.getByTestId('line-apples')).toHaveAttribute('data-stroke', colorByKey.apples);
    expect(screen.getByTestId('line-oranges')).toHaveAttribute('data-stroke', colorByKey.oranges);
  });

  it('renders the specified chart type even when heuristics differ', () => {
    const singleValueData = [
      { name: 'Jan', value: 5 },
      { name: 'Feb', value: 7 },
    ];

    render(
      <DynamicChart
        title="Fruits"
        data={singleValueData}
        dataKeys={['value']}
        chartType="bar"
      />,
    );

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
  });

  it('shows localized message when there is no data', () => {
    render(
      <DynamicChart
        title="Empty"
        data={[]}
        dataKeys={['value']}
      />,
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
