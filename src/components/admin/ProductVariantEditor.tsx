"use client";

import { useState } from "react";
import type { CatalogItemSize } from "@/lib/types";

export interface VariantRow {
  id: string;
  label: string;
  price: string;
  image: string;
}

export function sizesToVariantRows(sizes?: CatalogItemSize[]): VariantRow[] {
  if (!sizes?.length) return [];
  return sizes.map((size, index) => ({
    id: `variant-${index}-${size.label}`,
    label: size.label,
    price: String(size.price),
    image: size.image ?? "",
  }));
}

export function validateVariantRows(
  rows: VariantRow[],
): { ok: true; sizes: CatalogItemSize[] } | { ok: false; error: string } {
  const filled = rows.filter((row) => row.label.trim() || row.price.trim());

  for (const row of filled) {
    if (!row.label.trim()) {
      return { ok: false, error: "Cada variante debe tener un nombre." };
    }

    const priceText = row.price.trim();
    if (!priceText) {
      return {
        ok: false,
        error: `Indica el precio de "${row.label.trim()}".`,
      };
    }

    const price = Number(priceText);
    if (!Number.isFinite(price)) {
      return {
        ok: false,
        error: `El precio de "${row.label.trim()}" no es válido.`,
      };
    }

    if (!Number.isInteger(price)) {
      return {
        ok: false,
        error: `El precio de "${row.label.trim()}" debe ser un número entero (sin decimales).`,
      };
    }

    if (price < 0) {
      return {
        ok: false,
        error: `El precio de "${row.label.trim()}" no puede ser negativo.`,
      };
    }
  }

  return {
    ok: true,
    sizes: filled.map((row) => ({
      label: row.label.trim(),
      price: Number(row.price),
      ...(row.image.trim() ? { image: row.image.trim() } : {}),
    })),
  };
}

export function hasVariantRows(rows: VariantRow[]): boolean {
  return rows.some((row) => row.label.trim() || row.price.trim());
}

interface ProductVariantEditorProps {
  rows: VariantRow[];
  onChange: (rows: VariantRow[]) => void;
  productId?: string;
  onUploadError?: (message: string) => void;
}

export function ProductVariantEditor({
  rows,
  onChange,
  productId,
  onUploadError,
}: ProductVariantEditorProps) {
  const [uploadingRowId, setUploadingRowId] = useState<string | null>(null);

  const updateRow = (id: string, field: "label" | "price" | "image", value: string) => {
    onChange(
      rows.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]:
                field === "price" ? value.replace(/[^\d]/g, "") : value,
            }
          : row,
      ),
    );
  };

  const removeRow = (id: string) => {
    onChange(rows.filter((row) => row.id !== id));
  };

  const addRow = () => {
    onChange([
      ...rows,
      {
        id: `variant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        label: "",
        price: "",
        image: "",
      },
    ]);
  };

  const handleImageUpload = async (
    rowId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingRowId(rowId);
    onUploadError?.("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (productId) formData.append("productId", productId);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        onUploadError?.(data.error ?? "Error al subir imagen");
      } else {
        updateRow(rowId, "image", data.url);
      }
    } catch {
      onUploadError?.("Error al subir imagen. Intenta de nuevo.");
    } finally {
      setUploadingRowId(null);
      e.target.value = "";
    }
  };

  const clearImage = (rowId: string) => {
    updateRow(rowId, "image", "");
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-white/50">
          Variantes / presentaciones (opcional)
        </label>
        <p className="text-xs leading-relaxed text-white/45">
          Usa esto si el producto tiene varios sabores, tallas o presentaciones con precios
          distintos. Opcionalmente sube una imagen por variante para que cambie al seleccionar el
          sabor. Si solo tiene un precio, déjalo vacío.
        </p>
      </div>

      {rows.length > 0 && (
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.id}
              className="space-y-2 rounded-xl border border-white/10 bg-cinema-dark p-3"
            >
              <div className="grid gap-2 sm:grid-cols-[1fr_140px_auto]">
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-white/40">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => updateRow(row.id, "label", e.target.value)}
                    placeholder="Chocolate, 50 ml, Paquete x12..."
                    className="w-full rounded-lg border border-white/10 bg-cinema-gray px-3 py-2 text-sm text-white outline-none focus:border-neon"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-white/40">
                    Precio (COP)
                  </label>
                  <input
                    type="number"
                    value={row.price}
                    onChange={(e) => updateRow(row.id, "price", e.target.value)}
                    min={0}
                    step={1}
                    inputMode="numeric"
                    placeholder="22000"
                    className="w-full rounded-lg border border-white/10 bg-cinema-gray px-3 py-2 text-sm text-white outline-none focus:border-neon [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="rounded-lg border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.1em] text-white/50 transition hover:border-red-400/40 hover:text-red-300"
                    aria-label={`Quitar variante ${row.label || "sin nombre"}`}
                  >
                    Quitar
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-white/40">
                  Imagen (opcional)
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {row.image && (
                    <img
                      src={row.image}
                      alt={row.label ? `Vista previa ${row.label}` : "Vista previa variante"}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
                      onChange={(e) => handleImageUpload(row.id, e)}
                      disabled={uploadingRowId === row.id}
                      className="w-full text-sm text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:uppercase file:tracking-[0.1em] file:text-white/80 hover:file:bg-white/15"
                    />
                    {uploadingRowId === row.id && (
                      <p className="mt-1 text-xs text-white/40">Subiendo imagen...</p>
                    )}
                  </div>
                  {row.image && (
                    <button
                      type="button"
                      onClick={() => clearImage(row.id)}
                      disabled={uploadingRowId === row.id}
                      className="rounded-lg border border-white/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] text-white/50 transition hover:border-red-400/40 hover:text-red-300 disabled:opacity-40"
                    >
                      Quitar foto
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addRow}
        className="rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-[0.12em] text-white/70 transition hover:border-neon/50 hover:text-white"
      >
        Agregar variante
      </button>
    </div>
  );
}
