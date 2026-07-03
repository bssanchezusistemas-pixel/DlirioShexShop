import { NextResponse } from "next/server";
import { adminError, parsePagination } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { limit, offset } = parsePagination(new URL(request.url).searchParams);

  const { data: customers, error } = await auth.supabase
    .from("customers")
    .select("*, orders(id, total_amount, created_at, status)")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return adminError("Error al cargar clientes", 500, error);
  }

  const enriched = (customers ?? []).map((customer) => {
    const orders = customer.orders ?? [];
    const orderCount = orders.length;
    const totalSpent = orders
      .filter((o: { status: string }) => o.status !== "cancelled")
      .reduce((sum: number, o: { total_amount: number }) => sum + o.total_amount, 0);
    const lastOrder = orders.sort(
      (a: { created_at: string }, b: { created_at: string }) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )[0];

    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      created_at: customer.created_at,
      orderCount,
      totalSpent,
      lastOrderAt: lastOrder?.created_at ?? null,
    };
  });

  return NextResponse.json({ customers: enriched, limit, offset });
}
