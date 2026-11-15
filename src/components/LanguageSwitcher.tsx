"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/content/types";
import { locales } from "@/i18n/config";

const labels: Record<Locale, string> = { hy: "Հայ", en: "Eng" };

export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <nav aria-label={label} className="flex rounded-full border border-page-line bg-page-raised p-0.5 text-sm">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ""}`}
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
