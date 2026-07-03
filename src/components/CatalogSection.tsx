"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CATALOG_CATEGORIES,
  type CatalogCategory,
  type CatalogCategoryId,
} from "@/data/catalog";
import { useCart } from "@/context/CartContext";
import { CatalogHorizontalRow } from "@/components/CatalogHorizontalRow";

const NAV_OFFSET = 112;

export function CatalogSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const categoryRefs = useRef<Partial<Record<CatalogCategoryId, HTMLElement>>>(
    {},
  );
  const [categories, setCategories] = useState<CatalogCategory[]>(CATALOG_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CatalogCategoryId>(
    CATALOG_CATEGORIES[0].id,
  );
  const { addItem } = useCart();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories?.length) {
          setCategories(data.categories);
          setActiveCategory(data.categories[0].id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const scrollToCategory = useCallback((id: CatalogCategoryId) => {
    const el = categoryRefs.current[id];
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveCategory(id);
  }, []);

  useEffect(() => {
    const setupObserver = () => {
      const section = sectionRef.current;
      if (!section) return;

      const elements = section.querySelectorAll<HTMLElement>("[id^='catalog-']");
      if (elements.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (visible[0]?.target.id) {
            const id = visible[0].target.id.replace(
              "catalog-",
              "",
            ) as CatalogCategoryId;
            setActiveCategory(id);
          }
        },
        {
          rootMargin: `-${NAV_OFFSET}px 0px -55% 0px`,
          threshold: [0, 0.15, 0.35, 0.5],
        },
      );

      elements.forEach((el) => observer.observe(el));
      return observer;
    };

    const observer = setupObserver();
    return () => observer?.disconnect();
  }, [categories]);

  return (
    <section
      ref={sectionRef}
      id="catalogo"
      className="relative bg-cinema-dark py-20"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent" />

      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="mb-8 animate-[fadeUp_0.6s_ease-out_both]">
          <p className="text-[11px] uppercase tracking-[0.35em] text-neon">
            Catálogo
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2rem,7vw,3.5rem)] uppercase leading-none text-white">
            Nuestros productos
          </h2>
          <p className="mt-4 max-w-lg text-sm text-white/55">
            Explora por categorías. Precios referenciales — confirma stock y
            disponibilidad por WhatsApp.
          </p>
        </div>

        {loading ? (
          <p className="py-12 text-center text-sm text-white/40">
            Cargando catálogo...
          </p>
        ) : (
          <div className="flex min-w-0 gap-6 lg:gap-8">
            <aside className="hidden w-44 shrink-0 lg:block xl:w-48">
              <nav
                aria-label="Categorías del catálogo"
                className="sticky top-24"
              >
                <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-white/50">
                  Categorías
                </p>
                <ul className="space-y-1">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        type="button"
                        onClick={() => scrollToCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 text-xs uppercase tracking-[0.15em] transition rounded ${
                          activeCategory === cat.id
                            ? "bg-neon text-white font-medium neon-border"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {cat.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <div className="min-w-0 flex-1 basis-0">
              <nav
                aria-label="Categorías del catálogo"
                className="sticky top-[68px] z-40 -mx-4 mb-10 border-b border-white/5 bg-cinema-dark/95 px-4 py-3 backdrop-blur-md sm:top-[72px] lg:hidden"
              >
                <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => scrollToCategory(cat.id)}
                      aria-current={activeCategory === cat.id ? "true" : undefined}
                      className={`shrink-0 rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.15em] transition sm:px-5 sm:py-2.5 sm:text-[11px] ${
                        activeCategory === cat.id
                          ? "border-neon bg-neon/15 text-white neon-border"
                          : "border-white/10 text-white/60 hover:border-white/30"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </nav>

              <div className="space-y-16 sm:space-y-20">
                {categories.map((category, index) => (
                  <CatalogCategoryBlock
                    key={category.id}
                    category={category}
                    index={index}
                    ref={(el) => {
                      if (el) categoryRefs.current[category.id] = el;
                    }}
                    onAddItem={addItem}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CatalogCategoryBlock({
  category,
  index,
  ref,
  onAddItem,
}: {
  category: CatalogCategory;
  index: number;
  ref: (el: HTMLElement | null) => void;
  onAddItem: ReturnType<typeof useCart>["addItem"];
}) {
  const accent = category.accentColor ?? "#ff2d95";

  return (
    <div
      id={`catalog-${category.id}`}
      ref={ref}
      className="scroll-mt-28 w-full sm:scroll-mt-32"
    >
      <div
        className="mb-5 flex flex-col gap-3 border-b pb-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between"
        style={{ borderColor: `${accent}33` }}
      >
        <div className="w-full">
          <p
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ color: `${accent}99` }}
          >
            Sección {String(index + 1).padStart(2, "0")}
          </p>
          <h3
            className="mt-1 font-[family-name:var(--font-display)] text-2xl uppercase sm:text-3xl"
            style={{ color: category.accentColor ? accent : "#fff" }}
          >
            {category.label}
          </h3>
          <p className="mt-1 text-sm text-white/50">{category.tagline}</p>
        </div>
        <span
          className="shrink-0 self-start rounded-full px-3 py-1 text-[10px] uppercase tracking-widest sm:self-auto"
          style={{
            backgroundColor: `${accent}18`,
            color: accent,
          }}
        >
          {category.items.length} productos
        </span>
      </div>

      <CatalogHorizontalRow
        key={category.id}
        items={category.items}
        accentColor={accent}
        onAddItem={(item, selectedSize) => onAddItem(item, { selectedSize })}
      />
    </div>
  );
}
