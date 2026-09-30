import { copyFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import dotenv from "dotenv";
import https from "https";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");

dotenv.config({ path: join(ROOT, ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);

const PRODUCT_ID = "lubricante-intimo-multiorgasmos-euforia-30-ml";
const SOURCE_IMAGE =
  "C:/Users/User/.gemini/antigravity/brain/365025bd-bda4-44f7-a5d5-09d01ff2ac85/.user_uploaded/media_1790738494342.png";

async function run() {
  const webpBuffer = await sharp(SOURCE_IMAGE)
    .rotate()
    .resize(900, 900, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78, effort: 4 })
    .toBuffer();

  console.log("Compressed WebP size:", Math.round(webpBuffer.length / 1024), "KB");

  // Save local files
  mkdirSync(join(ROOT, "public", "catalog"), { recursive: true });
  mkdirSync(join(ROOT, "catalog-upload", "images"), { recursive: true });

  const localWebp = join(ROOT, "public", "catalog", `${PRODUCT_ID}.webp`);
  await sharp(webpBuffer).toFile(localWebp);
  console.log("Saved local WebP:", localWebp);

  const localPng = join(ROOT, "catalog-upload", "images", `${PRODUCT_ID}.png`);
  copyFileSync(SOURCE_IMAGE, localPng);
  console.log("Saved local PNG:", localPng);

  // Upload to Supabase Storage
  const storageFileName = `${PRODUCT_ID}-${Date.now()}.webp`;
  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(storageFileName, webpBuffer, {
      contentType: "image/webp",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(storageFileName);
  console.log("Uploaded to Supabase:", publicUrl);

  // Verify URL via HTTPS
  await new Promise((resolve) => {
    https.get(publicUrl, (res) => {
      console.log(
        "HTTPS check status:",
        res.statusCode,
        res.headers["content-type"],
        res.headers["content-length"]
      );
      resolve();
    });
  });

  // Update DB
  const { data: updatedProduct, error: updateError } = await supabase
    .from("products")
    .update({
      is_active: true,
      image_url: publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", PRODUCT_ID)
    .select()
    .single();

  if (updateError) throw updateError;

  console.log("\n✓ Product updated in DB successfully:");
  console.log(JSON.stringify(updatedProduct, null, 2));

  setTimeout(() => process.exit(0), 100);
}

run().catch((err) => {
  console.error("Error:", err);
  setTimeout(() => process.exit(1), 100);
});
