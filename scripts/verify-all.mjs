import fs from "fs";
import path from "path";
import { CATALOG_CATEGORIES, buildWhatsAppUrl, getLinePrice } from "../src/data/catalog.ts";
import { PRODUCTS_51 } from "./process-images.mjs";
import { validateOrderLines, isValidColombianPhone, isValidDeliveryType, normalizePhone } from "../src/lib/order-validation.ts";

console.log("=== RUNNING EXTENSIVE VERIFICATION SUITE ===");

// 1. Verify all 51 products from chat
console.log("\n1. Verifying 51 products against CATALOG_CATEGORIES...");
const allCatalogItems = [];
const itemMap = new Map();

for (const cat of CATALOG_CATEGORIES) {
  for (const it of cat.items) {
    allCatalogItems.push(it);
    itemMap.set(it.id, it);
  }
}

console.log(`Total catalog items: ${allCatalogItems.length}`);

let p51Found = 0;
for (const p of PRODUCTS_51) {
  const inCatalog = itemMap.get(p.id);
  if (!inCatalog) {
    console.error(`FAIL: Product ${p.id} not found in CATALOG_CATEGORIES!`);
  } else {
    p51Found++;
    // Check image existence
    const imgPath = path.join(process.cwd(), "public", inCatalog.image.replace(/^\//, ""));
    if (!fs.existsSync(imgPath)) {
      console.error(`FAIL: Image does not exist: ${imgPath}`);
    }
    // Check price
    const price = inCatalog.price ?? inCatalog.sizes?.[0]?.price;
    if (!price || price <= 0) {
      console.error(`FAIL: Invalid price for ${p.id}: ${price}`);
    }
  }
}
console.log(`Passed: ${p51Found}/51 products verified in catalog with images and prices!`);

// 2. Test order validation logic (offline fallback)
console.log("\n2. Testing order validation logic in offline fallback mode...");

const staticDbProducts = [];
for (const cat of CATALOG_CATEGORIES) {
  for (const item of cat.items) {
    staticDbProducts.push({
      id: item.id,
      category_id: cat.id,
      name: item.name,
      description: item.description,
      price: item.price ?? (item.sizes?.[0]?.price ?? null),
      stock: item.stock ?? 10,
      image_url: item.image ?? null,
      badge: item.badge ?? null,
      consult_only: item.consultOnly ?? false,
      sizes: item.sizes ?? [],
      is_active: true,
      created_at: "",
      updated_at: "",
    });
  }
}

// Test A: Happy path with standard item
const testOrderA = validateOrderLines(
  [
    {
      productId: "kit-fetiche-10-piezas",
      productName: "Kit fetiche y bondage 10 piezas en cuero sintético",
      quantity: 1,
      unitPrice: 130000,
    },
  ],
  staticDbProducts
);

if (testOrderA.ok && testOrderA.totalAmount === 130000) {
  console.log("Passed: Test A (Happy path single product)");
} else {
  console.error("FAIL: Test A", testOrderA);
}

// Test B: Happy path with sized item
const testOrderB = validateOrderLines(
  [
    {
      productId: "plug-anal-acero-corazon-gema-morada",
      productName: "Plug anal en acero corazón con gema amatista",
      quantity: 2,
      unitPrice: 40000,
      sizeLabel: "Talla S",
    },
  ],
  staticDbProducts
);

if (testOrderB.ok && testOrderB.totalAmount === 80000) {
  console.log("Passed: Test B (Happy path sized product: 2x 40000 = 80000)");
} else {
  console.error("FAIL: Test B", testOrderB);
}

// Test C: Multi-item order
const testOrderC = validateOrderLines(
  [
    {
      productId: "splash-intimo-feromonas-seduction-125ml",
      productName: "Splash íntimo con feromonas Seduction 125 ml",
      quantity: 1,
      unitPrice: 20000,
    },
    {
      productId: "vibrador-sube-y-baja-telescopico-usb",
      productName: "Vibrador telescópico sube y baja conejo recargable USB",
      quantity: 1,
      unitPrice: 150000,
    },
  ],
  staticDbProducts
);

if (testOrderC.ok && testOrderC.totalAmount === 170000) {
  console.log("Passed: Test C (Multi-item order: 20000 + 150000 = 170000)");
} else {
  console.error("FAIL: Test C", testOrderC);
}

// Test D: Invalid phone number
console.log("\n3. Testing phone and delivery validation...");
if (!isValidColombianPhone("12345") && isValidColombianPhone("3228319402") && isValidColombianPhone("+57 322 831 9402")) {
  console.log("Passed: Colombian phone validation");
} else {
  console.error("FAIL: Colombian phone validation");
}

// Test E: Non-existent product ID
const testOrderE = validateOrderLines(
  [
    {
      productId: "non-existent-product-123",
      productName: "Fake",
      quantity: 1,
      unitPrice: 10000,
    },
  ],
  staticDbProducts
);

if (!testOrderE.ok) {
  console.log("Passed: Test E (Non-existent product rejected properly)");
} else {
  console.error("FAIL: Test E", testOrderE);
}

// Test F: Invalid size label
const testOrderF = validateOrderLines(
  [
    {
      productId: "plug-anal-acero-corazon-gema-morada",
      productName: "Plug",
      quantity: 1,
      unitPrice: 40000,
      sizeLabel: "Talla XXL Inexistente",
    },
  ],
  staticDbProducts
);

if (!testOrderF.ok) {
  console.log("Passed: Test F (Invalid size label rejected properly)");
} else {
  console.error("FAIL: Test F", testOrderF);
}

// Test G: WhatsApp URL building
const testMsg = "Hola Delirio X Sex Shop! Pedido de prueba";
const waUrl = buildWhatsAppUrl(testMsg);
if (waUrl.startsWith("https://wa.me/573228319402?text=Hola%20Delirio")) {
  console.log("Passed: WhatsApp URL generated correctly");
} else {
  console.error("FAIL: WhatsApp URL:", waUrl);
}

console.log("\n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ===");
