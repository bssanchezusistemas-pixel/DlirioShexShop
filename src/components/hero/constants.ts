export const HERO_VIDEO_SRC = "/videos/hero-dliriox.mp4";

/** Extra scroll runway so the walkthrough feels unhurried (was 300vh). */
export const HERO_SCROLL_HEIGHT = "420vh";

export const HERO_COPY = {
  title: "DLIRIOX",
  subtitle: "Experiencias Eróticas & Boutique Sensorial",
} as const;

export const HERO_SCROLL = {
  introFadeEnd: 0.16,
  /** Frame-snapped seeks reduce jank while scrubbing. */
  videoFps: 30,
} as const;
