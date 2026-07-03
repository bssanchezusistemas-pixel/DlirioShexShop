import sharp from "sharp";

/** Max edge length; images are scaled down to fit inside without upscaling. */
export const COMPRESS_MAX_DIMENSION = 900;

/** WebP quality used for product images (matches catalog upload script). */
export const COMPRESS_WEBP_QUALITY = 78;

/**
 * Compress a product image: auto-rotate, resize to fit inside 900×900, output WebP.
 */
export async function compressImageBuffer(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .rotate()
    .resize(COMPRESS_MAX_DIMENSION, COMPRESS_MAX_DIMENSION, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: COMPRESS_WEBP_QUALITY, effort: 4 })
    .toBuffer();
}
