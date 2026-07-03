import type {
  CatalogCategory,
  CatalogCategoryId,
  CatalogItem,
  CatalogItemSize,
  DbCategory,
  DbProduct,
} from "@/lib/types";

export function mapProductToCatalogItem(product: DbProduct): CatalogItem {
  const sizes = (product.sizes ?? []) as CatalogItemSize[];
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price ?? undefined,
    stock: product.stock,
    image: product.image_url ?? undefined,
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
    .map((category) => ({
      id: category.id as CatalogCategoryId,
      label: category.label,
      tagline: category.tagline,
      accentColor: category.accent_color,
      items: products
        .filter((p) => p.category_id === category.id && p.is_active)
        .map(mapProductToCatalogItem),
    }));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
