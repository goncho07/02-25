import React from 'react';
import { vi } from 'vitest';
import { Activity } from 'lucide-react';
import KpiCard from '../KpiCard';
import { render, screen } from '../../../tests/test-utils';

describe('KpiCard', () => {
  const baseProps = {
    title: 'Title',
    value: '10',
    icon: Activity,
  };

  it('does not set aria-pressed when not configured as toggle', () => {
    render(
      <KpiCard
        {...baseProps}
        onClick={vi.fn()}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).not.toHaveAttribute('aria-pressed');
  });

  it('toggles aria-pressed when configured as toggle', () => {
    const { rerender } = render(
      <KpiCard
        {...baseProps}
        onClick={vi.fn()}
        isToggle
        active={false}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'false');

    rerender(
      <KpiCard
        {...baseProps}
        onClick={vi.fn()}
        isToggle
        active
      />,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('falls back to default gradient classes when custom color is invalid', () => {
    render(
      <KpiCard
        {...baseProps}
        onClick={vi.fn()}
        variant="gradient"
        color="text-indigo-500"
      />,
    );

    const button = screen.getByRole('button');
    expect(button.className).toContain('from-indigo-500 to-purple-600');
  });
});
