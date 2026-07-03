"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_SCROLL } from "./constants";

function snapToFrame(time: number, duration: number, fps: number) {
  const frameDuration = 1 / fps;
  const max = Math.max(0, duration - frameDuration);
  const snapped = Math.round(time * fps) / fps;
  return Math.min(Math.max(0, snapped), max);
}

function paintVideoFrame(
  video: HTMLVideoElement,
  time: number,
  fps: number,
) {
  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

  const target = snapToFrame(time, video.duration, fps);
  const frameDuration = 1 / fps;

  if (Math.abs(video.currentTime - target) < frameDuration * 0.45) return;

  if (typeof video.fastSeek === "function") {
    try {
      video.fastSeek(target);
      return;
    } catch {
      // Fall through to currentTime.
    }
  }

  video.currentTime = target;
}

function isVideoReady(video: HTMLVideoElement) {
  return (
    video.readyState >= HTMLMediaElement.HAVE_METADATA &&
    Number.isFinite(video.duration) &&
    video.duration > 0
  );
}

function isIgnorableVideoError(video: HTMLVideoElement) {
  return video.error?.code === MediaError.MEDIA_ERR_ABORTED;
}

interface UseVideoScrollScrubOptions {
  sectionRef: RefObject<HTMLElement | null>;
  pinRef: RefObject<HTMLDivElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  introRef: RefObject<HTMLDivElement | null>;
  onReady: () => void;
  onError: () => void;
  videoKey?: number;
}

export function useVideoScrollScrub({
  sectionRef,
  pinRef,
  videoRef,
  introRef,
  onReady,
  onError,
  videoKey = 0,
}: UseVideoScrollScrubOptions) {
  const rafId = useRef<number | null>(null);

  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  onReadyRef.current = onReady;
  onErrorRef.current = onError;

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const pin = pinRef.current;
    const video = videoRef.current;
    const intro = introRef.current;

    if (!section || !pin || !video || !intro) return;

    const mountId = Symbol("hero-video-mount");
    let activeMount = mountId;
    let ctx: gsap.Context | null = null;
    let scrollTrigger: ScrollTrigger | null = null;
    let cancelled = false;
    let ready = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let pendingProgress = 0;
    let lastIntroAlpha = -1;

    const scheduleFrame = () => {
      if (rafId.current !== null) return;

      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        if (cancelled || activeMount !== mountId) return;
        paintVideoFrame(
          video,
          pendingProgress * video.duration,
          HERO_SCROLL.videoFps,
        );
      });
    };

    const setup = () => {
      if (
        cancelled ||
        activeMount !== mountId ||
        ready ||
        !isVideoReady(video)
      ) {
        return;
      }

      ready = true;
      onReadyRef.current();

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add(
          {
            isReduced: "(prefers-reduced-motion: reduce)",
            isFull: "(prefers-reduced-motion: no-preference)",
          },
          (context) => {
            const { isReduced } = context.conditions as { isReduced: boolean };

            if (isReduced) {
              video.pause();
              video.currentTime = Math.min(
                video.duration * 0.92,
                video.duration - 0.05,
              );
              gsap.set(intro, { autoAlpha: 0 });
              return;
            }

            gsap.from(intro, {
              autoAlpha: 0,
              y: 24,
              duration: 1.2,
              ease: "power3.out",
              delay: 0.2,
            });

            scrollTrigger = ScrollTrigger.create({
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              pin,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                pendingProgress = self.progress;

                const introAlpha =
                  pendingProgress < HERO_SCROLL.introFadeEnd
                    ? 1 - pendingProgress / HERO_SCROLL.introFadeEnd
                    : 0;

                if (Math.abs(introAlpha - lastIntroAlpha) > 0.025) {
                  gsap.set(intro, { autoAlpha: introAlpha });
                  lastIntroAlpha = introAlpha;
                }

                scheduleFrame();
              },
            });
          },
        );
      }, section);

      ScrollTrigger.refresh();
      pendingProgress = scrollTrigger?.progress ?? 0;
      scheduleFrame();
    };

    const onVideoError = () => {
      if (cancelled || activeMount !== mountId || ready) return;
      if (isIgnorableVideoError(video)) return;
      onErrorRef.current();
    };

    const onVideoReady = () => {
      if (cancelled || activeMount !== mountId || ready) return;

      video.pause();

      const seekToStart = () => {
        paintVideoFrame(video, 0, HERO_SCROLL.videoFps);
        setup();
      };

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        seekToStart();
      } else {
        video.addEventListener("loadeddata", seekToStart, { once: true });
        try {
          video.currentTime = 0;
        } catch {
          // Wait for loadeddata when seek is not yet allowed.
        }
      }
    };

    const onCanPlay = () => {
      if (!ready && isVideoReady(video)) onVideoReady();
    };

    const scheduleRetry = () => {
      if (cancelled || activeMount !== mountId || ready) return;
      retryTimer = setTimeout(() => {
        if (cancelled || activeMount !== mountId || ready) return;
        video.load();
      }, 1200);
    };

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    video.addEventListener("loadedmetadata", onVideoReady);
    video.addEventListener("loadeddata", onCanPlay);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onVideoError);

    if (isVideoReady(video)) {
      onVideoReady();
    } else if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      video.load();
      scheduleRetry();
    } else {
      scheduleRetry();
    }

    return () => {
      cancelled = true;
      activeMount = Symbol("hero-video-unmounted");
      if (retryTimer) clearTimeout(retryTimer);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      video.removeEventListener("loadedmetadata", onVideoReady);
      video.removeEventListener("loadeddata", onCanPlay);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onVideoError);
      scrollTrigger?.kill();
      ctx?.revert();
    };
  }, [sectionRef, pinRef, videoRef, introRef, videoKey]);
}
