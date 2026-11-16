"use client";

import { Link } from "react-router";
import { useLocation } from "react-router";
import type { Locale } from "@/content/types";
import { locales } from "@/i18n/config";

const labels: Record<Locale, string> = { hy: "Հայ", en: "Eng" };

export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  const { pathname, search, hash } = useLocation();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <nav aria-label={label} className="flex rounded-full border border-page-line bg-page-raised p-0.5 text-sm">
      {locales.map((l) => (
        <Link
          key={l}
          to={`/${l}${rest ? `/${rest}` : ""}${search}${hash}`}
          hrefLang={l}
          aria-current={l === current ? "true" : undefined}
          className={`rounded-full px-3 py-1 transition-colors ${
            l === current ? "bg-cream text-ink" : "text-cream-muted hover:text-cream"
          }`}
        >
          {labels[l]}
        </Link>
      ))}
    </nav>
  );
}

