"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/catalog-mapper";
import type { DbCategory, DbProduct } from "@/lib/types";
import {
  hasVariantRows,
  ProductVariantEditor,
  sizesToVariantRows,
  validateVariantRows,
  type VariantRow,
} from "@/components/admin/ProductVariantEditor";

interface ProductFormProps {
  product?: DbProduct;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "10");
  const [badge, setBadge] = useState(product?.badge ?? "");
  const [consultOnly, setConsultOnly] = useState(product?.consult_only ?? false);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [variantRows, setVariantRows] = useState<VariantRow[]>(() =>
    sizesToVariantRows(product?.sizes),
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories ?? []);
        if (!categoryId && data.categories?.[0]) {
          setCategoryId(data.categories[0].id);
        }
      });
  }, [categoryId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const productId = isEdit ? product!.id : slugify(name);
      if (productId) formData.append("productId", productId);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al subir imagen");
      } else {
        setImageUrl(data.url);
      }
    } catch {
      setError("Error al subir imagen. Intenta de nuevo.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const variantValidation = validateVariantRows(variantRows);
    if (!variantValidation.ok) {
      setError(variantValidation.error);
      setSaving(false);
      return;
    }
    const sizes = variantValidation.sizes;

    if (!categoryId) {
      setError("Selecciona una categoría antes de guardar.");
      setSaving(false);
      return;
    }

    const productId = isEdit ? product!.id : slugify(name);
    if (!isEdit && !productId) {
      setError("El nombre debe incluir al menos una letra o número.");
      setSaving(false);
      return;
    }
    const payload = {
      id: productId,
      category_id: categoryId,
      name,
      description,
      price: consultOnly ? null : Number(price) || 0,
      stock: Number(stock) || 0,
      badge: badge || null,
      consult_only: consultOnly,
      is_active: isActive,
      image_url: imageUrl || null,
      sizes,
    };

    const url = isEdit
      ? `/api/admin/products/${product!.id}`
      : "/api/admin/products";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al guardar");
        setSaving(false);
        return;
      }

      router.push("/admin/productos");
      router.refresh();
    } catch {
      setError("Error al guardar. Intenta de nuevo.");
      setSaving(false);
    }
  };

  const variantsActive = hasVariantRows(variantRows);
  const priceDisabled = consultOnly || variantsActive;
  const productId = isEdit ? product!.id : slugify(name);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6 rounded-2xl border border-white/10 bg-cinema-gray p-6"
    >
      <div>
        <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-white/50">
          Nombre
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl border border-white/10 bg-cinema-dark px-4 py-3 text-sm text-white outline-none focus:border-neon"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-white/50">
          Categoría
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full rounded-xl border border-white/10 bg-cinema-dark px-4 py-3 text-sm text-white outline-none focus:border-neon"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-white/50">
          Descripción
        </label>
        <p className="mb-1.5 text-xs text-white/40">
          Explica para qué sirve el producto
        </p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explica para qué sirve el producto"
          rows={4}
          required
          className="w-full rounded-xl border border-white/10 bg-cinema-dark px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-neon"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-white/50">
            Precio (COP)
            {variantsActive && !consultOnly && (
              <span className="ml-2 normal-case tracking-normal text-white/35">
                (opcional con variantes)
              </span>
            )}
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={priceDisabled}
            required={!consultOnly && !variantsActive}
            min={0}
            step={1}
            className="w-full rounded-xl border border-white/10 bg-cinema-dark px-4 py-3 text-sm text-white outline-none focus:border-neon disabled:opacity-40"
          />
          {variantsActive && !consultOnly && (
            <p className="mt-1.5 text-xs text-white/40">
              El precio de cada presentación se define en las variantes de abajo.
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-white/50">
            Unidades disponibles
          </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            min={0}
            className="w-full rounded-xl border border-white/10 bg-cinema-dark px-4 py-3 text-sm text-white outline-none focus:border-neon"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-white/50">
          Badge (opcional)
        </label>
        <input
          value={badge}
          onChange={(e) => setBadge(e.target.value)}
          placeholder="Popular, Promo, Top..."
          className="w-full rounded-xl border border-white/10 bg-cinema-dark px-4 py-3 text-sm text-white outline-none focus:border-neon"
        />
      </div>

      <ProductVariantEditor
        rows={variantRows}
        onChange={setVariantRows}
        productId={productId || undefined}
        onUploadError={setError}
      />

      <div>
        <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-white/50">
          Imagen del producto
        </label>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Vista previa"
            className="mb-3 h-32 w-32 rounded-xl object-cover"
          />
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          onChange={handleImageUpload}
          disabled={uploading}
          className="text-sm text-white/60"
        />
        {uploading && (
          <p className="mt-1 text-xs text-white/40">Subiendo imagen...</p>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={consultOnly}
            onChange={(e) => setConsultOnly(e.target.checked)}
            className="accent-[#ff2d95]"
          />
          Solo consulta (sin precio fijo)
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="accent-[#ff2d95]"
          />
          Producto activo en catálogo
        </label>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-neon px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white neon-border disabled:opacity-50"
        >
          {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear producto"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-white/15 px-8 py-3 text-xs uppercase tracking-[0.15em] text-white/60"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
