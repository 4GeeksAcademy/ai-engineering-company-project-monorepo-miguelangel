interface FooterProps {
  compact?: boolean;
}

export function Footer({ compact = false }: FooterProps) {
  if (compact) {
    return (
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto w-full max-w-5xl px-4 text-sm text-slate-400 sm:px-6 lg:px-8">
          (c) 2026 Nexova Solutions. Valencia, Espana | Miami, Florida
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/10 py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>(c) 2026 Nexova Solutions. Todos los derechos reservados.</p>
        <p>Consultoria HR, adquisicion de talento y formacion corporativa.</p>
      </div>
    </footer>
  );
}