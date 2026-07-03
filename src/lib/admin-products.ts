import { slugify } from "@/lib/catalog-mapper";

export function resolveProductId(id: string | undefined, name: string): string | null {
  const resolved = (id ?? slugify(name)).trim();
  return resolved || null;
}

export function friendlyProductDeleteError(message: string, code?: string): string {
  if (
    code === "23503" ||
    message.includes("foreign key") ||
    message.includes("violates foreign key constraint")
  ) {
    return "No se puede eliminar: este producto está incluido en pedidos existentes.";
  }
  if (message.includes("duplicate key")) {
    return "Conflicto al eliminar el producto. Intenta de nuevo.";
  }
  return message;
}
