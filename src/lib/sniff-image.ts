/** MIME types accepted for product image uploads. */
export type SniffedImageMime =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/heic"
  | "image/heif"
  | "image/avif";

/**
 * Detect image format from file magic bytes (more reliable than browser MIME on Windows/mobile).
 */
export function sniffImageMime(buffer: Buffer): SniffedImageMime | null {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }

  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  if (buffer.toString("ascii", 4, 8) === "ftyp") {
    const brand = buffer.toString("ascii", 8, 12).toLowerCase();
    if (brand.startsWith("heic") || brand.startsWith("heix") || brand.startsWith("hevc")) {
      return "image/heic";
    }
    if (brand.startsWith("heif") || brand.startsWith("mif1") || brand.startsWith("msf1")) {
      return "image/heif";
    }
    if (brand.startsWith("avif")) {
      return "image/avif";
    }
  }

  return null;
}

export function isHeicLikeMime(mime: string): boolean {
  return mime === "image/heic" || mime === "image/heif";
}
