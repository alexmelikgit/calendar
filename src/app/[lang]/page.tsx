import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { CurrentMonthRedirect } from "@/components/CurrentMonthRedirect";

export default async function LangHome({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <CurrentMonthRedirect locale={lang} />;
}
