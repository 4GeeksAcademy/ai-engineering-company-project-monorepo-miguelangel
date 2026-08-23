import { clearToken, getToken, setToken } from "./auth-storage";

export type Role = "admin" | "manager" | "user";

export interface ProfileRead {
	id: string;
	user_id: string;
	name: string | null;
	phone: string | null;
	address: string | null;
}

export interface MeRead {
	email: string;
	role: Role;
	profile: ProfileRead;
}

export interface RegisterPayload {
	email: string;
	password: string;
	name?: string;
	phone?: string;
	address?: string;
}

export interface ProfileUpdatePayload {
	name?: string;
	phone?: string;
	address?: string;
}

export class AuthApiError extends Error {
	status: number;
	fieldErrors?: Record<string, string>;

	constructor(status: number, message: string, fieldErrors?: Record<string, string>) {
		super(message);
		this.status = status;
		this.fieldErrors = fieldErrors;
	}
}

function getAuthApiBaseUrl(): string {
	const baseUrl = process.env.NEXT_PUBLIC_AUTH_API_URL;
	if (!baseUrl) {
		throw new Error("Falta configurar NEXT_PUBLIC_AUTH_API_URL en .env.local");
	}
	return baseUrl;
}

async function parseErrorDetail(res: Response): Promise<{ message: string; fieldErrors?: Record<string, string> }> {
	let body: unknown;
	try {
		body = await res.json();
	} catch {
		return { message: `Error inesperado (HTTP ${res.status}).` };
	}

	const detail = (body as { detail?: unknown })?.detail;

	if (typeof detail === "string") {
		return { message: detail };
	}

	if (Array.isArray(detail)) {
		const fieldErrors: Record<string, string> = {};
		for (const issue of detail) {
			const loc = Array.isArray(issue?.loc) ? issue.loc : [];
			const field = loc[loc.length - 1];
			if (typeof field === "string" && typeof issue?.msg === "string") {
				fieldErrors[field] = issue.msg;
			}
		}
		return { message: "Revisa los campos del formulario.", fieldErrors };
	}

	return { message: `Error inesperado (HTTP ${res.status}).` };
}

/** Llamada de auth pública (login/registro): sin token, sin redirect automático en 401/400. */
async function publicAuthRequest<T>(path: string, body: unknown): Promise<T> {
	const res = await fetch(`${getAuthApiBaseUrl()}${path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const { message, fieldErrors } = await parseErrorDetail(res);
		throw new AuthApiError(res.status, message, fieldErrors);
	}

	return res.json();
}

/** Llamada de auth protegida: adjunta el token y limpia sesión + redirige a /login en 401. */
async function protectedAuthRequest<T>(path: string, options?: RequestInit): Promise<T> {
	const token = getToken();
	const res = await fetch(`${getAuthApiBaseUrl()}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...(options?.headers ?? {}),
		},
	});

	if (res.status === 401) {
		clearToken();
		if (typeof window !== "undefined") {
			window.location.href = "/login";
		}
		throw new AuthApiError(401, "Sesion expirada.");
	}

	if (!res.ok) {
		const { message, fieldErrors } = await parseErrorDetail(res);
		throw new AuthApiError(res.status, message, fieldErrors);
	}

	return res.json();
}

export async function login(email: string, password: string): Promise<string> {
	const token = await publicAuthRequest<{ access_token: string; token_type: string }>(
		"/auth/login",
		{ email, password },
	);
	setToken(token.access_token);
	return token.access_token;
}

export async function register(payload: RegisterPayload): Promise<string> {
	await publicAuthRequest("/users", payload);
	return login(payload.email, payload.password);
}

export async function me(): Promise<MeRead> {
	return protectedAuthRequest<MeRead>("/auth/me");
}

export async function updateProfile(payload: ProfileUpdatePayload): Promise<ProfileRead> {
	return protectedAuthRequest<ProfileRead>("/profiles/me", {
		method: "PUT",
		body: JSON.stringify(payload),
	});
}
