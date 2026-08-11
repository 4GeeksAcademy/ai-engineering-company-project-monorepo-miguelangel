"use client";

import { useCallback, useRef, useState } from "react";

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
  fileName: string | null;
}

export default function FileUploader({
  onFileSelected,
  isLoading,
  fileName,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      if (!file.name.toLowerCase().endsWith(".csv")) {
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      className={`group cursor-pointer rounded-xl border-2 border-dashed px-8 py-14 text-center transition-colors ${
        isDragging
          ? "border-teal-500 bg-teal-400/10"
          : "border-ink-700/20 bg-white hover:border-teal-500/60"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-paper-100">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {isLoading ? (
        <p className="font-display text-base font-medium text-ink-900">
          Analizando fichero…
        </p>
      ) : fileName ? (
        <>
          <p className="font-mono text-sm text-teal-600">{fileName}</p>
          <p className="mt-1 text-sm text-ink-900/60">
            Suelta otro fichero para volver a analizar
          </p>
        </>
      ) : (
        <>
          <p className="font-display text-base font-medium text-ink-900">
            Arrastra el CSV de incidencias aquí
          </p>
          <p className="mt-1 text-sm text-ink-900/60">
            o haz clic para seleccionarlo desde tu equipo
          </p>
        </>
      )}
    </div>
  );
}
