import { BUSINESS } from "@/data/catalog";

const TRUST_ITEMS = [
  {
    icon: "🔒",
    title: "Empaque discreto",
    description:
      "Sin identificación externa. Tu privacidad es nuestra prioridad.",
  },
  {
    icon: "🛵",
    title: "Domicilios gratis",
    description: BUSINESS.deliveryNote,
  },
  {
    icon: "⭐",
    title: "Marcas reconocidas",
    description:
      "Productos de alta calidad y durabilidad. Ventas de marcas reconocidas.",
  },
  {
    icon: "💬",
    title: "Asesoría personalizada",
    description:
      "Te orientamos sin compromiso por WhatsApp o en tienda física.",
  },
];

export function TrustSection() {
  return (
    <section className="relative bg-cinema-black py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-neon">
            Por qué elegirnos
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.75rem,5vw,2.5rem)] uppercase text-white">
            Todo en un solo lugar
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/8 bg-cinema-gray p-6 transition hover:border-neon/30"
            >
              <span className="text-2xl" aria-hidden>
                {item.icon}
              </span>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-sm uppercase text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/55">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
