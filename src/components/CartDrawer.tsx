"use client";

import { useState } from "react";
import {
  formatCOP,
  formatCartLineName,
  getLinePrice,
} from "@/data/catalog";
import { useCart } from "@/context/CartContext";
import type { DeliveryType } from "@/lib/types";

type CheckoutStep = "cart" | "checkout";

export function CartDrawer() {
  const {
    lines,
    isOpen,
    totalItems,
    totalPrice,
    hasConsultItems,
    closeCart,
    addItem,
    removeItem,
    clearCart,
  } = useCart();

  const [step, setStep] = useState<CheckoutStep>("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const resetAndClose = () => {
    setStep("cart");
    setError("");
    closeCart();
  };

  const handleSubmitOrder = async () => {
    if (!name.trim() || !phone.trim()) {
      setError("Nombre y teléfono son requeridos");
      return;
    }

    if (deliveryType === "delivery" && !deliveryAddress.trim()) {
      setError("La dirección es requerida para domicilio");
      return;
    }

    setSubmitting(true);
    setError("");

    const payload = {
      customer: { name: name.trim(), phone: phone.trim() },
      deliveryType,
      deliveryAddress:
        deliveryType === "delivery" ? deliveryAddress.trim() : undefined,
      lines: lines.map((line) => ({
        productId: line.item.id,
        productName: formatCartLineName(line.item, line.selectedSize),
        quantity: line.quantity,
        unitPrice: getLinePrice(line.item, line.selectedSize),
        sizeLabel: line.selectedSize?.label,
      })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al registrar el pedido");
        setSubmitting(false);
        return;
      }

      window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      clearCart();
      setName("");
      setPhone("");
      setDeliveryAddress("");
      setDeliveryType("pickup");
      setStep("cart");
      closeCart();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    }

    setSubmitting(false);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar pedido"
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
        onClick={resetAndClose}
      />
      <aside className="fixed inset-x-0 bottom-0 z-[70] max-h-[85dvh] overflow-hidden rounded-t-3xl border border-white/10 bg-cinema-dark shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-lg uppercase text-white">
              {step === "cart" ? "Tu pedido" : "Datos de entrega"}
            </h2>
            <p className="text-xs text-white/50">
              {step === "cart"
                ? `${totalItems} ${totalItems === 1 ? "producto" : "productos"} · empaque discreto`
                : "Completa tus datos para enviar el pedido"}
            </p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wider text-white/70"
          >
            Cerrar
          </button>
        </div>

        {step === "cart" ? (
          <>
            <div className="max-h-[45dvh] overflow-y-auto px-5 py-4">
              {lines.length === 0 ? (
                <p className="py-8 text-center text-sm text-white/50">
                  Agrega productos desde el catálogo para armar tu pedido.
                </p>
              ) : (
                <ul className="space-y-4">
                  {lines.map((line) => {
                    const unitPrice = getLinePrice(line.item, line.selectedSize);
                    const displayName = formatCartLineName(
                      line.item,
                      line.selectedSize,
                    );

                    return (
                      <li
                        key={line.lineId}
                        className="flex items-center justify-between gap-3 border-b border-white/5 pb-4"
                      >
                        <div>
                          <p className="font-medium text-white">{displayName}</p>
                          <p className="text-xs text-white/45">
                            {line.item.consultOnly || unitPrice <= 0
                              ? "Consultar precio"
                              : `${formatCOP(unitPrice)} c/u`}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => removeItem(line.lineId)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white"
                            aria-label={`Quitar ${displayName}`}
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm text-white">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              addItem(line.item, {
                                selectedSize: line.selectedSize,
                              })
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-neon text-neon"
                            aria-label={`Agregar ${displayName}`}
                          >
                            +
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="border-t border-white/10 px-5 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm uppercase tracking-wider text-white/50">
                  Total referencial
                </span>
                <span className="font-[family-name:var(--font-display)] text-xl text-neon">
                  {totalPrice > 0 ? formatCOP(totalPrice) : "Consultar"}
                </span>
              </div>

              {hasConsultItems && (
                <p className="mb-4 text-xs text-white/45">
                  Algunos productos requieren confirmación de precio y stock por
                  WhatsApp.
                </p>
              )}

              <button
                type="button"
                disabled={lines.length === 0}
                onClick={() => setStep("checkout")}
                className="flex w-full items-center justify-center rounded-full bg-neon py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white neon-border disabled:opacity-40"
              >
                Continuar al pedido
              </button>

              {lines.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-3 w-full py-2 text-xs uppercase tracking-wider text-white/40 hover:text-white/70"
                >
                  Vaciar pedido
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="max-h-[60dvh] overflow-y-auto px-5 py-5">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Nombre
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-cinema-gray px-4 py-3 text-sm text-white outline-none focus:border-neon"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Teléfono / WhatsApp
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  type="tel"
                  className="w-full rounded-xl border border-white/10 bg-cinema-gray px-4 py-3 text-sm text-white outline-none focus:border-neon"
                  placeholder="300 123 4567"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Tipo de entrega
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("pickup")}
                    className={`flex-1 rounded-full border py-2.5 text-[10px] uppercase tracking-[0.12em] ${
                      deliveryType === "pickup"
                        ? "border-neon bg-neon/15 text-white"
                        : "border-white/15 text-white/60"
                    }`}
                  >
                    Recoger en tienda
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("delivery")}
                    className={`flex-1 rounded-full border py-2.5 text-[10px] uppercase tracking-[0.12em] ${
                      deliveryType === "delivery"
                        ? "border-neon bg-neon/15 text-white"
                        : "border-white/15 text-white/60"
                    }`}
                  >
                    Domicilio
                  </button>
                </div>
              </div>

              {deliveryType === "delivery" && (
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-white/50">
                    Dirección de entrega
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                    rows={2}
                    className="w-full rounded-xl border border-white/10 bg-cinema-gray px-4 py-3 text-sm text-white outline-none focus:border-neon"
                    placeholder="Barrio, calle, referencia..."
                  />
                </div>
              )}

              {error && (
                <p className="text-center text-sm text-red-400">{error}</p>
              )}

              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitOrder}
                className="flex w-full items-center justify-center rounded-full bg-neon py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white neon-border disabled:opacity-50"
              >
                {submitting ? "Registrando..." : "Enviar pedido por WhatsApp"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("cart");
                  setError("");
                }}
                className="w-full py-2 text-xs uppercase tracking-wider text-white/40 hover:text-white/70"
              >
                ← Volver al carrito
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
