import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { buildCatalogFromDb } from "@/lib/catalog-mapper";
import {
  CATALOG_CATEGORIES,
  type CatalogCategory,
} from "@/data/catalog";
import type { DbCategory, DbProduct } from "@/lib/types";

function createAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

function fallbackCatalog(): CatalogCategory[] {
  return CATALOG_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.map((item) => ({ ...item, stock: 10 })),
  }));
}

export async function GET() {
  try {
    const supabase = createAnonClient();

    const [{ data: categories, error: catError }, { data: products, error: prodError }] =
      await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase.from("products").select("*").eq("is_active", true),
      ]);

    if (catError || prodError || !categories?.length) {
      return NextResponse.json(
        { categories: fallbackCatalog(), source: "fallback" },
        { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } },
      );
    }

    const catalog = buildCatalogFromDb(
      categories as DbCategory[],
      (products ?? []) as DbProduct[],
    );

    return NextResponse.json(
      { categories: catalog, source: "database" },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } },
    );
  } catch {
    return NextResponse.json(
      { categories: fallbackCatalog(), source: "fallback" },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } },
    );
  }
}
