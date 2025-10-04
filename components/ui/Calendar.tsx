import React, { useMemo } from 'react';
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import es from 'date-fns/locale/es';
import { CalendarEvent } from '../../types';
import { eventCategoryColors } from '../../config';

interface CalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  events: CalendarEvent[];
}

const buildClassName = (classes: string[]) => classes.filter(Boolean).join(' ');

const Calendar: React.FC<CalendarProps> = ({ currentDate, selectedDate, onSelectDate, events }) => {
  const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start, end });

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) =>
        format(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), index), 'EEEEEE', {
          locale: es,
        }).toUpperCase(),
      ),
    [],
  );

  const eventsByDate = useMemo(() => {
    return events.reduce<Record<string, CalendarEvent[]>>((accumulator, event) => {
      const dateKey = event.date;
      if (!accumulator[dateKey]) {
        accumulator[dateKey] = [];
      }
      accumulator[dateKey].push(event);
      return accumulator;
    }, {});
  }, [events]);

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-4">
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {weekDays.map((weekDay) => (
          <span key={weekDay}>{weekDay}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayEvents = eventsByDate[dateKey] || [];
          const isSelected = isSameDay(day, selectedDate);
          const inCurrentMonth = isSameMonth(day, currentDate);
          const today = isToday(day);
          const additionalCount = Math.max(0, dayEvents.length - 3);

          const dayClasses = buildClassName([
            'aspect-square',
            'w-full',
            'rounded-xl',
            'border',
            'border-transparent',
            'p-2',
            'flex',
            'flex-col',
            'items-center',
            'justify-between',
            'text-sm',
            'transition-all',
            'duration-150',
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-indigo-500',
            'focus-visible:ring-offset-2',
            'focus-visible:ring-offset-white',
            'dark:focus-visible:ring-offset-slate-900',
            inCurrentMonth ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500',
            today && !isSelected ? 'border-indigo-300 dark:border-indigo-500/60' : '',
            isSelected
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'hover:border-indigo-200 dark:hover:border-indigo-500/50',
          ]);

          const eventLabel = dayEvents.length
            ? `Eventos: ${dayEvents.map((event) => event.title).join(', ')}`
            : 'Sin eventos';

          return (
            <button
              key={dateKey}
              type="button"
              className={dayClasses}
              onClick={() => onSelectDate(day)}
              aria-pressed={isSelected}
              aria-label={`${format(day, 'd MMMM yyyy', { locale: es })}. ${eventLabel}`}
            >
              <span className="font-semibold">{format(day, 'd')}</span>
              <div className="flex flex-wrap justify-center gap-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <span
                    key={event.id}
                    className={buildClassName([
                      'h-1.5',
                      'w-1.5',
                      'rounded-full',
                      eventCategoryColors[event.category] || 'bg-slate-400',
                    ])}
                    aria-hidden="true"
                    title={event.title}
                  />
                ))}
                {additionalCount > 0 ? (
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">+{additionalCount}</span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
