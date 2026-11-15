"use client";

import type { Locale } from "@/content/types";
import type { Dictionary } from "@/i18n/dictionary";
import { formatDay } from "@/i18n/format";
import type { GridDay } from "@/lib/calendar";
import type { CalendarEvent } from "@/lib/content";

interface Props {
  weeks: GridDay[][];
  events: CalendarEvent[];
  today: string | null;
  /** A day to briefly highlight (after "Go to date" / "Today"). */
  flashDay?: string | null;
  locale: Locale;
  dict: Dictionary;
  onSelectDay: (date: string) => void;
}

const eventsOn = (events: CalendarEvent[], date: string) =>
  events.filter((e) => e.start <= date && e.end >= date);

export function MonthGrid({ weeks, events, today, flashDay, locale, dict, onSelectDay }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-card text-ink shadow-[0_12px_32px_-12px_rgb(0_0_0/0.6)]">
      <div className="linen-stripe" aria-hidden />
      <div className="grid grid-cols-7 border-b border-line text-center text-xs font-medium text-muted">
        {dict.weekdaysShort.map((d, i) => (
          <div key={d} className={`py-2 ${i >= 5 ? "text-[var(--accent)]" : ""}`}>
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {weeks.flatMap((week, w) =>
          week.map((day, col) => {
            const dayEvents = eventsOn(events, day.date);
            return (
              <DayCell
                key={day.date}
                day={day}
                col={col}
                lastRow={w === weeks.length - 1}
                events={dayEvents}
                isToday={day.date === today}
                isFlashing={day.date === flashDay}
                label={`${formatDay(day.date, locale, dict)}${
                  dayEvents.length ? ` — ${dayEvents.map((e) => e.name).join(", ")}` : ""
                }`}
                onSelect={() => onSelectDay(day.date)}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}

interface CellProps {
  day: GridDay;
  col: number;
  lastRow: boolean;
  events: CalendarEvent[];
  isToday: boolean;
  isFlashing: boolean;
  label: string;
  onSelect: () => void;
}

function DayCell({ day, col, lastRow, events, isToday, isFlashing, label, onSelect }: CellProps) {
  const hasEvents = events.length > 0;
  const colors = [...new Set(events.map((e) => e.category.color))];

  const content = (
    <>
      <span
        className={`flex size-7 items-center justify-center rounded-full text-sm md:size-6 md:text-xs ${
          isToday ? "bg-[var(--accent)] font-semibold text-white" : ""
        } ${!day.inMonth ? "text-muted/60" : col >= 5 && !isToday ? "text-[var(--accent)]" : ""}`}
      >
        {day.day}
      </span>

      {/* Phones: colored dots, one per feast type */}
      {hasEvents && (
        <span className={`mt-0.5 flex gap-0.5 md:hidden ${!day.inMonth ? "opacity-40" : ""}`}>
          {colors.slice(0, 3).map((c) => (
            <span key={c} className="size-1.5 rounded-full" style={{ background: c }} />
          ))}
          {colors.length > 3 && <span className="text-[9px] leading-none text-muted">+</span>}
        </span>
      )}

      {/* Tablets and up: bars with names; multi-day feasts and fasts join across days */}
      {hasEvents && (
        <span className={`mt-1 hidden w-full flex-col gap-0.5 md:flex ${!day.inMonth ? "opacity-40" : ""}`}>
          {events.slice(0, 2).map((e) => {
            const isStart = e.start === day.date;
            const isEnd = e.end === day.date;
            const showName = isStart || col === 0;
            return (
              <span
                key={e.id}
                className={`block h-5 truncate px-1.5 text-left text-[11px] leading-5 text-white ${
                  isStart ? "rounded-l-md" : "-ml-1.5"
                } ${isEnd ? "rounded-r-md" : "-mr-1.5"}`}
                style={{ background: e.category.color }}
              >
                {showName ? e.name : " "}
              </span>
            );
          })}
          {events.length > 2 && (
            <span className="px-1 text-left text-[11px] text-muted">+{events.length - 2}</span>
          )}
        </span>
      )}
    </>
  );

  const base = `flex min-h-14 flex-col items-center px-1.5 py-1.5 md:min-h-28 md:items-start ${
    col < 6 ? "border-r border-line" : ""
  } ${lastRow ? "" : "border-b border-line"} ${!day.inMonth ? "bg-card-sunk" : ""} ${
    isFlashing ? "day-flash" : ""
  }`;

  if (!hasEvents) {
    return (
      <div className={base} aria-label={label} data-date={day.date}>
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={label}
      data-date={day.date}
      className={`${base} cursor-pointer overflow-hidden transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_8%,var(--color-card))] focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-[var(--accent)]`}
    >
      {content}
    </button>
  );
}
