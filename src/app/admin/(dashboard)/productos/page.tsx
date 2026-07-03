"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCOP } from "@/data/catalog";
import type { DbProduct } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteError, setDeleteError] = useState("");

  const loadProducts = () => {
    setLoading(true);
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;

    setDeleteError("");

    const url = id.trim()
      ? `/api/admin/products/${encodeURIComponent(id)}`
      : `/api/admin/products?name=${encodeURIComponent(name)}`;

    try {
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error ?? "No se pudo eliminar el producto.");
        return;
      }

      loadProducts();
    } catch {
      setDeleteError("Error de conexión al eliminar el producto.");
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase text-white">
            Productos
          </h1>
          <p className="mt-1 text-sm text-white/50">
            {products.length} productos en catálogo
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center justify-center rounded-full bg-neon px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white neon-border"
        >
          + Nuevo producto
        </Link>
      </div>

      <input
        type="search"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full max-w-md rounded-xl border border-white/10 bg-cinema-gray px-4 py-2.5 text-sm text-white outline-none focus:border-neon"
      />

      {deleteError && (
        <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {deleteError}
        </p>
      )}

      {loading ? (
        <p className="text-white/50">Cargando productos...</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-cinema-gray">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.15em] text-white/40">
                <th className="px-5 py-3">Producto</th>
                <th className="px-5 py-3">Precio</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-white/5 text-white/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cinema-dark text-neon/40">
                          ✦
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-xs text-white/40">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {product.consult_only
                      ? "Consultar"
                      : formatCOP(product.price ?? 0)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        product.stock <= 3 ? "text-neon" : "text-white/70"
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${
                        product.is_active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      {product.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/productos/${product.id}`}
                        className="rounded-lg border border-white/15 px-3 py-1 text-[10px] uppercase tracking-wider text-white/70 hover:border-neon hover:text-neon"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id, product.name)}
                        className="rounded-lg border border-red-500/30 px-3 py-1 text-[10px] uppercase tracking-wider text-red-400 hover:bg-red-500/10"
                      >
                        Eliminar
                      </button>
                    </div>
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
