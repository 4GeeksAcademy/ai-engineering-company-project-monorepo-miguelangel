"use client";

import { useState } from "react";
import { downloadResultsCsv, ApiError } from "@/lib/api";

export default function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    try {
      await downloadResultsCsv();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo descargar el CSV.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="inline-flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-2.5 font-display text-sm font-medium text-paper-100 transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 4v12M12 16l-4-4M12 16l4-4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 18v1a2 2 0 002 2h12a2 2 0 002-2v-1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {isExporting ? "Descargando…" : "Descargar CSV"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
