const services = [
  {
    title: "Headhunting de mandos y directivos",
    description:
      "Aceleramos el time-to-hire con un enfoque consultivo, evaluacion estructurada y trazabilidad de cada etapa del proceso.",
  },
  {
    title: "Outsourcing de soporte al cliente",
    description:
      "Formamos y operamos equipos dedicados multicanal para que mantengas tus SLA y mejores la experiencia de tus clientes.",
  },
  {
    title: "Formacion corporativa en liderazgo",
    description:
      "Programas para desarrollar competencias de liderazgo, comunicacion y gestion de equipos con enfoque aplicable al negocio.",
  },
];

export function ServicesSection() {
  return (
    <section id="servicios" className="border-y border-white/10 bg-slate-900/50 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-black text-white sm:text-4xl">
          Nuestros servicios principales
        </h2>
        <p className="mt-4 max-w-3xl text-slate-300">
          Disenamos soluciones integrales para medianas empresas de tecnologia,
          retail y servicios financieros que necesitan externalizar y optimizar
          su gestion de talento.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-2xl border border-teal-300/15 bg-slate-900/70 p-6"
            >
              <h3 className="text-xl font-semibold text-teal-100">{service.title}</h3>
              <p className="mt-3 text-slate-300">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}