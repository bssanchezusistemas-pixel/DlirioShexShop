"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BUSINESS } from "@/data/catalog";
import {
  buildFrameSequence,
  getFrameStep,
  getFrameUrl,
} from "@/data/heroFrames";

function fitCanvas(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  dpr: number,
) {
  const parent = canvas.parentElement;
  if (!parent) return;

  const maxW = parent.clientWidth;
  const maxH = parent.clientHeight;

  canvas.width = maxW * dpr;
  canvas.height = maxH * dpr;
  canvas.style.width = `${maxW}px`;
  canvas.style.height = `${maxH}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, maxW, maxH);

  const scale = Math.max(maxW / img.naturalWidth, maxH / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  const x = (maxW - w) / 2;
  const y = (maxH - h) / 2;

  ctx.drawImage(img, x, y, w, h);
  return ctx;
}

function preloadFrame(frameNumber: number): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error(`No se pudo cargar frame ${frameNumber}`));
    img.src = getFrameUrl(frameNumber);
  });
}

export function HeroScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [loadPct, setLoadPct] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let cancelled = false;
    let resizeHandler: (() => void) | null = null;
    let gsapCtx: gsap.Context | null = null;

    const init = async () => {
      const saveData =
        typeof navigator !== "undefined" &&
        "connection" in navigator &&
        (navigator as Navigator & { connection?: { saveData?: boolean } })
          .connection?.saveData === true;

      const isMobile =
        typeof window !== "undefined" && window.innerWidth < 768;
      const step = getFrameStep(isMobile, saveData);
      const sequence = buildFrameSequence(step);

      const first = await preloadFrame(sequence[0]);
      if (cancelled) return;

      imagesRef.current = [first];
      setLoadPct(Math.round((1 / sequence.length) * 100));

      const canvas = canvasRef.current;
      if (canvas) {
        fitCanvas(canvas, first, window.devicePixelRatio || 1);
      }

      setReady(true);
      requestAnimationFrame(() => ScrollTrigger.refresh());

      const rest = sequence.slice(1);
      rest.forEach((frameNum, idx) => {
        preloadFrame(frameNum)
          .then((img) => {
            if (cancelled) return;
            imagesRef.current[idx + 1] = img;
            setLoadPct(Math.round(((idx + 2) / sequence.length) * 100));
          })
          .catch(() => {});
      });

      const draw = (index: number) => {
        const img = imagesRef.current[index];
        const canvasEl = canvasRef.current;
        if (!img?.complete || !canvasEl) return;
        fitCanvas(canvasEl, img, window.devicePixelRatio || 1);
      };

      resizeHandler = () => draw(frameIndexRef.current);
      window.addEventListener("resize", resizeHandler);

      gsapCtx = gsap.context(() => {
        const state = { frame: 0 };

        gsap.to(state, {
          frame: sequence.length - 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=260%",
            pin: pinRef.current,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
          onUpdate: () => {
            const index = Math.round(state.frame);
            if (index !== frameIndexRef.current) {
              frameIndexRef.current = index;
              draw(index);
            }
          },
        });

        gsap.to(headlineRef.current, {
          opacity: 0,
          y: 32,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=35%",
            scrub: true,
          },
        });

        gsap.from(".hero-word", {
          y: 36,
          opacity: 0,
          duration: 1.15,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.35,
        });
      }, sectionRef);
    };

    init();

    return () => {
      cancelled = true;
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      gsapCtx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative min-h-[360vh] bg-cinema-black"
      aria-label="Experiencia cinematográfica DLIRIOX"
    >
      <div
        ref={pinRef}
        className="relative h-[100dvh] w-full overflow-hidden bg-black"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,45,149,0.14)_0%,transparent_62%)]" />

        <div className="absolute inset-0 z-10">
          <canvas
            ref={canvasRef}
            className={`block h-full w-full transition-opacity duration-500 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Recorrido por la tienda DLIRIOX al hacer scroll"
          />
          {!ready && (
            <p className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-white/40">
              Cargando experiencia… {loadPct}%
            </p>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(to_bottom,rgba(10,10,10,0.45)_0%,transparent_38%,transparent_52%,rgba(10,10,10,0.72)_78%,rgba(10,10,10,0.96)_100%)]" />

        <div className="absolute inset-x-0 bottom-0 z-30 px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[min(52vh,420px)] bg-[radial-gradient(ellipse_90%_70%_at_50%_100%,rgba(255,45,149,0.12)_0%,transparent_68%)]" />

          <div
            ref={headlineRef}
            className="relative mx-auto mb-8 max-w-2xl text-center sm:mb-10"
          >
            <p className="hero-word hero-premium-eyebrow mb-4 text-[9px] uppercase text-neon-soft/90 sm:text-[10px]">
              {BUSINESS.city}
            </p>
            <h1 className="hero-word hero-premium-title text-[clamp(2.5rem,10vw,4.5rem)] uppercase leading-none text-white">
              DLIRIOX
            </h1>
            <div
              className="hero-word mx-auto my-4 h-px w-12 bg-gradient-to-r from-transparent via-neon/70 to-transparent sm:my-5 sm:w-16"
              aria-hidden
            />
            <p className="hero-word hero-premium-tagline mx-auto max-w-sm text-[clamp(0.7rem,2.4vw,0.85rem)] normal-case text-white/80 sm:max-w-md">
              Experiencias eróticas & boutique sensorial
            </p>
          </div>

          <p className="hero-word mb-4 text-center text-[9px] uppercase tracking-[0.38em] text-white/35 sm:text-[10px]">
            Desliza para entrar
          </p>
          <div className="mb-2 flex justify-between text-[9px] uppercase tracking-[0.28em] text-white/35 sm:text-[10px]">
            <span>Exterior</span>
            <span>Explorando</span>
          </div>
          <div className="h-px overflow-hidden rounded-full bg-white/10">
            <div
              ref={progressRef}
              className="h-full origin-left bg-gradient-to-r from-neon-soft to-neon shadow-[0_0_14px_rgba(255,45,149,0.55)]"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
