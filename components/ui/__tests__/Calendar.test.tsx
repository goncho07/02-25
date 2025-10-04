import React from 'react';
import enUS from 'date-fns/locale/en-US';
import { vi } from 'vitest';
import Calendar from '../Calendar';
import { render, screen } from '../../../tests/test-utils';

const baseDate = new Date('2025-05-15T12:00:00');

describe('Calendar', () => {
  it('respects weekStartsOn prop', () => {
    render(
      <Calendar
        currentDate={baseDate}
        selectedDate={baseDate}
        onSelectDate={vi.fn()}
        events={[]}
        weekStartsOn={0}
        locale={enUS}
      />,
    );

    expect(screen.getByText('SU')).toBeInTheDocument();
  });

  it('normalizes ISO date strings when mapping events', () => {
    const isoEventDate = '2025-05-01T10:00:00Z';

    render(
      <Calendar
        currentDate={baseDate}
        selectedDate={baseDate}
        onSelectDate={vi.fn()}
        events={[
          {
            id: 'event-1',
            title: 'Event from ISO',
            date: isoEventDate,
            category: 'Actividad',
          },
        ]}
        locale={enUS}
      />,
    );

    expect(screen.getByTitle('Event from ISO')).toBeInTheDocument();
  });
});
