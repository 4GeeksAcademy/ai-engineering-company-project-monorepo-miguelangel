import type { AnalysisSummary } from "@/lib/types";

export default function SummaryHeader({ summary }: { summary: AnalysisSummary }) {
  return (
    <div className="rounded-xl bg-ink-900 p-6 text-paper-100">
      <p className="font-mono text-xs uppercase tracking-widest text-paper-100/50">
        Fichero analizado
      </p>
      <p className="mt-1 font-mono text-sm text-teal-400">{summary.source_file}</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Metric label="Total registros" value={summary.total_records} />
        <Metric label="Válidos" value={summary.valid_records} tone="teal" />
        <Metric label="Inválidos" value={summary.invalid_records} tone="amber" />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "teal" | "amber";
}) {
  const valueColor =
    tone === "teal" ? "text-teal-400" : tone === "amber" ? "text-amber-400" : "text-paper-100";

  return (
    <div className="rounded-lg bg-white/5 px-4 py-3">
      <p className="text-xs text-paper-100/50">{label}</p>
      <p className={`mt-1 font-display text-3xl font-medium ${valueColor}`}>{value}</p>
    </div>
  );
}
