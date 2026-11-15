"use client";

import { useSyncExternalStore } from "react";
import { toISO } from "./calendar";

const subscribe = () => () => {};

/**
 * Today's date in the visitor's own timezone, e.g. "2026-10-01".
 * Returns null during server rendering, so "today" is only highlighted
 * in the browser (avoids showing the server's date to the visitor).
 */
export function useToday(): string | null {
  return useSyncExternalStore(
    subscribe,
    () => toISO(new Date()),
    () => null,
  );
}
