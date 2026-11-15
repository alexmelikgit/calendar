import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-serif text-3xl font-semibold text-cream">404</h1>
      <p className="text-cream-muted">Էջը չի գտնվել · Page not found</p>
      <Link href="/" className="rounded-full border border-page-line bg-page-raised px-4 py-2 text-cream hover:border-cream">
        ←
      </Link>
    </main>
  );
}
