import type {
  AnalysisSummary,
  CreateSupplierPayload,
  Supplier,
  SupplierCountry,
  UpdateSupplierRatePayload,
  UpdateSupplierStatusPayload,
} from "./types";

const API_BASE_PATH = "/api/incidents";
const SUPPLIERS_API_BASE_PATH = "/api/suppliers";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function readErrorDetail(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.detail === "string") return body.detail;
  } catch {
    // el cuerpo no era JSON, seguimos con el mensaje genérico
  }
  return `Error inesperado (HTTP ${res.status}).`;
}

export async function analyzeIncidentsFile(file: File): Promise<AnalysisSummary> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_PATH}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new ApiError(res.status, await readErrorDetail(res));
  }

  return res.json();
}

/**
 * Descarga el CSV de resultados directamente desde el navegador,
 * disparando el diálogo nativo de "guardar como".
 */
export async function downloadResultsCsv(): Promise<void> {
  const res = await fetch(`${API_BASE_PATH}/results/export`);

  if (!res.ok) {
    throw new ApiError(res.status, await readErrorDetail(res));
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "results.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function listSuppliers(filters?: {
  country?: SupplierCountry;
  category?: string;
}): Promise<Supplier[]> {
  const params = new URLSearchParams();
  if (filters?.country) params.set("country", filters.country);
  if (filters?.category) params.set("category", filters.category);

  const query = params.toString();
  const url = query ? `${SUPPLIERS_API_BASE_PATH}?${query}` : SUPPLIERS_API_BASE_PATH;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorDetail(res));
  }

  return res.json();
}

export async function createSupplier(payload: CreateSupplierPayload): Promise<Supplier> {
  const res = await fetch(SUPPLIERS_API_BASE_PATH, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new ApiError(res.status, await readErrorDetail(res));
  }

  return res.json();
}

export async function updateSupplierRate(
  supplierId: number,
  payload: UpdateSupplierRatePayload
): Promise<Supplier> {
  const res = await fetch(`${SUPPLIERS_API_BASE_PATH}/${supplierId}/rate`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new ApiError(res.status, await readErrorDetail(res));
  }

  return res.json();
}

export async function updateSupplierStatus(
  supplierId: number,
  payload: UpdateSupplierStatusPayload
): Promise<Supplier> {
  const res = await fetch(`${SUPPLIERS_API_BASE_PATH}/${supplierId}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new ApiError(res.status, await readErrorDetail(res));
  }

  return res.json();
}
