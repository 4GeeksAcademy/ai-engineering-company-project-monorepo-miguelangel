import CandidatesPageClient from "@/components/CandidatesPageClient";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense
      fallback={<p className="p-6 text-sm text-slate-600">Cargando aplicacion...</p>}
    >
      <CandidatesPageClient />
    </Suspense>
  );
}
