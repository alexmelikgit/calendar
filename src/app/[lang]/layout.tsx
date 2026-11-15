import type { Metadata } from "next";
import { notFound } from "next/navigation";
// Fonts are self-hosted (bundled from npm), so they work without Google Fonts.
import "@fontsource-variable/noto-sans-armenian";
import "@fontsource-variable/noto-serif-armenian";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: { default: dict.siteTitle, template: `%s · ${dict.siteTitle}` },
    description: dict.siteDescription,
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className="antialiased">
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
