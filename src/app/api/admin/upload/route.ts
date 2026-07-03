import { NextResponse } from "next/server";
import { slugify } from "@/lib/catalog-mapper";
import { adminError } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/require-admin";

/** Max size after compression — bucket limit is 5 MB; keep output under 2 MB. */
const MAX_COMPRESSED_BYTES = 2 * 1024 * 1024;

const MAX_INPUT_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

const MIME_ALIASES: Record<string, string> = {
  "image/jpg": "image/jpeg",
  "image/pjpeg": "image/jpeg",
  "image/x-png": "image/png",
};

function resolveImageMime(file: File): string | null {
  const fromType = MIME_ALIASES[file.type] ?? file.type;
  if (fromType && ALLOWED_MIME.has(fromType)) return fromType;
  return null;
}

function sanitizeProductId(raw: string): string | null {
  const slug = slugify(raw);
  if (!slug || slug.length > 120) return null;
  return slug;
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const rawProductId = formData.get("productId")?.toString().trim();
  const safeProductId = rawProductId ? sanitizeProductId(rawProductId) : null;

  if (rawProductId && !safeProductId) {
    return NextResponse.json({ error: "ID de producto inválido" }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  }

  const mime = resolveImageMime(file);
  if (!mime) {
    return NextResponse.json(
      { error: "Formato no permitido. Usa JPG, PNG o WebP." },
      { status: 400 },
    );
  }

  if (file.size > MAX_INPUT_BYTES) {
    return NextResponse.json(
      { error: "La imagen no puede superar 5 MB" },
      { status: 413 },
    );
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());
  let compressed: Buffer;

  try {
    const { compressImageBuffer } = await import("@/lib/compress-image");
    compressed = await compressImageBuffer(inputBuffer);
  } catch {
    return NextResponse.json(
      { error: "No se pudo procesar la imagen. Verifica que el archivo sea válido." },
      { status: 400 },
    );
  }

  if (compressed.length > MAX_COMPRESSED_BYTES) {
    return NextResponse.json(
      {
        error:
          "La imagen comprimida supera 2 MB. Usa una imagen más pequeña o de menor resolución.",
      },
      { status: 413 },
    );
  }

  const fileName = safeProductId
    ? `${safeProductId}-${Date.now()}.webp`
    : `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

  const { error: uploadError } = await auth.supabase.storage
    .from("product-images")
    .upload(fileName, compressed, {
      contentType: "image/webp",
      upsert: false,
    });

  if (uploadError) {
    if (uploadError.message?.toLowerCase().includes("size")) {
      return NextResponse.json(
        { error: "La imagen supera el tamaño permitido (máx. 5 MB)." },
        { status: 413 },
      );
    }
    return adminError("Error al subir imagen", 500, uploadError);
  }

  const {
    data: { publicUrl },
  } = auth.supabase.storage.from("product-images").getPublicUrl(fileName);

  return NextResponse.json({ url: publicUrl });
}
