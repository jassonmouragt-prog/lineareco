import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { sessionCookieName } from "@/lib/admin/auth";

/** POST /admin/api/logout */

export async function POST(): Promise<NextResponse> {
  const store = await cookies();
  store.delete(sessionCookieName);

  return NextResponse.json({ ok: true });
}
