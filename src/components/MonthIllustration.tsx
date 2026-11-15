"use client";

import Image from "next/image";
import { useState } from "react";
import type { Locale, MonthTheme } from "@/content/types";

/**
 * Phones/tablets: a short banner cropped around the illustration's `focus`.
 * Desktop: fills the space next to the calendar grid, exactly as tall as it.
 *
 * If the image file hasn't been added to /public/illustrations yet, a
 * placeholder with the expected file name is shown instead.
 */
export function MonthIllustration({
  theme,
  locale,
  placeholderLabel,
}: {
  theme: MonthTheme;
  locale: Locale;
  placeholderLabel: string;
}) {
  const ill = theme.illustration;
  const [missing, setMissing] = useState(false);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:rounded-2xl">
      {missing ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border-y border-dashed border-page-line bg-page-raised p-6 text-center lg:rounded-2xl lg:border">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-8 text-cream-muted" aria-hidden>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="10" r="2" />
            <path d="m21 16-5-5-9 9" />
          </svg>
          <p className="text-sm text-cream-muted">{placeholderLabel}</p>
          <code className="rounded bg-page px-2 py-1 text-xs text-cream">public/illustrations/{ill.file}</code>
        </div>
      ) : (
        <Image
          key={ill.file}
          src={`/illustrations/${ill.file}`}
          alt={ill.alt[locale]}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          priority
          className="object-cover"
          style={{ objectPosition: ill.focus ?? "50% 35%" }}
          onError={() => setMissing(true)}
        />
      )}
    </div>
  );
}
