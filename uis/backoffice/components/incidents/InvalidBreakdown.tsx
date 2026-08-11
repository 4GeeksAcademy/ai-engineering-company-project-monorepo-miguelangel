import type { AnalysisSummary } from "@/lib/types";

export default function InvalidBreakdown({ summary }: { summary: AnalysisSummary }) {
  const active = summary.invalid_breakdown.filter((item) => item.count > 0);

  return (
    <div className="rounded-xl border border-ink-700/10 bg-white p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-base font-medium text-ink-900">
          Registros inválidos o incompletos
        </h2>
        <span className="font-mono text-sm text-amber-600">
          {summary.invalid_records} de {summary.total_records}
        </span>
      </div>

      {active.length === 0 ? (
        <p className="text-sm text-ink-900/60">
          No se detectaron registros inválidos en este fichero.
        </p>
      ) : (
        <ul className="divide-y divide-ink-700/10">
          {active.map((item) => (
            <li key={item.rule} className="flex items-center justify-between py-2.5">
              <span className="text-sm text-ink-900">{item.label}</span>
              <span className="font-mono text-sm font-medium text-amber-600">
                {item.count}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs text-ink-900/40">
        Estos registros se excluyen del análisis principal, pero nunca se descartan en silencio: cada uno queda contabilizado aquí por tipo de problema.
      </p>
    </div>
  );
}
