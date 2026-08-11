import type { AnalysisSummary } from "@/lib/types";

export default function CategoryBreakdown({ summary }: { summary: AnalysisSummary }) {
  return (
    <div className="rounded-xl border border-ink-700/10 bg-white p-6">
      <h2 className="mb-4 font-display text-base font-medium text-ink-900">
        Por categoría
      </h2>
      <ul className="space-y-3">
        {summary.category_breakdown.map((item) => (
          <li key={item.category}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-ink-900">{item.category}</span>
              <span className="font-mono text-ink-900/60">
                {item.count} · {item.percentage}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-200">
              <div
                className="h-full rounded-full bg-teal-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
