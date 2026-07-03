import { NextResponse } from "next/server";
import {
  friendlyProductDeleteError,
  resolveProductId,
} from "@/lib/admin-products";
import { adminError, parsePagination } from "@/lib/admin-api";
import {
  formatZodError,
  productInputSchema,
} from "@/lib/product-validation";
import { requireAdmin } from "@/lib/require-admin";
import { extractProductImagePath } from "@/lib/storage-utils";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { limit, offset } = parsePagination(new URL(request.url).searchParams);

  const { data, error } = await auth.supabase
    .from("products")
    .select(
      "id, name, price, stock, image_url, is_active, consult_only, category_id, created_at",
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return adminError("Error al cargar productos", 500, error);
  }

  return NextResponse.json({ products: data ?? [], limit, offset });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const name = new URL(request.url).searchParams.get("name")?.trim();
  if (!name) {
    return NextResponse.json(
      { error: "Se requiere el nombre del producto para eliminar registros sin ID." },
      { status: 400 },
    );
  }

  const { data: product } = await auth.supabase
    .from("products")
    .select("image_url")
    .eq("name", name)
    .eq("id", "")
    .maybeSingle();

  const { error, count } = await auth.supabase
    .from("products")
    .delete({ count: "exact" })
    .eq("name", name)
    .eq("id", "");

  if (error) {
    return NextResponse.json(
      { error: friendlyProductDeleteError(error.message, error.code) },
      { status: 400 },
    );
  }

  if (count === 0) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  const imagePath = extractProductImagePath(product?.image_url);
  if (imagePath) {
    await auth.supabase.storage.from("product-images").remove([imagePath]);
  }

  return NextResponse.json({ success: true });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = productInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }

  const data = parsed.data;

  const { data: category } = await auth.supabase
    .from("categories")
    .select("id")
    .eq("id", data.category_id)
    .maybeSingle();

  if (!category) {
    return NextResponse.json({ error: "Categoría no encontrada" }, { status: 400 });
  }

  const productId = resolveProductId(data.id, data.name);
  if (!productId) {
    return NextResponse.json(
      { error: "El nombre debe incluir al menos una letra o número." },
      { status: 400 },
    );
  }

  const { data: product, error } = await auth.supabase
    .from("products")
    .insert({
      id: productId,
      category_id: data.category_id,
      name: data.name,
      description: data.description ?? "",
      price: data.consult_only ? null : data.price,
      stock: data.stock ?? 0,
      image_url: data.image_url ?? null,
      badge: data.badge ?? null,
      consult_only: data.consult_only ?? false,
      sizes: data.sizes ?? [],
      is_active: data.is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    return adminError("Error al crear producto", 400, error);
  }

  return NextResponse.json({ product }, { status: 201 });
}
