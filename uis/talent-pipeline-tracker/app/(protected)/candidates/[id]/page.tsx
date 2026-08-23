"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
	createRecordNote,
	deleteRecordNote,
	getRecordById,
	getRecordNotes,
	patchRecord,
	updateRecord,
} from "@/lib/api";
import {
	getStageLabel,
	getStatusLabel,
	STAGE_OPTIONS,
	STATUS_OPTIONS,
	type AsyncUiState,
	type CandidateNote,
	type CandidatePayload,
	type CandidateRecord,
	type CandidateStage,
	type CandidateStatus,
} from "@/types";

function formatDate(value: string): string {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("es-ES");
}

export default function CandidateDetailPage() {
	const params = useParams();
	const recordId = useMemo(() => {
		const value = params.id;
		return Array.isArray(value) ? value[0] : value;
	}, [params.id]);

	const [candidate, setCandidate] = useState<CandidateRecord | null>(null);
	const [notes, setNotes] = useState<CandidateNote[]>([]);

	const [loadingCandidate, setLoadingCandidate] = useState(true);
	const [candidateError, setCandidateError] = useState("");
	const [loadingNotes, setLoadingNotes] = useState(true);
	const [notesError, setNotesError] = useState("");

	const [statusDraft, setStatusDraft] = useState<CandidateStatus>("in_progress");
	const [stageDraft, setStageDraft] = useState<CandidateStage>("review");
	const [updateState, setUpdateState] = useState<AsyncUiState>({ status: "idle" });

	const [editForm, setEditForm] = useState<CandidatePayload | null>(null);
	const [saveState, setSaveState] = useState<AsyncUiState>({ status: "idle" });

	const [newNote, setNewNote] = useState("");
	const [createNoteState, setCreateNoteState] = useState<AsyncUiState>({
		status: "idle",
	});
	const [deleteNoteState, setDeleteNoteState] = useState<AsyncUiState>({
		status: "idle",
	});

	useEffect(() => {
		if (!recordId) {
			setCandidateError("No se encontro el ID de la candidatura");
			setLoadingCandidate(false);
			setLoadingNotes(false);
			return;
		}

		const currentRecordId = recordId;

		async function loadDetail() {
			setLoadingCandidate(true);
			setCandidateError("");
			setLoadingNotes(true);
			setNotesError("");

			try {
				const [recordResponse, notesResponse] = await Promise.all([
					getRecordById(currentRecordId),
					getRecordNotes(currentRecordId),
				]);

				setCandidate(recordResponse);
				setNotes(notesResponse);
				setStatusDraft(recordResponse.status);
				setStageDraft(recordResponse.stage);
				setEditForm({
					full_name: recordResponse.full_name,
					email: recordResponse.email,
					phone: recordResponse.phone,
					position: recordResponse.position,
					linkedin_url: recordResponse.linkedin_url,
					cv_url: recordResponse.cv_url,
					experience_years: recordResponse.experience_years,
					status: recordResponse.status,
					stage: recordResponse.stage,
					applied_at: recordResponse.applied_at.slice(0, 10),
					english_level: recordResponse.english_level ?? "",
				});
			} catch (loadError) {
				const message =
					loadError instanceof Error
						? loadError.message
						: "No se pudo cargar la candidatura";
				setCandidateError(message);
				setNotesError(message);
			} finally {
				setLoadingCandidate(false);
				setLoadingNotes(false);
			}
		}

		loadDetail();
	}, [recordId]);

	async function handlePatchStatusOrStage() {
		if (!recordId) {
			return;
		}

		setUpdateState({ status: "loading", message: "Actualizando candidatura..." });

		try {
			const updated = await patchRecord(recordId, {
				status: statusDraft,
				stage: stageDraft,
			});

			setCandidate(updated);
			setEditForm((current) =>
				current
					? {
							...current,
							status: updated.status,
							stage: updated.stage,
						}
					: current,
			);
			setUpdateState({
				status: "success",
				message: "Estado y etapa actualizados con exito",
			});
		} catch (updateError) {
			const message =
				updateError instanceof Error
					? updateError.message
					: "No se pudo actualizar el estado/etapa";
			setUpdateState({ status: "error", message });
		}
	}

	async function handleSaveCandidate(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!recordId || !editForm) {
			return;
		}

		setSaveState({ status: "loading", message: "Guardando cambios..." });

		try {
			const updated = await updateRecord(recordId, {
				...editForm,
				experience_years: Number(editForm.experience_years),
				applied_at: new Date(editForm.applied_at).toISOString(),
			});

			setCandidate(updated);
			setStatusDraft(updated.status);
			setStageDraft(updated.stage);
			setSaveState({ status: "success", message: "Candidatura actualizada con exito" });
		} catch (saveError) {
			const message =
				saveError instanceof Error
					? saveError.message
					: "No se pudo actualizar la candidatura";
			setSaveState({ status: "error", message });
		}
	}

	async function handleCreateNote(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!recordId || !newNote.trim()) {
			return;
		}

		setCreateNoteState({ status: "loading", message: "Guardando nota..." });

		try {
			const created = await createRecordNote(recordId, newNote.trim());
			setNotes((current) => [created, ...current]);
			setNewNote("");
			setCreateNoteState({ status: "success", message: "Nota creada con exito" });
		} catch (createError) {
			const message =
				createError instanceof Error ? createError.message : "No se pudo crear la nota";
			setCreateNoteState({ status: "error", message });
		}
	}

	async function handleDeleteNote(noteId: string) {
		if (!recordId) {
			return;
		}

		setDeleteNoteState({ status: "loading", message: "Eliminando nota..." });

		try {
			await deleteRecordNote(recordId, noteId);
			setNotes((current) => current.filter((note) => note.id !== noteId));
			setDeleteNoteState({ status: "success", message: "Nota eliminada con exito" });
		} catch (deleteError) {
			const message =
				deleteError instanceof Error
					? deleteError.message
					: "No se pudo eliminar la nota";
			setDeleteNoteState({ status: "error", message });
		}
	}

	return (
		<main className="min-h-screen bg-slate-50 p-6 text-slate-800 md:p-10">
			<div className="mx-auto max-w-5xl space-y-6">
				<header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
					<Link href="/" className="text-sm font-medium text-teal-700 hover:text-teal-800">
						Volver al listado
					</Link>
					<h1 className="mt-3 text-2xl font-semibold">Detalle de candidatura</h1>
					<p className="mt-1 text-sm text-slate-600">
						Nexova Solutions · Operaciones de Seleccion
					</p>
				</header>

				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
					{loadingCandidate && <p className="text-sm text-slate-600">Cargando candidatura...</p>}

					{!loadingCandidate && candidateError && (
						<p className="text-sm text-rose-700">Error: {candidateError}</p>
					)}

					{!loadingCandidate && !candidateError && candidate && (
						<div className="grid gap-3 text-sm md:grid-cols-2">
							<p>
								<strong>ID:</strong> {candidate.id}
							</p>
							<p>
								<strong>Nombre completo:</strong> {candidate.full_name}
							</p>
							<p>
								<strong>Email:</strong> {candidate.email}
							</p>
							<p>
								<strong>Telefono:</strong> {candidate.phone}
							</p>
							<p>
								<strong>Puesto:</strong> {candidate.position}
							</p>
							<p>
								<strong>LinkedIn:</strong> {candidate.linkedin_url}
							</p>
							<p>
								<strong>URL CV:</strong> {candidate.cv_url}
							</p>
							<p>
								<strong>Anios de experiencia:</strong> {candidate.experience_years}
							</p>
							<p>
								<strong>Estado:</strong> {getStatusLabel(candidate.status)}
							</p>
							<p>
								<strong>Etapa:</strong> {getStageLabel(candidate.stage)}
							</p>
							<p>
								<strong>Fecha de aplicacion:</strong> {formatDate(candidate.applied_at)}
							</p>
							<p>
								<strong>Nivel de Ingles:</strong> {candidate.english_level ?? "No informado"}
							</p>
						</div>
					)}
				</section>

				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
					<h2 className="text-lg font-semibold">Actualizar estado y etapa</h2>
					<div className="mt-4 grid gap-3 md:grid-cols-3">
						<select
							value={statusDraft}
							onChange={(event) => setStatusDraft(event.target.value as CandidateStatus)}
							className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
						>
							{STATUS_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>

						<select
							value={stageDraft}
							onChange={(event) => setStageDraft(event.target.value as CandidateStage)}
							className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
						>
							{STAGE_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>

						<button
							type="button"
							onClick={handlePatchStatusOrStage}
							className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white"
						>
							Guardar estado/etapa
						</button>
					</div>

					{updateState.status === "loading" && (
						<p className="mt-3 text-sm text-slate-600">Cargando: actualizando estado y etapa...</p>
					)}
					{updateState.status === "success" && (
						<p className="mt-3 text-sm text-emerald-700">Exito: {updateState.message}</p>
					)}
					{updateState.status === "error" && (
						<p className="mt-3 text-sm text-rose-700">Error: {updateState.message}</p>
					)}
				</section>

				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
					<h2 className="text-lg font-semibold">Editar candidatura (PUT)</h2>

					{editForm && (
						<form onSubmit={handleSaveCandidate} className="mt-4 grid gap-3 md:grid-cols-2">
							<input
								required
								value={editForm.full_name}
								onChange={(event) =>
									setEditForm((current) =>
										current ? { ...current, full_name: event.target.value } : current,
									)
								}
								placeholder="Nombre completo"
								className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
							/>
							<input
								required
								type="email"
								value={editForm.email}
								onChange={(event) =>
									setEditForm((current) =>
										current ? { ...current, email: event.target.value } : current,
									)
								}
								placeholder="Email"
								className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
							/>
							<input
								required
								value={editForm.phone}
								onChange={(event) =>
									setEditForm((current) =>
										current ? { ...current, phone: event.target.value } : current,
									)
								}
								placeholder="Telefono"
								className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
							/>
							<input
								required
								value={editForm.position}
								onChange={(event) =>
									setEditForm((current) =>
										current ? { ...current, position: event.target.value } : current,
									)
								}
								placeholder="Puesto"
								className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
							/>
							<input
								required
								value={editForm.linkedin_url}
								onChange={(event) =>
									setEditForm((current) =>
										current ? { ...current, linkedin_url: event.target.value } : current,
									)
								}
								placeholder="LinkedIn URL"
								className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
							/>
							<input
								required
								value={editForm.cv_url}
								onChange={(event) =>
									setEditForm((current) =>
										current ? { ...current, cv_url: event.target.value } : current,
									)
								}
								placeholder="URL del CV"
								className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
							/>
							<input
								required
								type="number"
								min={0}
								step={1}
								value={editForm.experience_years}
								onChange={(event) =>
									setEditForm((current) =>
										current
											? { ...current, experience_years: Number(event.target.value) }
											: current,
									)
								}
								placeholder="Anios de experiencia"
								className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
							/>
							<input
								required
								type="date"
								value={editForm.applied_at}
								onChange={(event) =>
									setEditForm((current) =>
										current ? { ...current, applied_at: event.target.value } : current,
									)
								}
								className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
							/>
							<input
								value={editForm.english_level ?? ""}
								onChange={(event) =>
									setEditForm((current) =>
										current ? { ...current, english_level: event.target.value } : current,
									)
								}
								placeholder="Nivel de Ingles (ej. C1)"
								className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
							/>

							<button
								type="submit"
								className="md:col-span-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
							>
								Guardar cambios del candidato
							</button>
						</form>
					)}

					{saveState.status === "loading" && (
						<p className="mt-3 text-sm text-slate-600">Cargando: guardando cambios...</p>
					)}
					{saveState.status === "success" && (
						<p className="mt-3 text-sm text-emerald-700">Exito: {saveState.message}</p>
					)}
					{saveState.status === "error" && (
						<p className="mt-3 text-sm text-rose-700">Error: {saveState.message}</p>
					)}
				</section>

				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
					<h2 className="text-lg font-semibold">Notas</h2>

					<form onSubmit={handleCreateNote} className="mt-4 flex flex-col gap-3">
						<textarea
							value={newNote}
							onChange={(event) => setNewNote(event.target.value)}
							placeholder="Escribe una nota interna sobre este candidato"
							rows={3}
							className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
						/>
						<button
							type="submit"
							className="w-full rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white md:w-auto"
						>
							Anadir nota
						</button>
					</form>

					{createNoteState.status === "loading" && (
						<p className="mt-3 text-sm text-slate-600">Cargando: creando nota...</p>
					)}
					{createNoteState.status === "success" && (
						<p className="mt-3 text-sm text-emerald-700">Exito: {createNoteState.message}</p>
					)}
					{createNoteState.status === "error" && (
						<p className="mt-3 text-sm text-rose-700">Error: {createNoteState.message}</p>
					)}

					{deleteNoteState.status === "loading" && (
						<p className="mt-3 text-sm text-slate-600">Cargando: eliminando nota...</p>
					)}
					{deleteNoteState.status === "success" && (
						<p className="mt-3 text-sm text-emerald-700">Exito: {deleteNoteState.message}</p>
					)}
					{deleteNoteState.status === "error" && (
						<p className="mt-3 text-sm text-rose-700">Error: {deleteNoteState.message}</p>
					)}

					{loadingNotes && <p className="mt-4 text-sm text-slate-600">Cargando notas...</p>}
					{!loadingNotes && notesError && (
						<p className="mt-4 text-sm text-rose-700">Error: {notesError}</p>
					)}

					{!loadingNotes && !notesError && (
						<ul className="mt-4 space-y-3">
							{notes.map((note) => (
								<li key={note.id} className="rounded-lg border border-slate-200 p-4 text-sm">
									<p>{note.content}</p>
									<div className="mt-2 flex items-center justify-between text-xs text-slate-500">
										<span>{formatDate(note.created_at)}</span>
										<button
											type="button"
											onClick={() => handleDeleteNote(note.id)}
											className="font-medium text-rose-700"
										>
											Eliminar
										</button>
									</div>
								</li>
							))}

							{notes.length === 0 && (
								<li className="text-sm text-slate-600">No hay notas registradas todavia.</li>
							)}
						</ul>
					)}
				</section>
			</div>
		</main>
	);
}

