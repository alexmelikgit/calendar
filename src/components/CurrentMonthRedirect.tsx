"use client";

import { useEffect } from "react";
import type { Locale } from "@/content/types";
import { monthPath, todayInYerevan } from "@/lib/calendar";

export function CurrentMonthRedirect({ locale }: { locale: Locale }) {
  useEffect(() => {
    window.location.replace(monthPath(locale, todayInYerevan()) + window.location.search + window.location.hash);
  }, [locale]);
  return <main className="p-6"><a href={`/${locale}/2027/01/`}>
    {locale === "hy" ? "Բացել 2027 թվականի օրացույցը" : "Open the 2027 calendar"}
  </a></main>;
}
