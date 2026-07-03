/**
 * One-off: compress flavor images for sen-lub-sensacion-caliente-30ml
 * into public/catalog/ and catalog-upload/images/
 */
import { mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const ASSETS = join(
  ROOT,
  "..",
  "..",
  ".cursor",
  "projects",
  "c-Users-User-Desktop-deliriox-sexshop",
  "assets",
);

const SOURCES = {
  chocolate:
    "c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-466631db-52b0-4d8c-8c17-06fd853913b5.png",
  "crema-whisky":
    "c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-17f22ead-b339-4a8f-9341-54ee512c0e4f.png",
  caramelo:
    "c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-4b6270ad-9ce7-4d6c-a1e5-022783c7ac43.png",
  group:
    "c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-f74db75a-e2be-4229-bd95-c93f85300831.png",
};

const OUT_DIR_PUBLIC = join(ROOT, "public", "catalog");
const OUT_DIR_UPLOAD = join(ROOT, "catalog-upload", "images");
const BASE = "sen-lub-sensacion-caliente-30ml";

async function toWebp(inputPath, outBase) {
  const buffer = await sharp(inputPath)
    .rotate()
    .resize(900, 900, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78, effort: 4 })
    .toBuffer();

  const webpName = `${outBase}.webp`;
  const pngName = `${outBase}.png`;

  await sharp(buffer).toFile(join(OUT_DIR_PUBLIC, webpName));
  await sharp(buffer).png().toFile(join(OUT_DIR_UPLOAD, pngName));

  console.log(`✓ ${webpName} (${Math.round(buffer.length / 1024)} KB)`);
}

async function cropCafeMoka(groupPath) {
  const meta = await sharp(groupPath).metadata();
  const w = meta.width ?? 1200;
  const h = meta.height ?? 900;

  // Café Moka is the rightmost box
  const cropW = Math.round(w * 0.22);
  const cropH = Math.round(h * 0.68);
  const left = w - cropW - Math.round(w * 0.04);
  const top = Math.round(h * 0.2);

  const cropped = await sharp(groupPath)
    .extract({ left, top, width: cropW, height: cropH })
    .rotate()
    .resize(900, 900, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78, effort: 4 })
    .toBuffer();

  const outBase = `${BASE}-cafe-moka`;
  await sharp(cropped).toFile(join(OUT_DIR_PUBLIC, `${outBase}.webp`));
  await sharp(cropped).png().toFile(join(OUT_DIR_UPLOAD, `${outBase}.png`));
  console.log(`✓ ${outBase}.webp (cropped from group)`);
}

async function main() {
  mkdirSync(OUT_DIR_PUBLIC, { recursive: true });
  mkdirSync(OUT_DIR_UPLOAD, { recursive: true });

  await toWebp(join(ASSETS, SOURCES.chocolate), `${BASE}-chocolate`);
  await toWebp(join(ASSETS, SOURCES["crema-whisky"]), `${BASE}-crema-whisky`);
  await toWebp(join(ASSETS, SOURCES.caramelo), `${BASE}-caramelo`);
  await cropCafeMoka(join(ASSETS, SOURCES.group));

  // Main product image for manifest upload (defaults to chocolate)
  await toWebp(join(ASSETS, SOURCES.chocolate), BASE);

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
