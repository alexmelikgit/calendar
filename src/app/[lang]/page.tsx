import { redirect } from "next/navigation";
import { connection } from "next/server";
import { monthPath, todayInYerevan } from "@/lib/calendar";

/** "/hy" → the current month, e.g. "/hy/2026/10". */
export default async function LangHome({ params }: PageProps<"/[lang]">) {
  await connection(); // "today" must be computed per request, not at build time
  const { lang } = await params;
  redirect(monthPath(lang, todayInYerevan()));
}
