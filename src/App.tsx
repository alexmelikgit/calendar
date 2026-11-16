import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { isLocale } from "@/i18n/config";
import { monthPath, todayInYerevan } from "@/lib/calendar";
import { MonthPage } from "@/pages/MonthPage";
import { FeastPage } from "@/pages/FeastPage";
import { NotFound } from "@/pages/NotFound";

/** One browser application handles every language, month and feast URL. */
export function App() {
  const { pathname, search, hash } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  const [lang, section, detail] = parts;
  useEffect(() => {
    document.documentElement.lang = isLocale(lang) ? lang : "hy";
  }, [lang]);

  if (!lang) return <Navigate replace to={`/hy/${search}${hash}`} />;
  // Preserve the former unprefixed Armenian URLs.
  if (!isLocale(lang)) return <Navigate replace to={`/hy${pathname}${search}${hash}`} />;
  if (parts.length === 1) {
    return <Navigate replace to={`${monthPath(lang, todayInYerevan())}${search}${hash}`} />;
  }
  if (parts.length !== 3) return <NotFound />;
  if (section === "feasts") return <FeastPage lang={lang} slug={detail} />;
  return <MonthPage lang={lang} year={section} month={detail} />;
}
