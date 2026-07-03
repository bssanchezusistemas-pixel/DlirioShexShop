"use client";

import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-8 font-[family-name:var(--font-display)] text-3xl uppercase text-white">
        Nuevo producto
      </h1>
      <ProductForm />
    </div>
  );
}
