"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionary";
import type { YearMonth } from "@/lib/calendar";
import { ChevronLeft, ChevronRight, Close } from "./Icons";

interface Props {
  open: boolean;
  onClose: () => void;
  /** The month currently shown. */
  current: YearMonth;
  /** Today's date ("YYYY-MM-DD"), or null before the page has loaded. */
  today: string | null;
  dict: Dictionary;
  /** Go to a month; `day` ("YYYY-MM-DD") highlights a specific date. */
  onGo: (ym: YearMonth, day?: string) => void;
}

const MIN_YEAR = 1900;
const MAX_YEAR = 2200;

/**
 * "Go to date": pick a month and year, or an exact date.
 * Bottom sheet on phones, centered dialog on larger screens.
 */
export function MonthPicker({ open, onClose, current, today, dict, onGo }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [year, setYear] = useState(current.year);
  const [date, setDate] = useState("");

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const [ty, tm] = (today ?? "").split("-").map(Number);

  const goToDate = (e: React.FormEvent) => {
    e.preventDefault();
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!m) return;
    const y = Number(m[1]);
    if (y < MIN_YEAR || y > MAX_YEAR) return;
    onGo({ year: y, month: Number(m[2]) }, date);
  };

  const yearBtn =
    "flex size-9 items-center justify-center rounded-full text-ink hover:bg-card-sunk disabled:opacity-30";

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby="month-picker-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
    >
      {open && (
        <div className="px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line md:hidden" aria-hidden />
          <div className="flex items-center justify-between gap-4">
            <h2 id="month-picker-title" className="font-serif text-xl font-semibold">
              {dict.goToDate}
            </h2>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label={dict.close}
              className="-mr-2 rounded-full p-2 text-muted hover:bg-card-sunk hover:text-ink"
            >
              <Close />
            </button>
          </div>

          {/* Year */}
          <div className="mt-4 flex items-center justify-between rounded-xl bg-card-sunk px-2 py-1">
            <button
              type="button"
              className={yearBtn}
              onClick={() => setYear((y) => Math.max(MIN_YEAR, y - 1))}
              disabled={year <= MIN_YEAR}
              aria-label={dict.previousYear}
            >
              <ChevronLeft />
            </button>
            <span className="font-serif text-lg font-semibold" aria-live="polite">
              {year}
            </span>
            <button
              type="button"
              className={yearBtn}
              onClick={() => setYear((y) => Math.min(MAX_YEAR, y + 1))}
              disabled={year >= MAX_YEAR}
              aria-label={dict.nextYear}
            >
              <ChevronRight />
            </button>
          </div>

          {/* Months */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {dict.months.map((name, i) => {
              const m = i + 1;
              const isShown = year === current.year && m === current.month;
              const isTodayMonth = year === ty && m === tm;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => onGo({ year, month: m })}
                  aria-current={isShown ? "date" : undefined}
                  className={`relative rounded-xl border px-2 py-2.5 text-sm transition-colors ${
                    isShown
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                      : "border-line hover:border-[var(--accent)]"
                  }`}
                >
                  {name}
                  {isTodayMonth && !isShown && (
                    <span
                      className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[var(--accent)]"
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Exact date */}
          <form onSubmit={goToDate} className="mt-5 border-t border-line pt-4">
            <label htmlFor="exact-date" className="text-sm text-muted">
              {dict.exactDate}
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="exact-date"
                type="date"
                value={date}
                min={`${MIN_YEAR}-01-01`}
                max={`${MAX_YEAR}-12-31`}
                onChange={(e) => setDate(e.target.value)}
                className="min-w-0 flex-1 rounded-xl border border-line bg-card px-3 py-2 text-ink [color-scheme:light] focus:border-[var(--accent)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!date}
                className="rounded-xl bg-ink px-4 py-2 text-sm font-medium text-card disabled:opacity-40"
              >
                {dict.go}
              </button>
            </div>
          </form>

          {/* Today */}
          {today && (
            <button
              type="button"
              onClick={() => onGo({ year: ty, month: tm }, today)}
              className="mt-4 w-full rounded-xl border border-line py-2.5 text-sm font-medium hover:border-[var(--accent)]"
            >
              {dict.today}
            </button>
          )}
        </div>
      )}
    </dialog>
  );
}
