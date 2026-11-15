"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/types";
import type { Dictionary } from "@/i18n/dictionary";
import { monthPath, shiftMonth, type GridDay, type YearMonth } from "@/lib/calendar";
import type { CalendarEvent, LocalizedCategory } from "@/lib/content";
import { useToday } from "@/lib/use-today";
import { DaySheet } from "./DaySheet";
import { FeastList } from "./FeastList";
import { ChevronDown, ChevronLeft, ChevronRight } from "./Icons";
import { MonthGrid } from "./MonthGrid";
import { CategoryFilter } from "./CategoryFilter";
import { MonthPicker } from "./MonthPicker";

interface Props {
  locale: Locale;
  dict: Dictionary;
  ym: YearMonth;
  weeks: GridDay[][];
  /** Events overlapping the visible grid (may include days of nearby months). */
  events: CalendarEvent[];
  monthStart: string;
  monthEnd: string;
  categories: LocalizedCategory[];
  /** Category ids hidden by the filter, read from "?hide=…" in the URL. */
  initialHidden: string[];
  /** A date to highlight on arrival ("?day=YYYY-MM-DD"), e.g. from "Go to date". */
  focusDay: string | null;
  /** The month's illustration (rendered on the server). */
  illustration: React.ReactNode;
  /** The month's title and text (rendered on the server). */
  themeText: React.ReactNode;
}

const SWIPE_MIN = 60;

export function MonthView(props: Props) {
  const { locale, dict, ym, weeks, events, monthStart, monthEnd, categories } = props;
  const router = useRouter();
  const today = useToday();

  const [hidden, setHidden] = useState(() => new Set(props.initialHidden));
  const visibleFor = (h: Set<string>) => events.filter((e) => !h.has(e.category.id));
  const coversDay = (e: CalendarEvent, d: string) => e.start <= d && e.end >= d;

  // Arriving from "Go to date": open that day if it has feasts, and highlight it.
  const [selectedDay, setSelectedDay] = useState<string | null>(() => {
    const d = props.focusDay;
    return d && visibleFor(new Set(props.initialHidden)).some((e) => coversDay(e, d)) ? d : null;
  });
  const [flashDay, setFlashDay] = useState<string | null>(props.focusDay);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Keep the filter in the URL so it survives month changes and can be shared.
  const query = hidden.size ? `?hide=${[...hidden].join(",")}` : "";
  useEffect(() => {
    window.history.replaceState(null, "", `${window.location.pathname}${query}`);
  }, [query]);

  /** Link to a month, keeping the filter; `day` highlights a date there. */
  const hrefFor = (target: YearMonth, day?: string) => {
    const params = new URLSearchParams();
    if (hidden.size) params.set("hide", [...hidden].join(","));
    if (day) params.set("day", day);
    const qs = params.toString().replace(/%2C/g, ",");
    return monthPath(locale, target) + (qs ? `?${qs}` : "");
  };

  const prevHref = hrefFor(shiftMonth(ym, -1));
  const nextHref = hrefFor(shiftMonth(ym, 1));
  const [ty, tm] = (today ?? "").split("-").map(Number);
  const isCurrentMonth = today !== null && ty === ym.year && tm === ym.month;

  // Scroll the highlighted day into view, then fade the highlight out.
  useEffect(() => {
    if (!flashDay) return;
    document
      .querySelector(`[data-date="${flashDay}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    const t = setTimeout(() => setFlashDay(null), 2400);
    return () => clearTimeout(t);
  }, [flashDay]);

  const goTo = (target: YearMonth, day?: string) => {
    setPickerOpen(false);
    if (target.year === ym.year && target.month === ym.month) {
      // Same month: no navigation, just highlight (and open) the day.
      if (day) {
        setFlashDay(null);
        requestAnimationFrame(() => setFlashDay(day));
        if (visible.some((e) => coversDay(e, day))) setSelectedDay(day);
      }
      return;
    }
    router.push(hrefFor(target, day), { scroll: false });
  };

  const visible = visibleFor(hidden);
  const inMonth = visible.filter((e) => e.start <= monthEnd && e.end >= monthStart);
  const selectedEvents = selectedDay
    ? visible.filter((e) => e.start <= selectedDay && e.end >= selectedDay)
    : [];

  const toggle = (id: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      // Hiding everything is never useful: treat it as "show all".
      return next.size === categories.length ? new Set() : next;
    });

  // ← → keys change month (when no dialog is open).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedDay || pickerOpen || e.altKey || e.metaKey || e.ctrlKey) return;
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowLeft") router.push(prevHref, { scroll: false });
      if (e.key === "ArrowRight") router.push(nextHref, { scroll: false });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, prevHref, nextHref, selectedDay, pickerOpen]);

  // Horizontal swipe on the grid changes month.
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    router.push(dx < 0 ? nextHref : prevHref, { scroll: false });
  };

  const navBtn =
    "flex size-10 items-center justify-center rounded-full border border-page-line bg-page-raised text-cream transition-colors hover:border-cream";

  return (
    // Phones: illustration → theme text → toolbar → grid → list (one column).
    // Desktop: the toolbar spans the full width; below it the illustration
    // sits next to the calendar grid and stretches to exactly its height,
    // and the theme text sits next to the feast list.
    <div className="flex flex-col gap-5 pb-16 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-10 lg:gap-y-8">
      <div className="order-1 lg:order-none lg:col-start-1 lg:row-start-2">{props.illustration}</div>
      <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-3">{props.themeText}</div>

      {/* Toolbar: month name, feast-type chips, navigation */}
      <div className="order-3 flex flex-wrap items-center gap-x-2 gap-y-4 px-4 pt-3 md:px-0 lg:order-none lg:col-span-2 lg:row-start-1 lg:flex-nowrap lg:gap-x-6 lg:pt-0">
        <h2 className="mr-auto lg:mr-0" aria-live="polite">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            aria-label={`${dict.months[ym.month - 1]} ${ym.year} — ${dict.goToDate}`}
            aria-haspopup="dialog"
            className="group -mx-2 flex items-center gap-1.5 rounded-xl px-2 py-1 font-serif text-2xl font-semibold whitespace-nowrap text-cream transition-colors hover:bg-page-raised md:text-3xl"
          >
            {dict.months[ym.month - 1]} <span className="font-normal text-cream-muted">{ym.year}</span>
            <ChevronDown className="size-5 text-cream-muted transition-colors group-hover:text-cream" />
          </button>
        </h2>
        <div className="flex items-center gap-2 lg:order-3">
          {today && (
            <button
              type="button"
              onClick={() => goTo({ year: ty, month: tm }, today)}
              aria-current={isCurrentMonth ? "date" : undefined}
              className="rounded-full border border-page-line bg-page-raised px-3 py-2 text-sm text-cream hover:border-cream"
            >
              {dict.today}
            </button>
          )}
          <Link href={prevHref} scroll={false} aria-label={dict.previousMonth} className={navBtn}>
            <ChevronLeft />
          </Link>
          <Link href={nextHref} scroll={false} aria-label={dict.nextMonth} className={navBtn}>
            <ChevronRight />
          </Link>
        </div>
        <div className="w-full lg:order-2 lg:w-auto lg:min-w-0 lg:flex-1">
          <CategoryFilter
            categories={categories}
            hidden={hidden}
            onToggle={toggle}
            onShowAll={() => setHidden(new Set())}
            label={dict.filterLabel}
            allLabel={dict.all}
          />
        </div>
      </div>

      <div
        className="order-4 px-4 md:px-0 lg:order-none lg:col-start-2 lg:row-start-2"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <MonthGrid
          weeks={weeks}
          events={visible}
          today={today}
          flashDay={flashDay}
          locale={locale}
          dict={dict}
          onSelectDay={setSelectedDay}
        />
        <p className="mt-2 text-center text-xs text-cream-muted md:hidden">{dict.swipeHint}</p>
      </div>

      <div className="order-5 px-4 md:px-0 lg:order-none lg:col-start-2 lg:row-start-3">
        <FeastList events={inMonth} locale={locale} dict={dict} />
      </div>

      <MonthPicker
        key={pickerOpen ? "open" : "closed"}
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        current={ym}
        today={today}
        dict={dict}
        onGo={goTo}
      />

      <DaySheet
        date={selectedDay}
        events={selectedEvents}
        locale={locale}
        dict={dict}
        onClose={() => setSelectedDay(null)}
      />
    </div>
  );
}
