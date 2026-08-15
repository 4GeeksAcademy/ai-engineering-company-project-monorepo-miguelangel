const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

function upstreamUnavailableResponse(): Response {
  return Response.json(
    {
      detail:
        "No se pudo conectar con la API de proveedores. Verifica que FastAPI esté activo en BACKEND_API_URL.",
    },
    { status: 502 }
  );
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const query = url.searchParams.toString();
  const endpoint = query
    ? `${BACKEND_API_URL}/suppliers?${query}`
    : `${BACKEND_API_URL}/suppliers`;

  let backendResponse: Response;
  try {
    backendResponse = await fetch(endpoint, { cache: "no-store" });
  } catch {
    return upstreamUnavailableResponse();
  }
  const body = await backendResponse.text();

  return new Response(body, {
    status: backendResponse.status,
    headers: {
      "content-type":
        backendResponse.headers.get("content-type") ?? "application/json; charset=utf-8",
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  const bodyJson = await request.text();

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${BACKEND_API_URL}/suppliers`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: bodyJson,
      cache: "no-store",
    });
  } catch {
    return upstreamUnavailableResponse();
  }

  const body = await backendResponse.text();

  return new Response(body, {
    status: backendResponse.status,
    headers: {
      "content-type":
        backendResponse.headers.get("content-type") ?? "application/json; charset=utf-8",
    },
  });
}
