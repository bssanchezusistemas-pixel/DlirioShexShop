import {
  CATALOG_CATEGORIES,
  type CatalogCategory,
  type CatalogCategoryId,
  type CatalogItem,
  type CatalogItemSize,
} from "@/data/catalog";
import type {
  DbCategory,
  DbProduct,
} from "@/lib/types";

const staticImageMap = new Map<string, string>();
for (const cat of CATALOG_CATEGORIES) {
  for (const item of cat.items) {
    if (item.image) {
      staticImageMap.set(item.id, item.image);
    }
  }
}

export function mapProductToCatalogItem(product: DbProduct): CatalogItem {
  const sizes = (product.sizes ?? []) as CatalogItemSize[];
  // If product has a local image in static catalog, prefer the local image over remote Supabase storage URLs
  let image = product.image_url ?? undefined;
  if (!image || image.includes("supabase.co")) {
    const localImg = staticImageMap.get(product.id);
    if (localImg) {
      image = localImg;
    }
  }

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price ?? undefined,
    stock: product.stock,
    image,
    badge: product.badge ?? undefined,
    consultOnly: product.consult_only,
    sizes: sizes.length > 0 ? sizes : undefined,
  };
}

export function buildCatalogFromDb(
  categories: DbCategory[],
  products: DbProduct[],
): CatalogCategory[] {
  return categories
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((category) => {
      const items = products
        .filter((p) => p.category_id === category.id && p.is_active)
        .map(mapProductToCatalogItem);

      return {
        id: category.id as CatalogCategoryId,
        label: category.label,
        tagline: category.tagline,
        accentColor: category.accent_color,
        items,
      };
    });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
