import { NextResponse } from "next/server";
import { adminError } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  if (error) {
    return adminError("Error al cargar categorías", 500, error);
  }

  return NextResponse.json({ categories: data });
}
