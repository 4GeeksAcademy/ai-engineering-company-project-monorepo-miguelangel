const processSteps = [
  {
    step: "Paso 1",
    title: "Diagnostico",
    description:
      "Alineamos objetivos, perfiles y capacidades con tus necesidades de negocio.",
  },
  {
    step: "Paso 2",
    title: "Ejecucion",
    description:
      "Activamos procesos de seleccion, soporte o formacion con seguimiento continuo.",
  },
  {
    step: "Paso 3",
    title: "Optimizacion",
    description:
      "Medimos resultados, ajustamos estrategia y mejoramos rendimiento de forma iterativa.",
  },
];

export function ProcessSection() {
  return (
    <section id="proceso" className="bg-slate-900/60 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-black text-white sm:text-4xl">
          Como trabajamos contigo
        </h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {processSteps.map((item) => (
            <li key={item.step} className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-200">
                {item.step}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-slate-300">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}