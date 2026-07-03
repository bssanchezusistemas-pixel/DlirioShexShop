"use client";

import { useEffect, useState } from "react";
import { formatCOP } from "@/data/catalog";

interface CustomerRow {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data.customers ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase text-white">
          Clientes
        </h1>
        <p className="mt-1 text-sm text-white/50">
          {customers.length} clientes que han hecho pedido
        </p>
      </div>

      {loading ? (
        <p className="text-white/50">Cargando clientes...</p>
      ) : customers.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-cinema-gray px-5 py-12 text-center text-white/40">
          Aún no hay clientes registrados
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-cinema-gray">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.15em] text-white/40">
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Teléfono</th>
                <th className="px-5 py-3">Pedidos</th>
                <th className="px-5 py-3">Total gastado</th>
                <th className="px-5 py-3">Último pedido</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-white/5 text-white/70"
                >
                  <td className="px-5 py-4 font-medium text-white">
                    {customer.name}
                  </td>
                  <td className="px-5 py-4">{customer.phone}</td>
                  <td className="px-5 py-4">{customer.orderCount}</td>
                  <td className="px-5 py-4 text-neon">
                    {formatCOP(customer.totalSpent)}
                  </td>
                  <td className="px-5 py-4">
                    {customer.lastOrderAt
                      ? new Date(customer.lastOrderAt).toLocaleDateString(
                          "es-CO",
                        )
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
