export type CandidateStatus =
	| "selected"
	| "received"
	| "in_progress"
	| "discarded";

export type CandidateStage =
	| "offer_presented"
	| "review"
	| "personal_interview"
	| "pending"
	| "technical_interview";

export interface CandidateRecord {
	id: string;
	full_name: string;
	email: string;
	phone: string;
	position: string;
	linkedin_url: string;
	cv_url: string;
	experience_years: number;
	status: CandidateStatus;
	stage: CandidateStage;
	applied_at: string;
	updated_at?: string;
	english_level?: string;
	notes_count?: number;
}

export interface CandidateNote {
	id: string;
	record_id: string;
	content: string;
	created_at: string;
}

export interface RecordsListResponse {
	total: number;
	page: number;
	limit: number;
	data: CandidateRecord[];
}

export interface NotesResponse {
	data: CandidateNote[];
	meta: {
		total: number;
	};
}

export interface CandidateFilters {
	status?: CandidateStatus;
	stage?: CandidateStage;
}

export interface CandidatePayload {
	full_name: string;
	email: string;
	phone: string;
	position: string;
	linkedin_url: string;
	cv_url: string;
	experience_years: number;
	status: CandidateStatus;
	stage: CandidateStage;
	applied_at: string;
	english_level?: string;
}

export interface CandidatePatchPayload {
	status?: CandidateStatus;
	stage?: CandidateStage;
}

export interface AsyncUiState {
	status: "idle" | "loading" | "success" | "error";
	message?: string;
}

export const STATUS_OPTIONS: Array<{ value: CandidateStatus; label: string }> = [
	{ value: "in_progress", label: "Activo" },
	{ value: "discarded", label: "Descartado" },
	{ value: "selected", label: "Contratado" },
	{ value: "received", label: "Recibido" },
];

export const STAGE_OPTIONS: Array<{ value: CandidateStage; label: string }> = [
	{ value: "review", label: "Criba de CV" },
	{ value: "personal_interview", label: "Entrevista Inicial" },
	{ value: "technical_interview", label: "Prueba Tecnica" },
	{ value: "offer_presented", label: "Oferta" },
	{ value: "pending", label: "Pendiente" },
];

export function getStatusLabel(status: CandidateStatus): string {
	const found = STATUS_OPTIONS.find((option) => option.value === status);
	return found?.label ?? status;
}

export function getStageLabel(stage: CandidateStage): string {
	const found = STAGE_OPTIONS.find((option) => option.value === stage);
	return found?.label ?? stage;
}


