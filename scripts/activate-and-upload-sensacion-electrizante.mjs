import { readFileSync, copyFileSync, mkdirSync } from "fs";
import { join } from "path";
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
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PRODUCT_ID = "lubricantes-intimos-saborizados-de-sensacion-caliente-electrizante-30-ml";

const IMAGES = [
  {
    flavor: "mango",
    label: "Mango",
    price: 35000,
    sourcePath: "C:/Users/User/.gemini/antigravity/brain/365025bd-bda4-44f7-a5d5-09d01ff2ac85/.user_uploaded/media_1790738412838.png",
  },
  {
    flavor: "lychee",
    label: "Lychee",
    price: 35000,
    sourcePath: "C:/Users/User/.gemini/antigravity/brain/365025bd-bda4-44f7-a5d5-09d01ff2ac85/.user_uploaded/media_1790738423689.png",
  },
  {
    flavor: "crema-whisky",
    label: "Crema de Whisky",
    price: 35000,
    sourcePath: "C:/Users/User/.gemini/antigravity/brain/365025bd-bda4-44f7-a5d5-09d01ff2ac85/.user_uploaded/media_1790738430903.png",
  },
];

const OUT_DIR_PUBLIC = join(ROOT, "public", "catalog");
const OUT_DIR_UPLOAD = join(ROOT, "catalog-upload", "images");

async function compressImage(sourcePath) {
  return await sharp(sourcePath)
    .rotate()
    .resize(900, 900, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78, effort: 4 })
    .toBuffer();
}

async function uploadToStorage(buffer, fileName) {
  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, buffer, {
      contentType: "image/webp",
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload error for ${fileName}: ${error.message}`);
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
  return data.publicUrl;
}

async function run() {
  mkdirSync(OUT_DIR_PUBLIC, { recursive: true });
  mkdirSync(OUT_DIR_UPLOAD, { recursive: true });

  const now = Date.now();
  const updatedSizes = [];
  let mainImageUrl = "";

  for (let i = 0; i < IMAGES.length; i++) {
    const item = IMAGES[i];
    console.log(`\nProcessing ${item.label} (${item.flavor})...`);

    const webpBuffer = await compressImage(item.sourcePath);
    console.log(`  Compressed WebP size: ${Math.round(webpBuffer.length / 1024)} KB`);

    // 1. Save locally in public/catalog/
    const localWebpName = `${PRODUCT_ID}-${item.flavor}.webp`;
    await sharp(webpBuffer).toFile(join(OUT_DIR_PUBLIC, localWebpName));
    console.log(`  Saved ${join("public", "catalog", localWebpName)}`);

    // Also save in catalog-upload/images/
    const localPngName = `${PRODUCT_ID}-${item.flavor}.png`;
    copyFileSync(item.sourcePath, join(OUT_DIR_UPLOAD, localPngName));
    console.log(`  Saved ${join("catalog-upload", "images", localPngName)}`);

    // 2. Upload to Supabase Storage
    const storageFileName = `${PRODUCT_ID}-${item.flavor}-${now}.webp`;
    const publicUrl = await uploadToStorage(webpBuffer, storageFileName);
    console.log(`  Uploaded to Storage: ${publicUrl}`);

    if (i === 0) {
      // First image (Mango) is the main product image
      mainImageUrl = publicUrl;
      const mainWebpName = `${PRODUCT_ID}.webp`;
      await sharp(webpBuffer).toFile(join(OUT_DIR_PUBLIC, mainWebpName));
      console.log(`  Saved main product image ${join("public", "catalog", mainWebpName)}`);
    }

    updatedSizes.push({
      label: item.label,
      price: item.price,
      image: publicUrl,
    });
  }

  console.log("\nUpdating product in database...");
  const { data: updatedProduct, error: updateError } = await supabase
    .from("products")
    .update({
      is_active: true,
      image_url: mainImageUrl,
      sizes: updatedSizes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", PRODUCT_ID)
    .select()
    .single();

  if (updateError) {
    console.error("Error updating product:", updateError);
    process.exit(1);
  }

  console.log("\n✓ Product updated successfully!");
  console.log(JSON.stringify(updatedProduct, null, 2));
}

run()
  .then(() => {
    console.log("\nAll done!");
    setTimeout(() => process.exit(0), 200);
  })
  .catch((err) => {
    console.error("Execution failed:", err);
    setTimeout(() => process.exit(1), 200);
  });
