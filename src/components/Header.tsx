"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buildWhatsAppUrl, BUSINESS } from "@/data/catalog";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { totalItems, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappUrl = buildWhatsAppUrl(
    `Hola ${BUSINESS.name} 👋 Quiero hacer un pedido.`,
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/5 bg-cinema-black/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="#inicio" className="flex flex-col">
          <span className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.2em] text-white">
            Dlirio
          </span>
          <span className="text-[10px] uppercase tracking-[0.35em] text-neon neon-text">
            X Sex Shop
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.2em] text-white/70 md:flex">
          <a href="#catalogo" className="transition hover:text-neon">
            Catálogo
          </a>
          <a href="#ubicacion" className="transition hover:text-neon">
            Ubicación
          </a>
          <a
            href={BUSINESS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-neon"
          >
            Instagram
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="rounded-full px-2 py-2 text-[10px] uppercase tracking-[0.15em] text-white/35 transition hover:text-neon/80"
            aria-label="Panel de administración"
          >
            Panel
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative rounded-full border border-white/15 px-3 py-2 text-[11px] uppercase tracking-wider text-white/80 transition hover:border-neon hover:text-neon"
            aria-label="Abrir pedido"
          >
            Pedido
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neon text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-neon px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white sm:inline-flex neon-border"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
