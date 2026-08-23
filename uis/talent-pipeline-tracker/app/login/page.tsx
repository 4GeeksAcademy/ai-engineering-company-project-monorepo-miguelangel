"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login, me } from "@/lib/auth-api";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
	const router = useRouter();
	const { setUser } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		setSubmitting(true);

		try {
			await login(email, password);
			const user = await me();
			setUser(user);
			router.push("/");
		} catch (loginError) {
			const message =
				loginError instanceof Error ? loginError.message : "No se pudo iniciar sesion";
			setError(message);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-800">
			<div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
				<p className="text-sm font-medium uppercase tracking-wide text-teal-700">
					Nexova Solutions
				</p>
				<h1 className="mt-2 text-2xl font-semibold">Iniciar sesion</h1>
				<p className="mt-2 text-sm text-slate-600">Talent Pipeline Tracker</p>

				<form onSubmit={handleSubmit} className="mt-6 space-y-4">
					<label className="block space-y-1">
						<span className="text-sm font-medium text-slate-700">Email</span>
						<input
							required
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-500"
						/>
					</label>

					<label className="block space-y-1">
						<span className="text-sm font-medium text-slate-700">Contrasena</span>
						<input
							required
							type="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-500"
						/>
					</label>

					<p className="text-right text-sm">
						<Link href="/forgot-password" className="font-medium text-teal-700 hover:text-teal-800">
							Olvidaste tu contrasena?
						</Link>
					</p>

					{error && <p className="text-sm text-rose-700">{error}</p>}

					<button
						type="submit"
						disabled={submitting}
						className="w-full rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800 disabled:opacity-60"
					>
						{submitting ? "Entrando..." : "Entrar"}
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-slate-600">
					No tienes cuenta?{" "}
					<Link href="/register" className="font-medium text-teal-700 hover:text-teal-800">
						Registrate
					</Link>
				</p>
			</div>
		</main>
	);
}
