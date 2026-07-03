import { BUSINESS } from "@/data/catalog";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-cinema-black py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center">
        <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.25em] text-white">
          {BUSINESS.name}
        </p>
        <p className="text-xs text-white/40">
          {BUSINESS.address} · {BUSINESS.city}
        </p>
        <a
          href={BUSINESS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-neon transition hover:underline"
        >
          @delirioxsexshop
        </a>
        <p className="max-w-md text-[10px] leading-relaxed text-white/25">
          Contenido exclusivo para mayores de 18 años. Precios referenciales —
          confirmar disponibilidad por WhatsApp.
        </p>
      </div>
    </footer>
  );
}
