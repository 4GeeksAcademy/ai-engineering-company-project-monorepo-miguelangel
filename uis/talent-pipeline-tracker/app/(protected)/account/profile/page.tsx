"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { me, updateProfile, type MeRead } from "@/lib/auth-api";

export default function AccountProfilePage() {
	const [account, setAccount] = useState<MeRead | null>(null);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState("");

	const [form, setForm] = useState({ name: "", phone: "", address: "" });
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState("");
	const [saveSuccess, setSaveSuccess] = useState(false);

	useEffect(() => {
		me()
			.then((data) => {
				setAccount(data);
				setForm({
					name: data.profile.name ?? "",
					phone: data.profile.phone ?? "",
					address: data.profile.address ?? "",
				});
			})
			.catch((error) => {
				setLoadError(error instanceof Error ? error.message : "No se pudo cargar el perfil");
			})
			.finally(() => setLoading(false));
	}, []);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSaving(true);
		setSaveError("");
		setSaveSuccess(false);

		try {
			const updatedProfile = await updateProfile({
				name: form.name || undefined,
				phone: form.phone || undefined,
				address: form.address || undefined,
			});
			setAccount((current) => (current ? { ...current, profile: updatedProfile } : current));
			setSaveSuccess(true);
		} catch (error) {
			setSaveError(error instanceof Error ? error.message : "No se pudo guardar el perfil");
		} finally {
			setSaving(false);
		}
	}

	return (
		<main className="min-h-screen bg-slate-50 p-6 text-slate-800 md:p-10">
			<div className="mx-auto max-w-2xl space-y-6">
				<header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
					<Link href="/" className="text-sm font-medium text-teal-700 hover:text-teal-800">
						Volver al listado
					</Link>
					<h1 className="mt-3 text-2xl font-semibold">Mi cuenta</h1>
					<Link
						href="/account/change-password"
						className="mt-2 inline-block text-sm font-medium text-teal-700 hover:text-teal-800"
					>
						Cambiar contrasena
					</Link>
				</header>

				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
					{loading && <p className="text-sm text-slate-600">Cargando perfil...</p>}
					{!loading && loadError && <p className="text-sm text-rose-700">Error: {loadError}</p>}

					{!loading && account && (
						<>
							<div className="grid gap-1 text-sm">
								<p>
									<strong>Email:</strong> {account.email}
								</p>
								<p>
									<strong>Rol:</strong> {account.role}
								</p>
							</div>

							<form onSubmit={handleSubmit} className="mt-6 grid gap-3">
								<label className="block space-y-1">
									<span className="text-sm font-medium text-slate-700">Nombre</span>
									<input
										value={form.name}
										onChange={(event) =>
											setForm((current) => ({ ...current, name: event.target.value }))
										}
										className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-500"
									/>
								</label>

								<label className="block space-y-1">
									<span className="text-sm font-medium text-slate-700">Telefono</span>
									<input
										value={form.phone}
										onChange={(event) =>
											setForm((current) => ({ ...current, phone: event.target.value }))
										}
										className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-500"
									/>
								</label>

								<label className="block space-y-1">
									<span className="text-sm font-medium text-slate-700">Direccion</span>
									<input
										value={form.address}
										onChange={(event) =>
											setForm((current) => ({ ...current, address: event.target.value }))
										}
										className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-500"
									/>
								</label>

								{saveError && <p className="text-sm text-rose-700">{saveError}</p>}
								{saveSuccess && <p className="text-sm text-emerald-700">Perfil actualizado.</p>}

								<button
									type="submit"
									disabled={saving}
									className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800 disabled:opacity-60"
								>
									{saving ? "Guardando..." : "Guardar cambios"}
								</button>
							</form>
						</>
					)}
				</section>
			</div>
		</main>
	);
}
