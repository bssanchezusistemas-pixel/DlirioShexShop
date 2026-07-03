"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCOP } from "@/data/catalog";
import type { AdminStats } from "@/lib/types";

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-cinema-gray p-5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
        {label}
      </p>
      <p
        className={`mt-2 font-[family-name:var(--font-display)] text-3xl ${accent ? "text-neon" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setStats(data);
      })
      .catch(() => setError("Error al cargar estadísticas"));
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
        {error}
        <p className="mt-2 text-sm text-white/50">
          Verifica que las migraciones de Supabase estén aplicadas y que
          SUPABASE_SERVICE_ROLE_KEY esté configurada.
        </p>
      </div>
    );
  }

  if (!stats) {
    return <p className="text-white/50">Cargando dashboard...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Resumen de pedidos y productos
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total pedidos" value={stats.totalOrders} accent />
        <StatCard label="Pedidos hoy" value={stats.ordersToday} />
        <StatCard label="Esta semana" value={stats.ordersWeek} />
        <StatCard label="Este mes" value={stats.ordersMonth} />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Ingresos referenciales"
          value={formatCOP(stats.totalRevenue)}
          accent
        />
        <StatCard label="Clientes únicos" value={stats.uniqueCustomers} />
      </div>

      {stats.lowStockProducts.length > 0 && (
        <div className="mb-8 rounded-2xl border border-neon/30 bg-neon/5 p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-neon">
            Stock bajo
          </h2>
          <ul className="space-y-2">
            {stats.lowStockProducts.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between text-sm text-white/70"
              >
                <span>{p.name}</span>
                <span className="text-neon">{p.stock} uds.</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-cinema-gray">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-white">
            Últimos pedidos
          </h2>
          <Link
            href="/admin/pedidos"
            className="text-[10px] uppercase tracking-[0.15em] text-neon hover:underline"
          >
            Ver todos →
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-white/40">
            Aún no hay pedidos registrados
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.15em] text-white/40">
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">Cliente</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/5 text-white/70"
                  >
                    <td className="px-5 py-3">
                      {new Date(order.created_at).toLocaleDateString("es-CO")}
                    </td>
                    <td className="px-5 py-3">
                      {order.customers?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-neon">
                      {formatCOP(order.total_amount)}
                    </td>
                    <td className="px-5 py-3 capitalize">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
