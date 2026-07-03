"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BUSINESS,
  formatCOP,
  formatCartLineName,
  getCartLineId,
  getLinePrice,
  type CatalogItem,
  type CatalogItemSize,
} from "@/data/catalog";

export interface CartLine {
  lineId: string;
  item: CatalogItem;
  quantity: number;
  selectedSize?: CatalogItemSize;
}

export interface AddToCartOptions {
  selectedSize?: CatalogItemSize;
}

interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  hasConsultItems: boolean;
  addItem: (item: CatalogItem, options?: AddToCartOptions) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  buildOrderMessage: () => string;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback(
    (item: CatalogItem, options?: AddToCartOptions) => {
      const selectedSize =
        options?.selectedSize ??
        (item.sizes?.length === 1 ? item.sizes[0] : undefined);

      if (item.sizes?.length && !selectedSize) {
        return;
      }

      const lineId = getCartLineId(item, selectedSize);

      setLines((prev) => {
        const existing = prev.find((line) => line.lineId === lineId);
        if (existing) {
          return prev.map((line) =>
            line.lineId === lineId
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          );
        }
        return [...prev, { lineId, item, quantity: 1, selectedSize }];
      });
      setIsOpen(true);
    },
    [],
  );

  const removeItem = useCallback((lineId: string) => {
    setLines((prev) => {
      const target = prev.find((line) => line.lineId === lineId);
      if (!target) return prev;
      if (target.quantity <= 1) {
        return prev.filter((line) => line.lineId !== lineId);
      }
      return prev.map((line) =>
        line.lineId === lineId
          ? { ...line, quantity: line.quantity - 1 }
          : line,
      );
    });
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const totalItems = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  const totalPrice = useMemo(
    () =>
      lines.reduce(
        (sum, line) =>
          sum + getLinePrice(line.item, line.selectedSize) * line.quantity,
        0,
      ),
    [lines],
  );

  const hasConsultItems = useMemo(
    () =>
      lines.some(
        (line) => line.item.consultOnly || getLinePrice(line.item, line.selectedSize) <= 0,
      ),
    [lines],
  );

  const buildOrderMessage = useCallback(() => {
    if (lines.length === 0) {
      return `Hola ${BUSINESS.name} 👋 Quiero hacer un pedido.`;
    }

    const itemsText = lines
      .map((line) => {
        const unitPrice = getLinePrice(line.item, line.selectedSize);
        const name = formatCartLineName(line.item, line.selectedSize);
        const priceLabel =
          line.item.consultOnly || unitPrice <= 0
            ? "Consultar precio"
            : formatCOP(unitPrice * line.quantity);
        return `• ${line.quantity}x ${name} — ${priceLabel}`;
      })
      .join("\n");

    const totalLine =
      totalPrice > 0
        ? `*Total referencial:* ${formatCOP(totalPrice)}`
        : "*Total:* Consultar precios en tienda";

    return [
      `Hola ${BUSINESS.name} 👋 Quiero pedir:`,
      "",
      itemsText,
      "",
      totalLine,
      "",
      "📍 Entrega a domicilio / recoger en tienda",
      `📌 ${BUSINESS.address}, ${BUSINESS.city}`,
      "🔒 Pedido discreto — empaque sin identificación",
      "",
      "Gracias!",
    ].join("\n");
  }, [lines, totalPrice]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      isOpen,
      totalItems,
      totalPrice,
      hasConsultItems,
      addItem,
      removeItem,
      clearCart,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((open) => !open),
      buildOrderMessage,
    }),
    [
      lines,
      isOpen,
      totalItems,
      totalPrice,
      hasConsultItems,
      addItem,
      removeItem,
      clearCart,
      buildOrderMessage,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
