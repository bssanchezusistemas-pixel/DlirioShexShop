/** Extract storage object path from a public product-images URL. */
export function extractProductImagePath(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;
  const marker = "/product-images/";
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(imageUrl.slice(idx + marker.length).split("?")[0] ?? "");
}
