import type { Metadata } from "next";
import Link from "next/link";
import { ApplicationForm } from "../components/application/ApplicationForm";
import { BackgroundDecor } from "../components/landing/BackgroundDecor";
import { Footer } from "../components/landing/Footer";

export const metadata: Metadata = {
  title: "Solicitud de Servicios",
  description:
    "Completa tu solicitud en Nexova Solutions para recibir una propuesta de consultoria en seleccion, soporte y formacion corporativa.",
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Solicitud de Servicios - Nexova Solutions",
  url: "https://nexova.example.com/application",
  about: {
    "@type": "ProfessionalService",
    name: "Nexova Solutions",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Valencia",
      addressCountry: "ES",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "hola@nexovasolutions.com",
      telephone: "+34 960 000 000",
    },
  },
};

export default function ApplicationPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <BackgroundDecor variant="application" />

      <header className="border-b border-white/10 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-sm font-semibold text-teal-200 hover:text-teal-100"
            aria-label="Volver a la pagina principal"
          >
            ← Volver al inicio
          </Link>
          <p className="text-sm text-slate-300">Nexova Solutions</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="mb-10">
          <h1 className="font-display text-4xl font-black text-white sm:text-5xl">
            Solicitud de servicios
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Comparte los detalles de tu empresa y objetivos. Validaremos tu
            informacion y un consultor te contactara con una propuesta personalizada.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-900/40 sm:p-8">
          <ApplicationForm />
        </section>
      </main>

      <Footer compact />
    </div>
  );
}