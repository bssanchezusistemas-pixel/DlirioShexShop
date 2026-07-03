import { NextResponse } from "next/server";
import { adminError, parsePagination } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/require-admin";

const VALID_STATUSES = new Set(["pending", "confirmed", "completed", "cancelled"]);
const RESTORABLE_STATUSES = new Set(["pending", "confirmed"]);

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const { limit, offset } = parsePagination(searchParams);
  const status = searchParams.get("status");

  let query = auth.supabase
    .from("orders")
    .select("*, customers(*), order_items(*)")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq("status", status);
  }

  const { data: orders, error } = await query;

  if (error) {
    return adminError("Error al cargar pedidos", 500, error);
  }

  return NextResponse.json({ orders: orders ?? [], limit, offset });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { orderId, status } = await request.json();

  if (!orderId || typeof orderId !== "string") {
    return NextResponse.json({ error: "ID de pedido requerido" }, { status: 400 });
  }

  if (!VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: "Estado de pedido inválido" }, { status: 400 });
  }

  const { data: existing, error: fetchError } = await auth.supabase
    .from("orders")
    .select("id, status")
    .eq("id", orderId)
    .single();

  if (fetchError || !existing) {
    return adminError("Pedido no encontrado", 404, fetchError);
  }

  const shouldRestoreStock =
    status === "cancelled" &&
    RESTORABLE_STATUSES.has(existing.status);

  const { data, error } = await auth.supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("*, customers(*)")
    .single();

  if (error) {
    return adminError("Error al actualizar pedido", 400, error);
  }

  if (shouldRestoreStock) {
    const { error: restoreError } = await auth.supabase.rpc("restore_order_stock", {
      p_order_id: orderId,
    });
    if (restoreError) {
      console.error("[admin/orders] stock restore failed", restoreError);
    }
  }

  return NextResponse.json({ order: data });
}
