import type { Metadata } from "next";
import { Suspense } from "react";
import { MonthQuery } from "@/components/MonthQuery";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MonthIllustration } from "@/components/MonthIllustration";

import { SiteHeader } from "@/components/SiteHeader";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMonthGrid, monthRange, parseYearMonth } from "@/lib/calendar";
import { getCategories, getEventsBetween, getMonthTheme } from "@/lib/content";

type Props = PageProps<"/[lang]/[year]/[month]">;

// Preserve the existing date picker's complete supported range.
export const dynamicParams = false;
export function generateStaticParams() {
  return Array.from({ length: 301 * 12 }, (_, i) => ({
    year: String(1900 + Math.floor(i / 12)),
    month: String((i % 12) + 1).padStart(2, "0"),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, year, month } = await params;
  const ym = parseYearMonth(year, month);
  if (!isLocale(lang) || !ym) return {};
  const dict = getDictionary(lang);
  const theme = await getMonthTheme(ym.month);
  return {
    title: `${dict.months[ym.month - 1]} ${ym.year}`,
    description: theme.text[lang],
  };
}

export default async function MonthPage({ params }: Props) {
  const { lang, year, month } = await params;
  const ym = parseYearMonth(year, month);
  if (!isLocale(lang) || !ym) notFound();

  const dict = getDictionary(lang);
  const weeks = buildMonthGrid(ym);
  const gridStart = weeks[0][0].date;
  const gridEnd = weeks[weeks.length - 1][6].date;
  const { start: monthStart, end: monthEnd } = monthRange(ym);

  const [theme, events, categories] = await Promise.all([
    getMonthTheme(ym.month),
    getEventsBetween(gridStart, gridEnd, lang),
    getCategories(lang),
  ]);


  return (
    <div style={{ "--accent": theme.accent } as React.CSSProperties}>
      <SiteHeader locale={lang} dict={dict} />

      <main className="mx-auto max-w-7xl md:px-8">
        <Suspense fallback={<p className="p-4">{dict.siteTitle}</p>}>
        <MonthQuery
          key={`${ym.year}-${ym.month}`}
          locale={lang}
          dict={dict}
          ym={ym}
          weeks={weeks}
          events={events}
          monthStart={monthStart}
          monthEnd={monthEnd}
          categories={categories}
          illustration={
            <MonthIllustration
              key={theme.illustration.file}
              theme={theme}
              locale={lang}
              placeholderLabel={dict.illustrationPlaceholder}
            />
          }
          themeText={
            <section aria-labelledby="month-theme" className="px-4 md:px-0">
              <p className="flex items-center gap-2 text-xs font-medium tracking-wider text-cream-muted uppercase">
                <span className="h-px w-6 bg-[color-mix(in_srgb,var(--accent)_60%,white)]" aria-hidden />
                {dict.months[ym.month - 1]}
              </p>
              <h1 id="month-theme" className="mt-1 font-serif text-3xl font-semibold text-cream md:text-4xl">
                {theme.title[lang]}
              </h1>
              {/* Phones: first lines only; the full text is on the feast page */}
              <p className="mt-2 line-clamp-4 max-w-prose leading-relaxed text-cream-muted lg:line-clamp-none">
                {theme.text[lang]}
              </p>
              {theme.featuredFeast && (
                <Link
                  href={`/${lang}/feasts/${theme.featuredFeast}`}
                  className="mt-3 inline-block text-sm font-medium text-cream underline decoration-[color-mix(in_srgb,var(--accent)_70%,white)] underline-offset-4 hover:decoration-cream"
                >
                  {dict.readMore} →
                </Link>
              )}
            </section>
          }
        />
        </Suspense>
      </main>
    </div>
  );
}

