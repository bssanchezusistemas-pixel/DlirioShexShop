import { NextResponse } from "next/server";
import { adminError } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/require-admin";
import { getBogotaStartOfDayIso } from "@/lib/timezone";
import type { AdminStats, DbOrder, DbProduct } from "@/lib/types";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const now = new Date();
  const startOfDay = getBogotaStartOfDayIso();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalOrdersResult,
    ordersTodayResult,
    ordersWeekResult,
    ordersMonthResult,
    revenueResult,
    uniqueCustomersResult,
    lowStockResult,
    recentOrdersResult,
  ] = await Promise.all([
    auth.supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .neq("status", "cancelled"),
    auth.supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfDay)
      .neq("status", "cancelled"),
    auth.supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString())
      .neq("status", "cancelled"),
    auth.supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", monthAgo.toISOString())
      .neq("status", "cancelled"),
    auth.supabase
      .from("orders")
      .select("total_amount")
      .neq("status", "cancelled"),
    auth.supabase.from("customers").select("*", { count: "exact", head: true }),
    auth.supabase
      .from("products")
      .select("id, name, stock")
      .lte("stock", 3)
      .eq("is_active", true)
      .order("stock"),
    auth.supabase
      .from("orders")
      .select("*, customers(*)")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const errors = [
    totalOrdersResult.error,
    ordersTodayResult.error,
    ordersWeekResult.error,
    ordersMonthResult.error,
    revenueResult.error,
    uniqueCustomersResult.error,
    lowStockResult.error,
    recentOrdersResult.error,
  ].filter(Boolean);

  if (errors.length) {
    return adminError("Error al cargar estadísticas", 500, errors);
  }

  const totalRevenue = (
    (revenueResult.data ?? []) as { total_amount: number }[]
  ).reduce((sum, row) => sum + (row.total_amount ?? 0), 0);

  const stats: AdminStats = {
    totalOrders: totalOrdersResult.count ?? 0,
    ordersToday: ordersTodayResult.count ?? 0,
    ordersWeek: ordersWeekResult.count ?? 0,
    ordersMonth: ordersMonthResult.count ?? 0,
    totalRevenue,
    uniqueCustomers: uniqueCustomersResult.count ?? 0,
    lowStockProducts: (lowStockResult.data ?? []) as DbProduct[],
    recentOrders: (recentOrdersResult.data ?? []) as (DbOrder & {
      customers: { id: string; name: string; phone: string };
    })[],
  };

  return NextResponse.json(stats);
}
