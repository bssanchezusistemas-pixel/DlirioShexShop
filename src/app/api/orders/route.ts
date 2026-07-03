import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUSINESS, buildWhatsAppUrl, formatCOP } from "@/data/catalog";
import {
  isValidColombianPhone,
  isValidDeliveryType,
  normalizePhone,
  validateOrderLines,
} from "@/lib/order-validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { CreateOrderInput } from "@/lib/types";
import type { DbProduct } from "@/lib/types";

const MAX_ORDERS_PER_PHONE_PER_HOUR = 5;
const MAX_ORDERS_PER_IP_PER_HOUR = 15;

function buildOrderWhatsAppMessage(
  input: CreateOrderInput,
  lines: { productName: string; quantity: number; unitPrice: number; sizeLabel: string | null }[],
  totalAmount: number,
): string {
  const itemsText = lines
    .map((line) => {
      const name = line.sizeLabel
        ? `${line.productName} (${line.sizeLabel})`
        : line.productName;
      const priceLabel =
        line.unitPrice <= 0
          ? "Consultar precio"
          : formatCOP(line.unitPrice * line.quantity);
      return `• ${line.quantity}x ${name} — ${priceLabel}`;
    })
    .join("\n");

  const totalLine =
    totalAmount > 0
      ? `*Total referencial:* ${formatCOP(totalAmount)}`
      : "*Total:* Consultar precios en tienda";

  const deliveryLine =
    input.deliveryType === "delivery"
      ? `🚚 Domicilio: ${input.deliveryAddress ?? "Sin dirección"}`
      : "🏪 Recoger en tienda";

  return [
    `Hola ${BUSINESS.name} 👋 Quiero pedir:`,
    "",
    `👤 ${input.customer.name}`,
    `📱 ${input.customer.phone}`,
    "",
    itemsText,
    "",
    totalLine,
    "",
    deliveryLine,
    `📌 ${BUSINESS.address}, ${BUSINESS.city}`,
    "🔒 Pedido discreto — empaque sin identificación",
    "",
    "Gracias!",
  ].join("\n");
}

async function isCatalogAvailable(): Promise<boolean> {
  const supabase = createAdminClient();
  const [{ data: categories, error: catError }, { count, error: prodError }] =
    await Promise.all([
      supabase.from("categories").select("id").limit(1),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
    ]);

  return !catError && !prodError && (categories?.length ?? 0) > 0 && (count ?? 0) > 0;
}

async function countRecentOrdersByPhone(
  supabase: ReturnType<typeof createAdminClient>,
  phone: string,
): Promise<number> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data: customers } = await supabase
    .from("customers")
    .select("id")
    .eq("phone", phone);

  if (!customers?.length) return 0;

  const customerIds = customers.map((c) => c.id);
  const { count } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .in("customer_id", customerIds)
    .gte("created_at", oneHourAgo);

  return count ?? 0;
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const ipLimit = checkRateLimit(
      `orders:ip:${clientIp}`,
      MAX_ORDERS_PER_IP_PER_HOUR,
      60 * 60 * 1000,
    );
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "Demasiados pedidos. Intenta de nuevo más tarde." },
        {
          status: 429,
          headers: ipLimit.retryAfterSec
            ? { "Retry-After": String(ipLimit.retryAfterSec) }
            : undefined,
        },
      );
    }

    const body = (await request.json()) as CreateOrderInput;

    if (!body.customer?.name?.trim() || !body.customer?.phone?.trim()) {
      return NextResponse.json(
        { error: "Nombre y teléfono son requeridos" },
        { status: 400 },
      );
    }

    const normalizedPhone = normalizePhone(body.customer.phone);
    if (!isValidColombianPhone(body.customer.phone)) {
      return NextResponse.json(
        { error: "Ingresa un celular colombiano válido (10 dígitos, empieza en 3)." },
        { status: 400 },
      );
    }

    if (!isValidDeliveryType(body.deliveryType)) {
      return NextResponse.json(
        { error: "Tipo de entrega inválido" },
        { status: 400 },
      );
    }

    if (body.deliveryType === "delivery" && !body.deliveryAddress?.trim()) {
      return NextResponse.json(
        { error: "La dirección es requerida para domicilio" },
        { status: 400 },
      );
    }

    if (!(await isCatalogAvailable())) {
      return NextResponse.json(
        { error: "El catálogo no está disponible. Intenta más tarde." },
        { status: 503 },
      );
    }

    const supabase = createAdminClient();

    const recentByPhone = await countRecentOrdersByPhone(supabase, normalizedPhone);
    if (recentByPhone >= MAX_ORDERS_PER_PHONE_PER_HOUR) {
      return NextResponse.json(
        { error: "Has enviado varios pedidos recientemente. Intenta más tarde." },
        { status: 429 },
      );
    }

    const productIds = [...new Set(body.lines?.map((l) => l.productId) ?? [])];
    if (!productIds.length) {
      return NextResponse.json(
        { error: "El pedido debe tener al menos un producto" },
        { status: 400 },
      );
    }

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, price, stock, consult_only, sizes, is_active")
      .in("id", productIds)
      .eq("is_active", true);

    if (productsError) {
      console.error("[orders] product validation failed", productsError);
      return NextResponse.json(
        { error: "Error al validar productos" },
        { status: 500 },
      );
    }

    if ((products ?? []).length !== productIds.length) {
      return NextResponse.json(
        { error: "Uno o más productos no están disponibles" },
        { status: 400 },
      );
    }

    const validation = validateOrderLines(body.lines, products as DbProduct[]);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const whatsappMessage = buildOrderWhatsAppMessage(
      {
        ...body,
        customer: { ...body.customer, phone: normalizedPhone },
      },
      validation.validated,
      validation.totalAmount,
    );

    const rpcItems = validation.validated.map((line) => ({
      product_id: line.productId,
      product_name: line.productName,
      quantity: line.quantity,
      unit_price: line.unitPrice,
      size_label: line.sizeLabel,
    }));

    const { data: orderId, error: rpcError } = await supabase.rpc(
      "create_order_with_stock",
      {
        p_customer_name: body.customer.name.trim(),
        p_customer_phone: normalizedPhone,
        p_delivery_type: body.deliveryType,
        p_delivery_address:
          body.deliveryType === "delivery"
            ? body.deliveryAddress?.trim() ?? null
            : null,
        p_whatsapp_message: whatsappMessage,
        p_total_amount: validation.totalAmount,
        p_items: rpcItems,
      },
    );

    if (rpcError) {
      if (rpcError.message?.includes("stock_insufficient")) {
        const productId = rpcError.message.split(":")[1]?.trim();
        const product = (products as DbProduct[]).find((p) => p.id === productId);
        return NextResponse.json(
          { error: `Stock insuficiente para ${product?.name ?? "un producto"}` },
          { status: 400 },
        );
      }
      console.error("[orders] create_order_with_stock failed", rpcError);
      return NextResponse.json(
        { error: "Error al registrar pedido" },
        { status: 500 },
      );
    }

    const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

    return NextResponse.json({
      orderId,
      whatsappUrl,
      message: whatsappMessage,
    });
  } catch (err) {
    console.error("[orders] unexpected error", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
