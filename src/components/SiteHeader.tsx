import { Link } from "react-router";
import type { Locale } from "@/content/types";
import type { Dictionary } from "@/i18n/dictionary";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-5">
      <Link to={`/${locale}`} className="leading-tight">
        <span className="block font-serif text-lg font-semibold text-cream md:text-xl">
          {dict.siteTitle}
        </span>
        <span className="block text-xs text-cream-muted">{dict.siteSubtitle}</span>
      </Link>
      <LanguageSwitcher current={locale} label={dict.language} />
    </header>
  );
}

