import Link from "next/link";

const navItems = [
  { href: "#servicios", label: "Servicios" },
  { href: "#diferenciales", label: "Diferenciales" },
  { href: "#proceso", label: "Proceso" },
  { href: "#contacto", label: "Contacto" },
];

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur">
      <nav
        className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Principal"
      >
        <a href="#inicio" className="flex items-center gap-3" aria-label="Nexova Solutions inicio">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-teal-400/20 text-teal-200">
            NS
          </span>
          <span className="text-lg font-semibold tracking-tight">Nexova Solutions</span>
        </a>
        <ul className="hidden items-center gap-8 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="transition hover:text-teal-200">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <Link
          href="/application"
          className="rounded-md bg-teal-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-teal-300"
        >
          Postularme
        </Link>
      </nav>
    </header>
  );
}