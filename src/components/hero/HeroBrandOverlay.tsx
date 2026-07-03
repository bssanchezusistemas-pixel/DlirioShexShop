import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { HERO_COPY } from "./constants";

interface HeroBrandOverlayProps {
  className?: string;
}

export const HeroBrandOverlay = forwardRef<HTMLDivElement, HeroBrandOverlayProps>(
  function HeroBrandOverlay({ className }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-none absolute inset-0 z-[30] flex flex-col items-center justify-center px-6 text-center",
          className,
        )}
      >
        <div className="relative">
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.75rem,11vw,6.25rem)] uppercase leading-[0.92] tracking-[0.35em] text-white">
            {HERO_COPY.title}
          </h1>
          <p className="hero-brand-subtitle mx-auto mt-5 max-w-xl text-[clamp(0.65rem,2.2vw,0.8rem)] uppercase tracking-[0.42em] text-white/85">
            {HERO_COPY.subtitle}
          </p>
        </div>
      </div>
    );
  },
);
