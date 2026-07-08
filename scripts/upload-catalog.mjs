/**
 * Aplica migraciones y sube catálogo con imágenes comprimidas.
 *
 * Uso:
 *   node scripts/setup-database.mjs
 *   node scripts/upload-catalog.mjs
 *
 * Coloca imágenes en catalog-upload/images/ y edita catalog-upload/manifest.json
 */
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, extname, basename } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import dotenv from "dotenv";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");

dotenv.config({ path: join(ROOT, ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function compressImage(inputPath) {
  const buffer = await sharp(inputPath)
    .rotate()
    .resize(900, 900, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78, effort: 4 })
    .toBuffer();

  const original = readFileSync(inputPath).length;
  const savings = Math.round((1 - buffer.length / original) * 100);
  return { buffer, size: buffer.length, savings };
}

async function uploadImage(buffer, productId) {
  const fileName = `${productId}-${Date.now()}.webp`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, buffer, {
      contentType: "image/webp",
      upsert: true,
    });

  if (error) throw new Error(`Storage: ${error.message}`);

  const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
  return data.publicUrl;
}

async function ensureSchema() {
  const migrationPath = join(ROOT, "supabase", "migrations", "001_initial_schema.sql");
  if (!existsSync(migrationPath)) {
    throw new Error("No se encontró 001_initial_schema.sql");
  }

  const sql = readFileSync(migrationPath, "utf8");
  const { error } = await supabase.rpc("exec_sql", { query: sql }).maybeSingle();

  if (error?.message?.includes("exec_sql")) {
    console.log(
      "⚠ No se puede aplicar schema automáticamente. Ejecuta manualmente en Supabase SQL Editor:",
    );
    console.log("   supabase/migrations/001_initial_schema.sql");
    console.log("   supabase/migrations/002_seed_catalog.sql");
    return false;
  }

  if (error) throw error;
  return true;
}

async function checkTables() {
  const { error } = await supabase.from("categories").select("id").limit(1);
  return !error;
}

async function seedCategories() {
  const seedPath = join(ROOT, "supabase", "migrations", "002_seed_catalog.sql");
  if (!existsSync(seedPath)) return;

  const categories = [
    { id: "juguetes", label: "Juguetes", tagline: "Variedad para explorar el placer", accent_color: "#ff2d95", sort_order: 1 },
    { id: "sen-intimo", label: "SEN ÍNTIMO", tagline: "Cosméticos íntimos con efectos únicos", accent_color: "#9b2fd4", sort_order: 2 },
    { id: "lubricantes", label: "Lubricantes", tagline: "Lubricación suave con sabor", accent_color: "#ff6b35", sort_order: 3 },
    { id: "retardantes", label: "Retardantes", tagline: "Prolonga el placer y controla tus sensaciones", accent_color: "#ff2d95", sort_order: 4 },
    { id: "estimulantes", label: "Estimulantes", tagline: "Más rendimiento, más confianza", accent_color: "#9b2fd4", sort_order: 5 },
    { id: "lenceria", label: "Lencería y fantasías", tagline: "Seducción y estilo para cada ocasión", accent_color: "#e91e8c", sort_order: 6 },
    { id: "higiene", label: "Higiene íntima", tagline: "Cuidado y bienestar personal", accent_color: "#22d3ee", sort_order: 7 },
    { id: "dilatadores", label: "Dilatadores", tagline: "Progresión suave para mayor comodidad", accent_color: "#c084fc", sort_order: 8 },
    { id: "desensibilizantes", label: "Desensibilizantes", tagline: "Reduce la sensibilidad para mayor control", accent_color: "#818cf8", sort_order: 9 },
    { id: "otros", label: "Otros", tagline: "Accesorios y productos especiales", accent_color: "#a855f7", sort_order: 10 },
  ];

  const { error } = await supabase.from("categories").upsert(categories, { onConflict: "id" });
  if (error) throw new Error(`Categorías: ${error.message}`);
}

async function uploadCatalog() {
  const manifestPath = join(ROOT, "catalog-upload", "manifest.json");
  const imagesDir = join(ROOT, "catalog-upload", "images");

  if (!existsSync(manifestPath)) {
    console.error("Crea catalog-upload/manifest.json — usa manifest.example.json como plantilla");
    process.exit(1);
  }

  const tablesOk = await checkTables();
  if (!tablesOk) {
    console.error("\n❌ Las tablas de Delirio no existen en Supabase.");
    console.error("   Ejecuta en SQL Editor los archivos de supabase/migrations/");
    console.error("   Y verifica que SUPABASE_SERVICE_ROLE_KEY sea del MISMO proyecto que la URL.\n");
    process.exit(1);
  }

  await seedCategories();

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const items = manifest.products ?? manifest;

  console.log(`\n📦 Subiendo ${items.length} productos...\n`);

  for (const item of items) {
    const id = item.id ?? slugify(item.name);
    let imageUrl = item.image_url ?? null;

    if (item.image) {
      const imagePath = join(imagesDir, item.image);
      if (!existsSync(imagePath)) {
        console.warn(`⚠ Imagen no encontrada: ${item.image} — se omite imagen`);
      } else {
        const { buffer, size, savings } = await compressImage(imagePath);
        imageUrl = await uploadImage(buffer, id);
        console.log(
          `🖼  ${item.name}: ${Math.round(size / 1024)} KB webp (−${savings}% vs original)`,
        );
      }
    }

    const product = {
      id,
      category_id: item.category_id ?? item.category ?? "juguetes",
      name: item.name,
      description: item.description ?? "",
      price: item.consult_only ? null : (item.price ?? null),
      stock: item.stock ?? 10,
      image_url: imageUrl,
      badge: item.badge ?? null,
      consult_only: item.consult_only ?? false,
      sizes: item.sizes ?? [],
      is_active: item.is_active ?? true,
    };

    const { error } = await supabase.from("products").upsert(product, { onConflict: "id" });
    if (error) {
      console.error(`❌ ${item.name}: ${error.message}`);
    } else {
      console.log(`✅ ${item.name} — ${item.price ? `$${item.price.toLocaleString("es-CO")}` : "Consultar"}`);
    }
  }

  console.log("\n✨ Catálogo actualizado.\n");
}

uploadCatalog().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
