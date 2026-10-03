/**
 * Protege tudo que esta sob /admin.
 *
 * No Next 16 o arquivo de borda se chama proxy.ts (middleware.ts e a forma
 * antiga). Ele roda antes de qualquer rota, entao nem chega a renderizar a tela
 * de login para quem nao tem sessao valida.
 */

import { NextResponse, type NextRequest } from "next/server";

import { sessionCookieName, verifySessionToken } from "@/lib/admin/auth";

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Estas duas rotas precisam ser publicas: e delas que sai o cookie de sessao.
  if (pathname === "/admin/login" || pathname === "/admin/api/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(sessionCookieName)?.value;

  if (verifySessionToken(token)) {
    return NextResponse.next();
  }

  // Chamadas de API recebem 401 em JSON. Um 307 aqui faria o fetch do navegador
  // seguir para a tela de login e receber HTML no lugar do JSON esperado.
  if (pathname.startsWith("/admin/api/")) {
    return NextResponse.json(
      { erro: "Sessão expirada. Entre de novo." },
      { status: 401 },
    );
  }

  const target = request.nextUrl.clone();
  target.pathname = "/admin/login";
  target.search = "";

  return NextResponse.redirect(target);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
