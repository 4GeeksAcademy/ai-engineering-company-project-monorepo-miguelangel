import type { AnalysisSummary } from "@/lib/types";

export default function SatisfactionIndex({ summary }: { summary: AnalysisSummary }) {
  const { satisfaction } = summary;
  const maxCount = Math.max(1, ...satisfaction.distribution.map((d) => d.count));

  return (
    <div className="rounded-xl border border-ink-700/10 bg-white p-6">
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="font-display text-base font-medium text-ink-900">
          Índice de satisfacción
        </h2>
        <span className="text-xs text-ink-900/50">
          {satisfaction.scored_tickets} de {satisfaction.closed_tickets} tickets cerrados con puntuación
        </span>
      </div>

      <div className="mb-6 flex items-end gap-2">
        <span className="font-display text-4xl font-medium text-teal-600">
          {satisfaction.average.toFixed(2)}
        </span>
        <span className="mb-1 text-sm text-ink-900/50">/ 5.00</span>
      </div>

      <div className="flex items-end gap-3">
        {satisfaction.distribution.map((item) => (
          <div key={item.score} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="font-mono text-xs text-ink-900/60">{item.count}</span>
            <div className="flex h-24 w-full items-end rounded-md bg-paper-200">
              <div
                className="w-full rounded-md bg-amber-500"
                style={{
                  height: `${(item.count / maxCount) * 100}%`,
                  minHeight: item.count > 0 ? "6px" : "0px",
                }}
              />
            </div>
            <span className="font-mono text-xs text-ink-900/40">{item.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
