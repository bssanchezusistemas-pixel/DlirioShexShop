import type { CatalogItemSize, DbProduct, DeliveryType, OrderLineInput } from "@/lib/types";

const VALID_DELIVERY_TYPES: DeliveryType[] = ["pickup", "delivery"];

export interface ValidatedOrderLine {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  sizeLabel: string | null;
}

export function isValidDeliveryType(value: unknown): value is DeliveryType {
  return typeof value === "string" && VALID_DELIVERY_TYPES.includes(value as DeliveryType);
}

export function resolveUnitPrice(
  product: Pick<DbProduct, "price" | "consult_only" | "sizes" | "name">,
  sizeLabel?: string,
): number | null {
  if (product.consult_only) return 0;

  const sizes = (product.sizes ?? []) as CatalogItemSize[];

  if (sizes.length > 0) {
    if (!sizeLabel?.trim()) {
      return null;
    }
    const match = sizes.find((s) => s.label === sizeLabel.trim());
    if (!match) return null;
    return match.price;
  }

  return product.price ?? 0;
}

export function validateOrderLines(
  lines: OrderLineInput[],
  products: DbProduct[],
): { ok: true; validated: ValidatedOrderLine[]; totalAmount: number } | { ok: false; error: string } {
  if (!lines.length) {
    return { ok: false, error: "El pedido debe tener al menos un producto" };
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  const qtyByProduct = new Map<string, number>();
  const validated: ValidatedOrderLine[] = [];

  for (const line of lines) {
    if (!line.productId?.trim()) {
      return { ok: false, error: "Producto inválido en el pedido" };
    }

    if (!Number.isInteger(line.quantity) || line.quantity <= 0) {
      return { ok: false, error: `Cantidad inválida para ${line.productName}` };
    }

    const product = productMap.get(line.productId);
    if (!product) {
      return { ok: false, error: `Producto no disponible: ${line.productName}` };
    }

    if (!product.is_active) {
      return { ok: false, error: `Producto no disponible: ${product.name}` };
    }

    if (product.consult_only) {
      return {
        ok: false,
        error: `${product.name} es solo consulta — contáctanos por WhatsApp`,
      };
    }

    const unitPrice = resolveUnitPrice(product, line.sizeLabel);
    if (unitPrice === null) {
      return {
        ok: false,
        error: `Talla no válida para ${product.name}`,
      };
    }

    qtyByProduct.set(
      line.productId,
      (qtyByProduct.get(line.productId) ?? 0) + line.quantity,
    );

    validated.push({
      productId: line.productId,
      productName: product.name,
      quantity: line.quantity,
      unitPrice,
      sizeLabel: line.sizeLabel?.trim() ?? null,
    });
  }

  for (const [productId, requested] of qtyByProduct) {
    const product = productMap.get(productId)!;
    if (product.stock < requested) {
      return {
        ok: false,
        error: `Stock insuficiente para ${product.name}`,
      };
    }
  }

  const totalAmount = validated.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0,
  );

  return { ok: true, validated, totalAmount };
}
