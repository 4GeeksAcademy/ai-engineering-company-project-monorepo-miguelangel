const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

/**
 * Registro encadenado: POST /users seguido de POST /auth/login con las mismas
 * credenciales, tal como especifica AUTH-02. Se hace server-side en un único
 * viaje para que el cliente reciba directamente el token.
 */
export async function POST(request: Request): Promise<Response> {
  const payload = await request.json();

  const createUserResponse = await fetch(`${BACKEND_API_URL}/users`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!createUserResponse.ok) {
    const errorBody = await createUserResponse.text();
    return new Response(errorBody, {
      status: createUserResponse.status,
      headers: {
        "content-type": createUserResponse.headers.get("content-type") ?? "application/json; charset=utf-8",
      },
    });
  }

  const loginResponse = await fetch(`${BACKEND_API_URL}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: payload.email, password: payload.password }),
    cache: "no-store",
  });

  const loginBody = await loginResponse.text();

  return new Response(loginBody, {
    status: loginResponse.status,
    headers: {
      "content-type": loginResponse.headers.get("content-type") ?? "application/json; charset=utf-8",
    },
  });
}
