"use client";

import { useEffect, useState } from "react";
import { formatCOP } from "@/data/catalog";
import type { DbCustomer, DbOrder, DbOrderItem, OrderStatus } from "@/lib/types";

type OrderWithRelations = DbOrder & {
  customers: DbCustomer;
  order_items: DbOrderItem[];
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  completed: "Completado",
  cancelled: "Cancelado",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    loadOrders();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase text-white">
          Pedidos
        </h1>
        <p className="mt-1 text-sm text-white/50">
          {orders.length} pedidos registrados desde la web
        </p>
      </div>

      {loading ? (
        <p className="text-white/50">Cargando pedidos...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-cinema-gray px-5 py-12 text-center text-white/40">
          Aún no hay pedidos. Los pedidos se registran cuando un cliente
          completa el checkout antes de WhatsApp.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-white/10 bg-cinema-gray p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                    {new Date(order.created_at).toLocaleString("es-CO")}
                  </p>
                  <h3 className="mt-1 font-medium text-white">
                    {order.customers?.name}
                  </h3>
                  <p className="text-sm text-white/50">
                    📱 {order.customers?.phone}
                  </p>
                  <p className="mt-1 text-sm text-white/50">
                    {order.delivery_type === "delivery"
                      ? `🚚 Domicilio: ${order.delivery_address}`
                      : "🏪 Recoger en tienda"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-[family-name:var(--font-display)] text-xl text-neon">
                    {formatCOP(order.total_amount)}
                  </p>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value as OrderStatus)
                    }
                    className="mt-2 rounded-lg border border-white/15 bg-cinema-dark px-3 py-1.5 text-xs text-white outline-none"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {order.order_items?.length > 0 && (
                <ul className="mt-4 space-y-1 border-t border-white/5 pt-4 text-sm text-white/60">
                  {order.order_items.map((item) => (
                    <li key={item.id}>
                      {item.quantity}x {item.product_name}
                      {item.size_label ? ` (${item.size_label})` : ""} —{" "}
                      {formatCOP(item.unit_price * item.quantity)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
