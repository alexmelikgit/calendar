import type { Locale } from "@/content/types";

export const locales: Locale[] = ["hy", "en"];
export const defaultLocale: Locale = "hy";

export function isLocale(value: string): value is Locale {
  return (locales as string[]).includes(value);
}
