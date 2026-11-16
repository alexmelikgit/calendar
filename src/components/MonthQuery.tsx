"use client";

import { useSearchParams } from "next/navigation";
import { MonthView, type MonthViewProps } from "./MonthView";

/** Query-dependent state is resolved in the browser on a static host. */
export function MonthQuery(props: Omit<MonthViewProps, "initialHidden" | "focusDay">) {
  const query = useSearchParams();
  const initialHidden = (query.get("hide") ?? "").split(",")
    .filter((id) => props.categories.some((category) => category.id === id));
  const day = query.get("day") ?? "";
  const focusDay = /^\d{4}-\d{2}-\d{2}$/.test(day) && day >= props.monthStart && day <= props.monthEnd
    ? day : null;
  return <MonthView key={`${props.ym.year}-${props.ym.month}:${query.toString()}`}
    {...props} initialHidden={initialHidden} focusDay={focusDay} />;
}
