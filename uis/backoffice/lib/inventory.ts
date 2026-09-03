import { clearToken, getToken } from "./auth-storage";
import type {
  Asset,
  AssetCreatePayload,
  AssetEntry,
  AssetEntryCreatePayload,
  AssetExit,
  AssetExitCreatePayload,
  Order,
} from "./inventory-types";

const API_BASE_PATH = "/api/inventory";

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function handleUnauthorized(res: Response): void {
  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
}

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

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_PATH}${path}`, {
    ...init,
    headers: {
      ...authHeaders(),
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    handleUnauthorized(res);
    throw new ApiError(res.status, await readErrorDetail(res));
  }

  return res.json();
}

export function listProducts(): Promise<Asset[]> {
  return requestJson<Asset[]>("/products");
}

export function getProduct(assetId: number): Promise<Asset> {
  return requestJson<Asset>(`/products/${assetId}`);
}

export function createProduct(payload: AssetCreatePayload): Promise<Asset> {
  return requestJson<Asset>("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createInboundOrder(payload: AssetEntryCreatePayload): Promise<AssetEntry> {
  return requestJson<AssetEntry>("/orders/inbound", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createOutboundOrder(payload: AssetExitCreatePayload): Promise<AssetExit> {
  return requestJson<AssetExit>("/orders/outbound", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listOrders(): Promise<Order[]> {
  return requestJson<Order[]>("/orders");
}
