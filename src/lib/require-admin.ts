import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { isAdminUser } from "@/lib/is-admin-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type AdminAuthResult =
  | { ok: true; supabase: ReturnType<typeof createAdminClient>; user: User }
  | { ok: false; response: NextResponse };

export { isAdminUser } from "@/lib/is-admin-user";

export async function requireAdmin(): Promise<AdminAuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "No autorizado" }, { status: 401 }),
    };
  }

  if (!isAdminUser(user)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Acceso denegado" }, { status: 403 }),
    };
  }

  return { ok: true, supabase: createAdminClient(), user };
}
