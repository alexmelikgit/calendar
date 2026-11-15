import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { ISODate } from "@/content/types";

export interface YearMonth {
  year: number;
  /** 1–12 */
  month: number;
}

export interface GridDay {
  date: ISODate;
  day: number;
  inMonth: boolean;
}

const WEEK_STARTS_ON = 1; // Monday

export const toISO = (d: Date): ISODate => format(d, "yyyy-MM-dd");

/** Weeks (rows of 7 days) covering the whole month, Monday first. */
export function buildMonthGrid({ year, month }: YearMonth): GridDay[][] {
  const first = new Date(year, month - 1, 1);
  const start = startOfWeek(startOfMonth(first), { weekStartsOn: WEEK_STARTS_ON });
  const end = endOfWeek(endOfMonth(first), { weekStartsOn: WEEK_STARTS_ON });

  const weeks: GridDay[][] = [];
  for (let d = start; d <= end; d = addDays(d, 7)) {
    weeks.push(
      Array.from({ length: 7 }, (_, i) => {
        const day = addDays(d, i);
        return {
          date: toISO(day),
          day: day.getDate(),
          inMonth: day.getMonth() === month - 1,
        };
      }),
    );
  }
  return weeks;
}

/** First and last day of a month as ISO dates. */
export function monthRange({ year, month }: YearMonth): { start: ISODate; end: ISODate } {
  const first = new Date(year, month - 1, 1);
  return { start: toISO(first), end: toISO(endOfMonth(first)) };
}

export function shiftMonth({ year, month }: YearMonth, delta: number): YearMonth {
  const d = addMonths(new Date(year, month - 1, 1), delta);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

/** "/hy/2026/10" */
export function monthPath(lang: string, { year, month }: YearMonth): string {
  return `/${lang}/${year}/${String(month).padStart(2, "0")}`;
}

/** Today's date in Armenia. Used on the server, where the clock is UTC. */
export function todayInYerevan(): YearMonth {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Yerevan",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { year: get("year"), month: get("month") };
}

/** Parses "2026" + "10" from the URL. Returns null if invalid. */
export function parseYearMonth(year: string, month: string): YearMonth | null {
  if (!/^\d{4}$/.test(year) || !/^\d{1,2}$/.test(month)) return null;
  const y = Number(year);
  const m = Number(month);
  if (y < 1900 || y > 2200 || m < 1 || m > 12) return null;
  return { year: y, month: m };
}
