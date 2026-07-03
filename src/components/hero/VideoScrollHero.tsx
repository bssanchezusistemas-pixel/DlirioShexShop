"use client";

import { useCallback, useRef, useState } from "react";
import { HeroAtmosphere } from "./HeroAtmosphere";
import { HeroBrandOverlay } from "./HeroBrandOverlay";
import { HERO_SCROLL_HEIGHT, HERO_VIDEO_SRC } from "./constants";
import { useVideoScrollScrub } from "./useVideoScrollScrub";

export function VideoScrollHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const [videoKey, setVideoKey] = useState(0);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const handleReady = useCallback(() => setStatus("ready"), []);
  const handleError = useCallback(() => setStatus("error"), []);
  const handleRetry = useCallback(() => {
    setStatus("loading");
    setVideoKey((key) => key + 1);
  }, []);

  useVideoScrollScrub({
    sectionRef,
    pinRef,
    videoRef,
    introRef,
    onReady: handleReady,
    onError: handleError,
    videoKey,
  });

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative bg-black"
      style={{ height: HERO_SCROLL_HEIGHT }}
      aria-label="Experiencia cinematográfica DLIRIOX"
    >
      <div
        ref={pinRef}
        className="relative h-[100dvh] w-full overflow-hidden bg-black"
      >
        <video
          key={videoKey}
          ref={videoRef}
          className="hero-video-scrub absolute inset-0 z-[1] h-full w-full object-cover"
          src={HERO_VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          aria-hidden
        />

        <HeroAtmosphere />

        <HeroBrandOverlay ref={introRef} />

        {status === "loading" && (
          <div className="absolute inset-0 z-[40] flex items-center justify-center bg-black">
            <p className="text-[10px] uppercase tracking-[0.45em] text-white/50">
              Cargando experiencia…
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 z-[40] flex flex-col items-center justify-center gap-4 bg-black px-6 text-center">
            <p className="text-sm text-white/60">No se pudo cargar el video.</p>
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-full border border-white/20 px-5 py-2.5 text-[11px] uppercase tracking-[0.25em] text-white/80 transition hover:border-neon hover:text-white"
            >
              Reintentar
            </button>
          </div>
        )}

        <p className="pointer-events-none absolute bottom-6 left-1/2 z-[25] -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-white/40">
          Desliza para entrar
        </p>
      </div>
    </section>
  );
}
