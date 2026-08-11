import Link from "next/link";

export default function IncidentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f5ef_0%,#efe8dc_100%)] text-stone-900">
      <header className="border-b border-stone-300/80 bg-stone-50/75 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
              Nexova Support Ops
            </p>
            <p className="mt-1 text-sm text-stone-600">
              Consola específica para análisis de incidencias
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
          >
            Volver al dashboard
          </Link>
        </div>
      </header>

      {children}
    </div>
  );
}