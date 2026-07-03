import { NextResponse } from "next/server";
import { friendlyProductDeleteError } from "@/lib/admin-products";
import { adminError } from "@/lib/admin-api";
import {
  formatZodError,
  productPatchSchema,
} from "@/lib/product-validation";
import { requireAdmin } from "@/lib/require-admin";
import { extractProductImagePath } from "@/lib/storage-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const { data, error } = await auth.supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return adminError("Producto no encontrado", 404, error);
  }

  return NextResponse.json({ product: data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const parsed = productPatchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }

  const data = parsed.data;

  if (data.category_id) {
    const { data: category } = await auth.supabase
      .from("categories")
      .select("id")
      .eq("id", data.category_id)
      .maybeSingle();

    if (!category) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 400 });
    }
  }

  const updates: Record<string, unknown> = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.category_id !== undefined) updates.category_id = data.category_id;
  if (data.description !== undefined) updates.description = data.description;
  if (data.consult_only !== undefined) updates.consult_only = data.consult_only;
  if (data.consult_only === true) {
    updates.price = null;
  } else if (data.price !== undefined) {
    updates.price = data.price;
  }
  if (data.sizes !== undefined) updates.sizes = data.sizes;
  if (data.is_active !== undefined) updates.is_active = data.is_active;

  const { data: product, error } = await auth.supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return adminError("Error al actualizar producto", 400, error);
  }

  return NextResponse.json({ product });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId).trim();

  if (!id) {
    return NextResponse.json(
      { error: "ID de producto inválido. Usa el nombre para eliminar productos sin ID." },
      { status: 400 },
    );
  }

  const { data: existing } = await auth.supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const { error, count } = await auth.supabase
    .from("products")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: friendlyProductDeleteError(error.message, error.code) },
      { status: 400 },
    );
  }

  if (count === 0) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  const imagePath = extractProductImagePath(existing?.image_url);
  if (imagePath) {
    await auth.supabase.storage.from("product-images").remove([imagePath]);
  }

  return NextResponse.json({ success: true });
}
