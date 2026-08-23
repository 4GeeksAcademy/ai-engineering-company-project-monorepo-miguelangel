"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthApiError, me, register } from "@/lib/auth-api";
import { useAuth } from "@/lib/AuthContext";

const initialForm = {
	email: "",
	password: "",
	name: "",
	phone: "",
	address: "",
};

export default function RegisterPage() {
	const router = useRouter();
	const { setUser } = useAuth();

	const [form, setForm] = useState(initialForm);
	const [error, setError] = useState("");
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);

	function update(field: keyof typeof initialForm, value: string) {
		setForm((current) => ({ ...current, [field]: value }));
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		setFieldErrors({});
		setSubmitting(true);

		try {
			await register({
				email: form.email,
				password: form.password,
				name: form.name || undefined,
				phone: form.phone || undefined,
				address: form.address || undefined,
			});
			const user = await me();
			setUser(user);
			router.push("/");
		} catch (registerError) {
			if (registerError instanceof AuthApiError) {
				setError(registerError.message);
				setFieldErrors(registerError.fieldErrors ?? {});
			} else {
				setError("No se pudo completar el registro");
			}
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-800">
			<div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
				<p className="text-sm font-medium uppercase tracking-wide text-teal-700">
					Nexova Solutions
				</p>
				<h1 className="mt-2 text-2xl font-semibold">Crear cuenta</h1>
				<p className="mt-2 text-sm text-slate-600">Talent Pipeline Tracker</p>

				<form onSubmit={handleSubmit} className="mt-6 grid gap-4">
					<label className="block space-y-1">
						<span className="text-sm font-medium text-slate-700">Email</span>
						<input
							required
							type="email"
							value={form.email}
							onChange={(event) => update("email", event.target.value)}
							className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-500"
						/>
						{fieldErrors.email && <p className="text-xs text-rose-700">{fieldErrors.email}</p>}
					</label>

					<label className="block space-y-1">
						<span className="text-sm font-medium text-slate-700">Contrasena</span>
						<input
							required
							type="password"
							minLength={8}
							value={form.password}
							onChange={(event) => update("password", event.target.value)}
							className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-500"
						/>
						{fieldErrors.password && (
							<p className="text-xs text-rose-700">{fieldErrors.password}</p>
						)}
					</label>

					<label className="block space-y-1">
						<span className="text-sm font-medium text-slate-700">Nombre (opcional)</span>
						<input
							value={form.name}
							onChange={(event) => update("name", event.target.value)}
							className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-500"
						/>
					</label>

					<label className="block space-y-1">
						<span className="text-sm font-medium text-slate-700">Telefono (opcional)</span>
						<input
							value={form.phone}
							onChange={(event) => update("phone", event.target.value)}
							className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-500"
						/>
					</label>

					<label className="block space-y-1">
						<span className="text-sm font-medium text-slate-700">Direccion (opcional)</span>
						<input
							value={form.address}
							onChange={(event) => update("address", event.target.value)}
							className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-500"
						/>
					</label>

					{error && <p className="text-sm text-rose-700">{error}</p>}

					<button
						type="submit"
						disabled={submitting}
						className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800 disabled:opacity-60"
					>
						{submitting ? "Creando cuenta..." : "Crear cuenta"}
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-slate-600">
					Ya tienes cuenta?{" "}
					<Link href="/login" className="font-medium text-teal-700 hover:text-teal-800">
						Inicia sesion
					</Link>
				</p>
			</div>
		</main>
	);
}
