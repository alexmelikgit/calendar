"use client";

import type { LocalizedCategory } from "@/lib/content";

interface Props {
  categories: LocalizedCategory[];
  hidden: Set<string>;
  onToggle: (id: string) => void;
  onShowAll: () => void;
  label: string;
  allLabel: string;
}

/** Colored chips that work as both the legend and the filter. */
export function CategoryFilter({ categories, hidden, onToggle, onShowAll, label, allLabel }: Props) {
  return (
    <div
      role="group"
      aria-label={label}
      className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0"
    >
      <div className="flex w-max gap-2 pb-1 md:w-auto md:flex-wrap">
        <button
          type="button"
          onClick={onShowAll}
          aria-pressed={hidden.size === 0}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
            hidden.size === 0
              ? "border-cream bg-cream text-ink"
              : "border-page-line text-cream-muted hover:text-cream"
          }`}
        >
          {allLabel}
        </button>
        {categories.map((c) => {
          const on = !hidden.has(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onToggle(c.id)}
              aria-pressed={on}
              style={{ "--c": c.color } as React.CSSProperties}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                on
                  ? "border-[color-mix(in_srgb,var(--c)_70%,white)] bg-[var(--c)] text-white"
                  : "border-page-line text-cream-muted line-through decoration-cream-muted/50 hover:text-cream"
              }`}
            >
              <span
                className={`size-2 rounded-full ${on ? "bg-white/80" : "bg-[var(--c)]"}`}
                aria-hidden
              />
              {c.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
