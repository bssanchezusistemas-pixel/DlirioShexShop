"use client";

import { useEffect, useState } from "react";
import { BUSINESS } from "@/data/catalog";

const STORAGE_KEY = "deliriox-age-verified";

export function AgeGate({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    setVerified(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVerified(true);
  };

  if (verified === null) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-cinema-black" />
    );
  }

  if (!verified) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-cinema-black/95 p-4 backdrop-blur-md">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-cinema-dark p-8 text-center neon-border">
          <p className="text-[11px] uppercase tracking-[0.35em] text-neon">
            Contenido para adultos
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl uppercase text-white">
            {BUSINESS.name}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Este sitio contiene información y productos destinados exclusivamente
            a personas mayores de 18 años. Al continuar, confirmas que cumples
            con este requisito.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={accept}
              className="w-full rounded-full bg-neon py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white neon-border"
            >
              Soy mayor de 18 años
            </button>
            <a
              href="https://www.google.com"
              className="py-2 text-xs uppercase tracking-wider text-white/40 transition hover:text-white/70"
            >
              Salir
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
