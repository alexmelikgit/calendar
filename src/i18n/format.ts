import type { ISODate, Locale } from "@/content/types";
import type { Dictionary } from "./dictionary";

function parts(date: ISODate) {
  const [y, m, d] = date.split("-").map(Number);
  return { y, m, d };
}

/** "3 հոկտեմբերի" / "October 3" */
export function formatDay(date: ISODate, locale: Locale, dict: Dictionary): string {
  const { m, d } = parts(date);
  return locale === "hy"
    ? `${d} ${dict.monthsGenitive[m - 1]}`
    : `${dict.monthsGenitive[m - 1]} ${d}`;
}

/** Same as formatDay, with the year. */
export function formatDayWithYear(date: ISODate, locale: Locale, dict: Dictionary): string {
  return `${formatDay(date, locale, dict)}, ${parts(date).y}`;
}

/** "26 սեպտեմբերի – 2 հոկտեմբերի" / "September 26 – October 2" */
export function formatRange(
  start: ISODate,
  end: ISODate,
  locale: Locale,
  dict: Dictionary,
  withYear = false,
): string {
  const fmt = withYear ? formatDayWithYear : formatDay;
  if (start === end) return fmt(start, locale, dict);
  const a = parts(start);
  const b = parts(end);
  if (a.y === b.y && a.m === b.m) {
    // Same month: "2–9 ապրիլի" / "April 2–9"
    const tail = withYear ? `, ${a.y}` : "";
    return locale === "hy"
      ? `${a.d}–${b.d} ${dict.monthsGenitive[a.m - 1]}${tail}`
      : `${dict.monthsGenitive[a.m - 1]} ${a.d}–${b.d}${tail}`;
  }
  return `${fmt(start, locale, dict)} – ${fmt(end, locale, dict)}`;
}

/** Weekday name for a date, e.g. "կիրակի". */
export function weekdayName(date: ISODate, dict: Dictionary): string {
  const { y, m, d } = parts(date);
  const jsDay = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 = Sunday
  return dict.weekdaysLong[(jsDay + 6) % 7];
}
