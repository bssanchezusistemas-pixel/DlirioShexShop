"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import type { DbProduct } from "@/lib/types";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<DbProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data.product ?? null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-white/50">Cargando producto...</p>;
  }

  if (!product) {
    return <p className="text-red-400">Producto no encontrado</p>;
  }

  return (
    <div>
      <h1 className="mb-8 font-[family-name:var(--font-display)] text-3xl uppercase text-white">
        Editar producto
      </h1>
      <ProductForm product={product} />
    </div>
  );
}
