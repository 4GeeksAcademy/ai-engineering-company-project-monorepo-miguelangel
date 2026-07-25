import Link from "next/link";

export function ContactSection() {
  return (
    <section id="contacto" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="rounded-2xl border border-teal-200/20 bg-gradient-to-r from-teal-400/20 to-cyan-300/20 p-8 sm:p-10">
        <h2 className="font-display text-3xl font-black text-white sm:text-4xl">
          Listo para fortalecer tu estrategia de talento?
        </h2>
        <p className="mt-4 max-w-2xl text-slate-100">
          Hablemos de tus retos de contratacion, formacion y soporte. Nuestro equipo
          disena un plan a medida para tu empresa.
        </p>
        <div className="mt-8 grid gap-4 text-sm text-slate-100 sm:grid-cols-2">
          <p>
            <strong>Email:</strong> hola@nexovasolutions.com
          </p>
          <p>
            <strong>Telefono:</strong> +34 960 000 000
          </p>
          <p>
            <strong>Sede principal:</strong> Valencia, Espana
          </p>
          <p>
            <strong>Oficina de expansion:</strong> Miami, Florida
          </p>
        </div>
        <Link
          href="/application"
          className="mt-8 inline-flex rounded-md bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          Completar solicitud
        </Link>
      </div>
    </section>
  );
}