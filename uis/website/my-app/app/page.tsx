import type { Metadata } from "next";
import { BackgroundDecor } from "./components/landing/BackgroundDecor";
import { ContactSection } from "./components/landing/ContactSection";
import { DifferentialsSection } from "./components/landing/DifferentialsSection";
import { Footer } from "./components/landing/Footer";
import { HeroSection } from "./components/landing/HeroSection";
import { LandingHeader } from "./components/landing/LandingHeader";
import { ProcessSection } from "./components/landing/ProcessSection";
import { ServicesSection } from "./components/landing/ServicesSection";

export const metadata: Metadata = {
  title: "Consultoria HR y Adquisicion de Talento",
  description:
    "Nexova Solutions impulsa el crecimiento de empresas con headhunting especializado, outsourcing de soporte y formacion corporativa.",
  keywords: [
    "consultoria recursos humanos",
    "headhunting",
    "adquisicion de talento",
    "outsourcing soporte",
    "formacion corporativa",
    "valencia",
    "miami",
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Nexova Solutions",
  description:
    "Consultora de recursos humanos y adquisicion de talento para empresas tecnologicas, retail y financieras.",
  url: "https://nexova.example.com/",
  logo: "https://nexova.example.com/logo.png",
  foundingDate: "2011",
  numberOfEmployees: {
    "@type": "QuantitativeValue",
    value: 120,
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Valencia",
    addressCountry: "ES",
  },
  areaServed: ["Espana", "Estados Unidos"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "hola@nexovasolutions.com",
    telephone: "+34 960 000 000",
    availableLanguage: ["es", "en"],
  },
  sameAs: ["https://www.linkedin.com/company/nexova-solutions"],
};

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <BackgroundDecor variant="landing" />
      <LandingHeader />
      <main id="inicio">
        <HeroSection />
        <ServicesSection />
        <DifferentialsSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
