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

type Params = {
  params: Promise<{ supplierId: string }>;
};

export async function GET(_request: Request, context: Params): Promise<Response> {
  const { supplierId } = await context.params;

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${BACKEND_API_URL}/suppliers/${supplierId}`, {
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

export async function DELETE(_request: Request, context: Params): Promise<Response> {
  const { supplierId } = await context.params;

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${BACKEND_API_URL}/suppliers/${supplierId}`, {
      method: "DELETE",
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
