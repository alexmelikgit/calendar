import { Link } from "react-router";
import { NotFound } from "./NotFound";
import { SiteHeader } from "@/components/SiteHeader";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { formatRange } from "@/i18n/format";
import { monthPath } from "@/lib/calendar";
import { getCategory, getDatesOf, getFeast } from "@/lib/content";

export function FeastPage({ lang, slug }: { lang: string; slug: string }) {
  if (!isLocale(lang)) return <NotFound />;
  const feast = getFeast(slug);
  if (!feast) return <NotFound />;
  const category = getCategory(feast.categoryId);
  const dates = getDatesOf(slug);
  const dict = getDictionary(lang);
  const color = category?.color ?? "#9e2333";

  return (
    <div style={{ "--accent": color } as React.CSSProperties}>
      <title>{`${feast.name[lang]} · ${dict.siteTitle}`}</title>
      <meta name="description" content={feast.short[lang]} />
      <SiteHeader locale={lang} dict={dict} />
      <main className="mx-auto max-w-2xl px-4 pt-4 pb-16 md:pt-10">
        <Link to={`/${lang}`} className="text-sm text-cream-muted hover:text-cream">
          ← {dict.backToCalendar}
        </Link>

        <article className="mt-6 overflow-hidden rounded-2xl bg-card text-ink">
          <div className="linen-stripe" aria-hidden />
          <div className="p-6 md:p-10">
            {category && (
              <p className="text-sm font-medium" style={{ color }}>
                {category.name[lang]}
              </p>
            )}
            <h1 className="mt-1 font-serif text-3xl font-semibold md:text-4xl">{feast.name[lang]}</h1>
            {!feast.long[lang][0]?.startsWith(feast.short[lang]) && (
              <p className="mt-3 text-lg leading-relaxed text-muted">{feast.short[lang]}</p>
            )}

            <div className="mt-8 flex flex-col gap-4 leading-relaxed">
              {feast.long[lang].map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </article>

        {dates.length > 0 && (
          <section className="mt-10">
            <h2 className="font-serif text-xl font-semibold text-cream">{dict.upcomingDates}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {dates.map((d) => {
                const [y, m] = d.start.split("-").map(Number);
                return (
                  <li key={d.start}>
                    <Link
                      to={monthPath(lang, { year: y, month: m })}
                      className="flex items-center justify-between gap-4 rounded-xl bg-card px-4 py-3 text-ink ring-[var(--accent)] hover:ring-2"
                    >
                      <span>{formatRange(d.start, d.end, lang, dict, true)}</span>
                      <span aria-hidden>→</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

