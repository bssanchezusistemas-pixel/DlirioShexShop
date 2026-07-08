import sharp from "sharp";
import { isHeicLikeMime, sniffImageMime } from "@/lib/sniff-image";

/** Max edge length; images are scaled down to fit inside without upscaling. */
export const COMPRESS_MAX_DIMENSION = 900;

/** WebP quality used for product images (matches catalog upload script). */
export const COMPRESS_WEBP_QUALITY = 78;

/**
 * Compress a product image: auto-rotate, resize to fit inside 900×900, output WebP.
 */
export async function compressImageBuffer(input: Buffer): Promise<Buffer> {
  if (!input.byteLength) {
    throw new Error("empty_buffer");
  }

  const sniffed = sniffImageMime(input);
  if (sniffed && isHeicLikeMime(sniffed)) {
    throw new Error("heic_unsupported");
  }

  return sharp(input, { limitInputPixels: 40_000_000 })
    .rotate()
    .resize(COMPRESS_MAX_DIMENSION, COMPRESS_MAX_DIMENSION, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: COMPRESS_WEBP_QUALITY, effort: 4 })
    .toBuffer();
}
