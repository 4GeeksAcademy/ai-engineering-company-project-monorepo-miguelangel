"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { resetPassword } from "@/lib/auth-api";

export default function ResetPasswordForm({ token }: { token: string | null }) {
	const router = useRouter();

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");

		if (!token) {
			setError("El enlace es invalido, expiro o ya fue utilizado.");
			return;
		}

		if (password !== confirmPassword) {
			setError("Las contrasenas no coinciden.");
			return;
		}

		setSubmitting(true);
		try {
			await resetPassword(token, password);
			router.push("/login?reset=ok");
		} catch (resetError) {
			const message =
				resetError instanceof Error ? resetError.message : "No se pudo restablecer la contrasena";
			setError(message);
		} finally {
			setSubmitting(false);
		}
	}

	if (!token) {
		return (
			<div className="mt-6 space-y-4">
				<p className="text-sm text-rose-700">El enlace es invalido, expiro o ya fue utilizado.</p>
				<Link href="/forgot-password" className="text-sm font-medium text-teal-700 hover:text-teal-800">
					Solicitar un nuevo enlace
				</Link>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="mt-6 space-y-4">
			<label className="block space-y-1">
				<span className="text-sm font-medium text-slate-700">Nueva contrasena</span>
				<input
					required
					type="password"
					minLength={8}
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-500"
				/>
			</label>

			<label className="block space-y-1">
				<span className="text-sm font-medium text-slate-700">Confirmar contrasena</span>
				<input
					required
					type="password"
					minLength={8}
					value={confirmPassword}
					onChange={(event) => setConfirmPassword(event.target.value)}
					className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-500"
				/>
			</label>

			{error && (
				<div className="space-y-1">
					<p className="text-sm text-rose-700">{error}</p>
					<Link href="/forgot-password" className="text-sm font-medium text-teal-700 hover:text-teal-800">
						Solicitar un nuevo enlace
					</Link>
				</div>
			)}

			<button
				type="submit"
				disabled={submitting}
				className="w-full rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800 disabled:opacity-60"
			>
				{submitting ? "Guardando..." : "Restablecer contrasena"}
			</button>
		</form>
	);
}
