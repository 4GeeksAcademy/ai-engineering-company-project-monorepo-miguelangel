const differentials = [
  {
    title: "Experiencia sectorial",
    description:
      "Conocimiento profundo de tecnologia, retail y servicios financieros.",
  },
  {
    title: "Metodologia medible",
    description: "Procesos con KPIs claros para seleccion, soporte y formacion.",
  },
  {
    title: "Escalabilidad operativa",
    description:
      "Capacidad para ampliar equipos y cobertura sin perder calidad.",
  },
  {
    title: "Cultura de partnership",
    description:
      "Trabajamos como extension de tu equipo para lograr objetivos compartidos.",
  },
];

export function DifferentialsSection() {
  return (
    <section
      id="diferenciales"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <h2 className="font-display text-3xl font-black text-white sm:text-4xl">
        Por que elegir Nexova
      </h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {differentials.map((item) => (
          <article key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-semibold text-teal-100">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}