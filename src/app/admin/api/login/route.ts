import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  attemptLogin,
  attemptsLeft,
  sessionCookieMaxAge,
  sessionCookieName,
} from "@/lib/admin/auth";

/**
 * POST /admin/api/login
 *
 * Compara a senha com o hash scrypt e devolve um cookie de sessao assinado.
 * Como o repositorio e publico, nada disso pode estar no codigo: o hash vem de
 * ADMIN_PASSWORD_HASH e a assinatura de ADMIN_SESSION_SECRET.
 */

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "desconhecido";
}

export async function POST(request: Request): Promise<NextResponse> {
  let password = "";

  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ erro: "Requisicao invalida." }, { status: 400 });
  }

  const ip = clientIp(request);

  const token = await attemptLogin(password, ip);

  if (!token) {
    const left = attemptsLeft(ip);

    return NextResponse.json(
      {
        erro:
          left > 0
            ? "Senha incorreta."
            : "Muitas tentativas erradas. Espere 15 minutos e tente de novo.",
      },
      { status: 401 },
    );
  }

  const store = await cookies();
  store.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: sessionCookieMaxAge,
  });

  return NextResponse.json({ ok: true });
}
