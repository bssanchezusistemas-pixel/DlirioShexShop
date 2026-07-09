export type CatalogCategoryId =
  | "lenceria"
  | "disfraces"
  | "lubricantes"
  | "sen-intimo"
  | "cuidado-intimo"
  | "retardantes"
  | "juguetes-hombres"
  | "juguetes-mujeres"
  | "potenciadores-femeninos"
  | "potenciadores-masculinos"
  | "dilatadores-desensibilizantes"
  | "sadomasoquismo"
  | "otros";

export interface CatalogItemSize {
  label: string;
  price: number;
  /** Optional per-variant image (flavor, size, etc.) */
  image?: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  price?: number;
  stock: number;
  sizes?: CatalogItemSize[];
  image?: string;
  badge?: string;
  consultOnly?: boolean;
}

export interface CatalogCategory {
  id: CatalogCategoryId;
  label: string;
  tagline: string;
  accentColor?: string;
  items: CatalogItem[];
}

export type DeliveryType = "pickup" | "delivery";
export type OrderStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface DbCategory {
  id: string;
  label: string;
  tagline: string;
  accent_color: string;
  sort_order: number;
}

export interface DbProduct {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number | null;
  stock: number;
  image_url: string | null;
  badge: string | null;
  consult_only: boolean;
  sizes: CatalogItemSize[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbCustomer {
  id: string;
  name: string;
  phone: string;
  created_at: string;
}

export interface DbOrder {
  id: string;
  customer_id: string;
  total_amount: number;
  delivery_type: DeliveryType;
  delivery_address: string | null;
  status: OrderStatus;
  whatsapp_message: string;
  created_at: string;
  customers?: DbCustomer;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  size_label: string | null;
}

export interface OrderLineInput {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  sizeLabel?: string;
}

export interface CreateOrderInput {
  customer: { name: string; phone: string };
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  lines: OrderLineInput[];
}

export interface AdminStats {
  totalOrders: number;
  ordersToday: number;
  ordersWeek: number;
  ordersMonth: number;
  totalRevenue: number;
  uniqueCustomers: number;
  lowStockProducts: DbProduct[];
  recentOrders: (DbOrder & { customers: DbCustomer })[];
}
