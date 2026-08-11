import type { AnalysisSummary } from "@/lib/types";

const STATUS_TONE: Record<string, string> = {
  OPEN: "bg-amber-500",
  CLOSED: "bg-teal-500",
  DISCARDED: "bg-ink-700",
};

export default function StatusBreakdown({ summary }: { summary: AnalysisSummary }) {
  return (
    <div className="rounded-xl border border-ink-700/10 bg-white p-6">
      <h2 className="mb-4 font-display text-base font-medium text-ink-900">
        Por estado
      </h2>
      <ul className="space-y-3">
        {summary.status_breakdown.map((item) => (
          <li key={item.status} className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_TONE[item.status] ?? "bg-ink-700"}`}
            />
            <span className="flex-1 text-sm text-ink-900">{item.status}</span>
            <span className="font-mono text-sm text-ink-900/60">
              {item.count} · {item.percentage}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
