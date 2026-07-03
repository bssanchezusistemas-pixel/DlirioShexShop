"use client";

import Image from "next/image";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  formatPriceDisplay,
  type CatalogItem,
  type CatalogItemSize,
} from "@/data/catalog";

const CARD_STEP = 286;

interface CatalogHorizontalRowProps {
  items: CatalogItem[];
  accentColor: string;
  onAddItem: (item: CatalogItem, selectedSize?: CatalogItemSize) => void;
}

export function CatalogHorizontalRow({
  items,
  accentColor,
  onAddItem,
}: CatalogHorizontalRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(items.length > 1);

  const showNav = items.length > 1;

  const resetScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = 0;
  }, []);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(maxScroll > 6 && el.scrollLeft < maxScroll - 6);
  }, []);

  useLayoutEffect(() => {
    resetScroll();
    updateScrollState();
    requestAnimationFrame(() => {
      resetScroll();
      updateScrollState();
    });
  }, [items, resetScroll, updateScrollState]);

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      updateScrollState();
    });
    observer.observe(el);

    window.addEventListener("resize", updateScrollState);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollBy = (direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "left" ? -CARD_STEP : CARD_STEP,
      behavior: "smooth",
    });

    window.setTimeout(updateScrollState, 400);
  };

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      <div
        ref={trackRef}
        onScroll={updateScrollState}
        className="scrollbar-hide w-full overflow-x-auto overscroll-x-contain scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex w-max gap-4 py-1">
          {items.map((item) => (
            <CatalogProductCard
              key={item.id}
              item={item}
              accentColor={accentColor}
              onAdd={(selectedSize) => onAddItem(item, selectedSize)}
            />
          ))}
        </div>
      </div>

      {showNav && (
        <>
          <button
            type="button"
            onClick={() => scrollBy("left")}
            disabled={!canScrollLeft}
            aria-label="Ver productos anteriores"
            className="absolute left-2 top-[38%] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-[#141414]/95 text-xl leading-none text-white shadow-lg backdrop-blur-sm transition hover:border-neon hover:text-neon disabled:opacity-30 sm:h-12 sm:w-12"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => scrollBy("right")}
            disabled={!canScrollRight}
            aria-label="Ver más productos"
            className="absolute right-2 top-[38%] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-neon bg-neon text-xl leading-none text-white shadow-[0_0_28px_rgba(255,45,149,0.55)] transition hover:scale-105 disabled:opacity-30 sm:h-12 sm:w-12"
          >
            ›
          </button>
        </>
      )}

      {showNav && (
        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.3em] text-neon/70">
          Usa las flechas para ver todos los productos
        </p>
      )}
    </div>
  );
}

function CatalogProductCard({
  item,
  accentColor,
  onAdd,
}: {
  item: CatalogItem;
  accentColor: string;
  onAdd: (selectedSize?: CatalogItemSize) => void;
}) {
  const [selectedSize, setSelectedSize] = useState<CatalogItemSize | undefined>(
    item.sizes?.[0],
  );

  const displayPrice = formatPriceDisplay(item, selectedSize);
  const displayImage = selectedSize?.image ?? item.image;
  const hasSizes = Boolean(item.sizes?.length);
  const stock = item.stock ?? 10;
  const isOutOfStock = !item.consultOnly && stock <= 0;

  return (
    <article
      data-catalog-card
      className="group flex w-[270px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-cinema-gray text-left transition hover:border-neon/40"
      style={{ "--item-accent": accentColor } as CSSProperties}
    >
      <div
        className="relative flex aspect-square items-center justify-center overflow-hidden border-b border-white/5"
        style={{
          background: displayImage
            ? undefined
            : `linear-gradient(145deg, ${accentColor}22 0%, #1a1a1a 45%, ${accentColor}12 100%)`,
        }}
      >
        {displayImage ? (
          <Image
            key={displayImage}
            src={displayImage}
            alt={
              selectedSize
                ? `${item.name} — ${selectedSize.label}`
                : item.name
            }
            fill
            className="object-cover transition-opacity duration-200"
            sizes="270px"
          />
        ) : (
          <span
            className="text-4xl opacity-30 transition group-hover:opacity-50"
            style={{ color: accentColor }}
            aria-hidden
          >
            ✦
          </span>
        )}
        {item.badge && (
          <span
            className="absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white"
            style={{ backgroundColor: accentColor }}
          >
            {item.badge}
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-black/70 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white/80">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h4 className="font-[family-name:var(--font-display)] text-sm uppercase leading-tight text-white">
          {item.name}
        </h4>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/55">
          {item.description}
        </p>

        {hasSizes && item.sizes && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.sizes.map((size) => {
              const isActive = selectedSize?.label === size.label;
              return (
                <button
                  key={size.label}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wide transition ${
                    isActive
                      ? "border-transparent text-white"
                      : "border-white/15 text-white/50 hover:border-white/30"
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: accentColor, borderColor: accentColor }
                      : undefined
                  }
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        )}

        <p
          className="mt-3 font-[family-name:var(--font-display)] text-lg"
          style={{ color: accentColor }}
        >
          {displayPrice}
        </p>

        {!item.consultOnly && stock > 0 && stock <= 5 && (
          <p className="mt-1 text-[9px] uppercase tracking-wide text-neon/70">
            Solo {stock} disponibles
          </p>
        )}

        <button
          type="button"
          onClick={() => onAdd(selectedSize)}
          disabled={(hasSizes && !selectedSize) || isOutOfStock}
          className="mt-auto w-full rounded-full border py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition disabled:cursor-not-allowed disabled:opacity-40"
          style={{ borderColor: `${accentColor}66` }}
          onMouseEnter={(e) => {
            if (isOutOfStock) return;
            e.currentTarget.style.backgroundColor = `${accentColor}28`;
            e.currentTarget.style.borderColor = accentColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.borderColor = `${accentColor}66`;
          }}
        >
          {isOutOfStock ? "Agotado" : "Agregar al pedido"}
        </button>
      </div>
    </article>
  );
}
