"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { forgotPassword } from "@/lib/auth-api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (forgotError) {
      const message =
        forgotError instanceof Error ? forgotError.message : "No se pudo procesar la solicitud";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-[0_24px_40px_-36px_rgba(0,0,0,0.8)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Nexova Solutions
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Recuperar contrasena</h1>
        <p className="mt-2 text-sm text-slate-400">
          Introduce tu email y te enviaremos un enlace para restablecerla.
        </p>

        {submitted ? (
          <p className="mt-6 text-sm text-emerald-400">
            Si esa direccion esta registrada, recibiras un enlace en breve.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-300">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-500"
              />
            </label>

            {error && <p className="text-sm text-rose-400">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-500 disabled:opacity-60"
            >
              {submitting ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link href="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
            Volver a iniciar sesion
          </Link>
        </p>
      </div>
    </main>
  );
}
