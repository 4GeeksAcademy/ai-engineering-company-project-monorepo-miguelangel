import Link from "next/link";

const impactStats = [
  { label: "Facturacion anual", value: "$8M" },
  { label: "Especialistas", value: "120" },
  { label: "Experiencia", value: "12+ anos" },
];

export function HeroSection() {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:pb-24 lg:pt-20">
      <div>
        <p className="mb-4 inline-flex items-center rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-200">
          HR Consulting + Talent Acquisition
        </p>
        <h1 className="font-display text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
          Equipos de alto rendimiento para empresas que necesitan escalar hoy.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          En Nexova combinamos headhunting ejecutivo, outsourcing de soporte y
          formacion corporativa para que tus equipos encuentren, desarrollen y
          retengan talento con velocidad, trazabilidad y foco en resultados.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/application"
            className="rounded-md bg-teal-400 px-6 py-3 text-center font-semibold text-slate-900 transition hover:bg-teal-300"
          >
            Solicitar evaluacion de talento
          </Link>
          <a
            href="#contacto"
            className="rounded-md border border-slate-300/40 px-6 py-3 text-center font-semibold text-slate-100 transition hover:border-teal-200 hover:text-teal-100"
          >
            Hablar con un consultor
          </a>
        </div>
      </div>
      <aside className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-900/20">
        <h2 className="text-lg font-semibold text-white">Impacto real en negocio</h2>
        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {impactStats.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-slate-900/70 p-4">
              <dt className="text-sm text-slate-400">{stat.label}</dt>
              <dd className="mt-1 text-2xl font-bold text-teal-200">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </section>
  );
}