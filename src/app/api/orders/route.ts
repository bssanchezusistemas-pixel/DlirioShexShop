import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUSINESS, CATALOG_CATEGORIES, buildWhatsAppUrl, formatCOP } from "@/data/catalog";
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

let cachedDbAvailability: { available: boolean; timestamp: number } | null = null;
const DB_AVAILABILITY_CACHE_TTL_MS = 30_000;

async function isCatalogAvailable(): Promise<boolean> {
  const now = Date.now();
  if (
    cachedDbAvailability &&
    now - cachedDbAvailability.timestamp < DB_AVAILABILITY_CACHE_TTL_MS
  ) {
    return cachedDbAvailability.available;
  }

  let timer: NodeJS.Timeout | undefined;
  try {
    const supabase = createAdminClient();
    const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) => {
      timer = setTimeout(() => reject(new Error("Supabase check timeout")), 2500);
    });
    const checkPromise = supabase.from("categories").select("id").limit(1);

    const { data: categories, error: catError } = (await Promise.race([
      checkPromise,
      timeoutPromise,
    ])) as { data: { id: string }[] | null; error: unknown };

    const isAvailable = !catError && (categories?.length ?? 0) > 0;
    cachedDbAvailability = { available: isAvailable, timestamp: now };
    return isAvailable;
  } catch {
    cachedDbAvailability = { available: false, timestamp: now };
    return false;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function getStaticDbProducts(): DbProduct[] {
  const list: DbProduct[] = [];
  for (const cat of CATALOG_CATEGORIES) {
    for (const item of cat.items) {
      list.push({
        id: item.id,
        category_id: cat.id,
        name: item.name,
        description: item.description,
        price: item.price ?? (item.sizes?.[0]?.price ?? null),
        stock: item.stock ?? 10,
        image_url: item.image ?? null,
        badge: item.badge ?? null,
        consult_only: item.consultOnly ?? false,
        sizes: item.sizes ?? [],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }
  return list;
}

async function countRecentOrdersByPhone(
  supabase: ReturnType<typeof createAdminClient>,
  phone: string,
): Promise<number> {
  try {
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
  } catch {
    return 0;
  }
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

    const productIds = [...new Set(body.lines?.map((l) => l.productId) ?? [])];
    if (!productIds.length) {
      return NextResponse.json(
        { error: "El pedido debe tener al menos un producto" },
        { status: 400 },
      );
    }

    const dbAvailable = await isCatalogAvailable();

    if (dbAvailable) {
      try {
        const supabase = createAdminClient();

        const recentByPhone = await countRecentOrdersByPhone(
          supabase,
          normalizedPhone,
        );
        if (recentByPhone >= MAX_ORDERS_PER_PHONE_PER_HOUR) {
          return NextResponse.json(
            { error: "Has enviado varios pedidos recientemente. Intenta más tarde." },
            { status: 429 },
          );
        }

        const { data: products, error: productsError } = await supabase
          .from("products")
          .select("id, name, price, stock, consult_only, sizes, is_active")
          .in("id", productIds)
          .eq("is_active", true);

        if (!productsError && (products ?? []).length === productIds.length) {
          const validation = validateOrderLines(
            body.lines,
            products as DbProduct[],
          );
          if (!validation.ok) {
            return NextResponse.json(
              { error: validation.error },
              { status: 400 },
            );
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
              const product = (products as DbProduct[]).find(
                (p) => p.id === productId,
              );
              return NextResponse.json(
                {
                  error: `Stock insuficiente para ${product?.name ?? "un producto"}`,
                },
                { status: 400 },
              );
            }
            console.warn(
              "[orders] DB rpc failed, falling back to WhatsApp message directly",
              rpcError,
            );
          }

          const whatsappUrl = buildWhatsAppUrl(whatsappMessage);
          return NextResponse.json({
            orderId: orderId ?? null,
            whatsappUrl,
            message: whatsappMessage,
            fallback: Boolean(rpcError),
          });
        }
      } catch (dbErr) {
        console.warn("[orders] DB operation failed, falling back to static catalog", dbErr);
      }
    }

    // Fallback mode: Validate against static catalog so the customer is never blocked
    const staticProducts = getStaticDbProducts();
    const validation = validateOrderLines(body.lines, staticProducts);

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

    const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

    return NextResponse.json({
      orderId: null,
      whatsappUrl,
      message: whatsappMessage,
      fallback: true,
    });
  } catch (err) {
    console.error("[orders] unexpected error", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

