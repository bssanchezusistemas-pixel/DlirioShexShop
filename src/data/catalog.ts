export type CatalogCategoryId =
  | "lenceria"
  | "disfraces"
  | "lubricantes"
  | "sen-intimo"
  | "cuidado-intimo"
  | "retardantes"
  | "juguetes-hombres"
  | "juguetes-mujeres"
  | "potenciadores-femeninos"
  | "potenciadores-masculinos"
  | "dilatadores-desensibilizantes"
  | "sadomasoquismo"
  | "otros";

export interface CatalogItemSize {
  label: string;
  price: number;
  image?: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  price?: number;
  stock?: number;
  sizes?: CatalogItemSize[];
  image?: string;
  badge?: string;
  consultOnly?: boolean;
}

export interface CatalogCategory {
  id: CatalogCategoryId;
  label: string;
  tagline: string;
  accentColor?: string;
  items: CatalogItem[];
}

export const BUSINESS = {
  name: "Delirio X Sex Shop",
  tagline: "El arte del amor y el placer en un solo lugar",
  headline: "Todo en un solo lugar",
  subheadline:
    "Tienda erótica en Zarzal. Marcas reconocidas, atención discreta y domicilios gratis.",
  city: "Zarzal, Valle del Cauca",
  address: "Carrera 8 # 7-27, centro (enseguida de Arepas de Locura)",
  primaryWhatsApp: "573228319402",
  instagram: "https://www.instagram.com/delirioxsexshop/",
  deliveryNote: "Domicilios gratis en Zarzal",
  hours: "Consultar horario por WhatsApp",
  mapsQuery: "Carrera 8 #7-27, Zarzal, Valle del Cauca, Colombia",
  mapsEmbed:
    "https://maps.google.com/maps?q=Carrera+8+%237-27+Zarzal+Valle+del+Cauca&t=&z=17&ie=UTF8&iwloc=&output=embed",
};

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    id: "lenceria",
    label: "Lencería",
    tagline: "Seducción y estilo para cada ocasión",
    accentColor: "#e91e8c",
    items: [
      {
        id: "gummies-viking-cereza-60g",
        name: "Ropa íntima comestible Gummies Viking — Cereza",
        description:
          "Lencería comestible en gomas sabor cereza/frutas. Producto divertido para parejas. Peso neto 60 g. Ref: Ref03525.",
        price: 35000,
        image: "/catalog/gummies-viking-cereza-60g.webp",
        stock: 10,
      },
    ],
  },
  {
    id: "disfraces",
    label: "Disfraces",
    tagline: "Fantasías y role play",
    accentColor: "#f472b6",
    items: [],
  },
  {
    id: "lubricantes",
    label: "Lubricantes",
    tagline: "Lubricación suave con sabor",
    accentColor: "#ff6b35",
    items: [
      {
        id: "dsex-hot-oil-30ml",
        name: "Hot Oil Dsex shop labs — 30 ml",
        description:
          "Aceite y lubricante caliente saborizado para masaje. Lubricante comestible con sabor, línea Hot Oil de Dsex shop labs. Presentación 30 ml. Sabores disponibles: Chocolate, Piña colada, Maracuyá, Lechera, Chicle, Salpicón, Mora azul, Frutos rojos y Uva.",
        sizes: [
          { label: "Chocolate", price: 15000 },
          { label: "Piña colada", price: 15000 },
          { label: "Maracuyá", price: 15000 },
          { label: "Lechera", price: 15000 },
          { label: "Chicle", price: 15000 },
          { label: "Salpicón", price: 15000 },
          { label: "Mora azul", price: 15000 },
          { label: "Frutos rojos", price: 15000 },
          { label: "Uva", price: 15000 },
        ],
        image: "/catalog/dsex-hot-oil-30ml.webp",
        stock: 10,
      },
    ],
  },
  {
    id: "sen-intimo",
    label: "Sen íntimo",
    tagline: "Cosméticos íntimos con efectos únicos",
    accentColor: "#9b2fd4",
    items: [
      {
        id: "sen-lub-neutro-30ml",
        name: "Lubricante íntimo Neutro 30 ml",
        description:
          "Hipoalergénico, pH equilibrado. Lubricación suave, duradera y confortable. Compatible con condones y juguetes. Previene resequedad vaginal, reduce fricción, previene irritaciones.",
        price: 22000,
        image: "/catalog/sen-lub-neutro-30ml.webp",
        stock: 10,
      },
      {
        id: "sen-lub-neutro-1l",
        name: "Lubricante íntimo Neutro 1 L — SEN ÍNTIMO",
        description:
          "Lubricante íntimo a base de agua, pH balanceado, ideal para uso diario. Lubricación suave y duradera. Compatible con condones y juguetes. Previene resequedad vaginal y reduce fricción. Presentación 1 L. Fábrica del Placer / SEN ÍNTIMO.",
        price: 65000,
        image: "/catalog/sen-lub-neutro-1l.webp",
        stock: 10,
      },
      {
        id: "sen-lub-menta-fria-30ml",
        name: "Lubricante íntimo Menta 30 ml — Edición Especial",
        description:
          "SEN ÍNTIMO Edición Especial, 30 ml. Sensación fría con sabor menta. Seguro con preservativo. A base de agua, sedoso y suave al tacto. Fácil de lavar, no deja residuos ni manchas. Compatible con condones y juguetes. Registro INVIMA 2022DM-0024284.",
        price: 25000,
        image: "/catalog/sen-lub-menta-fria-30ml.webp",
        stock: 10,
      },
      {
        id: "sen-lub-sensacion-caliente-30ml",
        name: "Lubricante íntimo Sensación Caliente 30 ml",
        description:
          "SEN ÍNTIMO. Lubricante íntimo con sensación caliente. A base de agua, compatible con condones y juguetes. Presentación 30 ml. Sabores disponibles.",
        sizes: [
          {
            label: "Chocolate",
            price: 25000,
            image: "/catalog/sen-lub-sensacion-caliente-30ml-chocolate.webp",
          },
          {
            label: "Crema de whisky",
            price: 25000,
            image: "/catalog/sen-lub-sensacion-caliente-30ml-crema-whisky.webp",
          },
          {
            label: "Caramelo",
            price: 25000,
            image: "/catalog/sen-lub-sensacion-caliente-30ml-caramelo.webp",
          },
          {
            label: "Café Moka",
            price: 25000,
            image: "/catalog/sen-lub-sensacion-caliente-30ml-cafe-moka.webp",
          },
        ],
        image: "/catalog/sen-lub-sensacion-caliente-30ml-chocolate.webp",
        stock: 10,
      },
      {
        id: "sen-vibrador-liquido-electrizante-frio-5ml",
        name: "Vibrador líquido Electrizante Frío",
        description:
          "Gel vibrador líquido con sensación electrizante y fría. Potente, excitante e inolvidable. Aplicar pocas gotas. Contenido 5 ml.",
        price: 39000,
        image: "/catalog/sen-vibrador-liquido-electrizante-frio-5ml.webp",
        stock: 10,
      },
      {
        id: "sen-lub-cum-250ml",
        name: "Lubricante íntimo CUM — SEN ÍNTIMO",
        description:
          "Lubricante íntimo SEN ÍNTIMO línea CUM. Simula la eyaculación femenina. A base de agua, compatible con condones y juguetes. Presentación 250 ml con dispensador.",
        price: 50000,
        image: "/catalog/sen-lub-cum-250ml.webp",
        stock: 10,
      },
      {
        id: "sen-lub-estrechante-30ml",
        name: "Lubricante íntimo Estrechante — SEN ÍNTIMO",
        description:
          "Lubricante estrechante SEN ÍNTIMO. Tratamiento progresivo que devuelve la seguridad. Sensación de contracción del conducto vaginal para mayor contacto durante la penetración. Aplicar en la entrada vaginal 10 minutos antes de la relación. Presentación 30 ml.",
        price: 39000,
        image: "/catalog/sen-lub-estrechante-30ml.webp",
        stock: 10,
      },
    ],
  },
  {
    id: "cuidado-intimo",
    label: "Cuidado íntimo",
    tagline: "Cuidado y bienestar personal",
    accentColor: "#22d3ee",
    items: [
      {
        id: "cerotabu-adonis-ducha-anal",
        name: "Cerotabú Adonis — Ducha anal",
        description:
          "Ducha anal y vaginal unisex. Silicona médica de alta calidad, libre de ftalatos. Capacidad 220 ml. Desarmable para fácil limpieza. Marca Cerotabú / Roky.",
        sizes: [
          { label: "Talla S", price: 25000 },
          { label: "Talla M", price: 30000 },
          { label: "Talla L", price: 35000 },
        ],
        image: "/catalog/cerotabu-adonis-ducha-anal.webp",
        stock: 10,
      },
    ],
  },
  {
    id: "retardantes",
    label: "Retardantes",
    tagline: "Prolonga el placer y controla tus sensaciones",
    accentColor: "#ff2d95",
    items: [
      {
        id: "retardex-cerotabu",
        name: "Retardex Cerotabú",
        description:
          "Retardante 5 g. Prolonga tus momentos de placer y controla tus sensaciones. Ingredientes naturales que relajan y retrasan los impulsos nerviosos.",
        price: 8000,
        image: "/catalog/retardex-cerotabu.webp",
        stock: 10,
      },
      {
        id: "rhino-5ml",
        name: "Rhino 5 ml",
        description:
          "Spray retardante 5 ml. Nueva presentación, traído directamente desde Egipto. Producto 100% eficaz para prolongar el placer.",
        price: 18000,
        image: "/catalog/rhino-5ml.webp",
        stock: 10,
      },
      {
        id: "maxman-edicion-especial",
        name: "Maxman Edición Especial",
        description:
          "Suplemento ultra-long. Erecciones más potentes y duraderas, mayor resistencia sexual, control de eyaculación precoz y mejor circulación. Sin efecto rebote.",
        price: 8000,
        image: "/catalog/maxman-edicion-especial.webp",
        stock: 10,
      },
      {
        id: "retardante-rhino-crema",
        name: "Retardante Rhino (crema)",
        description:
          "Crema retardante de aplicación tópica. Prolonga el placer y ayuda a controlar la eyaculación. Presentación compacta con estuche.",
        price: 12000,
        image: "/catalog/retardante-rhino-crema.webp",
        stock: 10,
      },
      {
        id: "rhino-khartit-tubo",
        name: "Crema Rhino Khartit — tubo",
        description:
          "Crema retardante en tubo con estuche. Marca Rhino/Khartit, fórmula importada. Prolonga el placer y ayuda a controlar la eyaculación. Presentación tubo + caja.",
        price: 18000,
        image: "/catalog/rhino-khartit-tubo.webp",
        stock: 10,
      },
      {
        id: "dynamo-ultra-black-power-15ml",
        name: "Dynamo Ultra Black Power — Spray retardante",
        description:
          "Spray retardante para hombre. Línea Black Power. Prolonga el placer y ayuda a controlar la eyaculación. Presentación 15 ml con estuche. Ref: Ref05040.",
        price: 40000,
        image: "/catalog/dynamo-ultra-black-power-15ml.webp",
        stock: 10,
      },
      {
        id: "jamaican-stone",
        name: "Jamaican Stone",
        description:
          "Retardante natural en piedra tópica. Frotar la piedra con 3 gotas de agua durante 30 segundos hasta obtener un líquido lechoso; aplicar en el surco balano prepucial durante 15 minutos y luego lavar con agua y jabón. Advertencia: no exceder el tiempo ni la cantidad indicada.",
        price: 15000,
        image: "/catalog/jamaican-stone.webp",
        stock: 10,
      },
    ],
  },
  {
    id: "juguetes-hombres",
    label: "Juguetes para hombres",
    tagline: "Placer pensado para él",
    accentColor: "#38bdf8",
    items: [
      {
        id: "men-powerup-penis-pump",
        name: "Agrandador de pene — Men Powerup",
        description:
          "Cilindro en ABS para engrosar y alargar el pene. Bomba manual con manguera. Cilindro 220 mm × 65 mm. Marcas M, L y XL en el interior. Ref: RL35BA01-302. Producto +18.",
        price: 70000,
        image: "/catalog/men-powerup-penis-pump.webp",
        stock: 10,
        badge: "+18",
      },
    ],
  },
  {
    id: "juguetes-mujeres",
    label: "Juguetes para mujeres",
    tagline: "Placer pensado para ella",
    accentColor: "#ff2d95",
    items: [
      {
        id: "vib-huevo-control-remoto",
        name: "Vibrador huevo con control remoto",
        description:
          "Huevo vibrador rosa con control remoto inalámbrico. Diseño discreto, textura suave, cordón de extracción. Ideal para estimulación interna y externa.",
        price: 100000,
        image: "/catalog/vib-huevo-control-remoto.webp",
        stock: 10,
        badge: "Nuevo",
      },
      {
        id: "private-massager-control-remoto",
        name: "Private Massager — Vibrador con control remoto",
        description:
          "Vibrador huevo en silicona con control remoto inalámbrico. 18 funciones de vibración, impermeable, silencioso. Recargable por USB. Incluye cable de carga y empaque.",
        price: 90000,
        image: "/catalog/private-massager-control-remoto.webp",
        stock: 10,
        badge: "Nuevo",
      },
      {
        id: "vibrador-app-smartphone",
        name: "Vibrador con control por app",
        description:
          "Huevo vibrador en silicona controlado desde el celular vía app Bluetooth. 9 modos de vibración, impermeable. Modos Classic, Music, Shake y más. Recargable.",
        price: 100000,
        image: "/catalog/vibrador-app-smartphone.webp",
        stock: 10,
        badge: "Nuevo",
      },
      {
        id: "mini-bullet-vibrator",
        name: "Mini Bullet Vibrator — Vibrador bala",
        description:
          "Vibrador bala compacto en acabado cromado. 10 modos de vibración, impermeable, silencioso. Recargable por USB. Tamaño mini, ideal para llevar.",
        price: 70000,
        image: "/catalog/mini-bullet-vibrator.webp",
        stock: 10,
        badge: "Nuevo",
      },
      {
        id: "malawy-029-consolador",
        name: "Consolador Malawy 029",
        description:
          "Consolador con funda transparente texturizada, núcleo interno y base negra. Modelo Malawy 029. Estimulación intensa, material suave. Incluye empaque.",
        price: 60000,
        image: "/catalog/malawy-029-consolador.webp",
        stock: 10,
        badge: "Nuevo",
      },
      {
        id: "plug-anal-corazon-rosa",
        name: "Plug anal corazón rosa con gema",
        description:
          "Plug anal rosa perla con base en forma de corazón y gema rosa facetada. Material metálico/acrílico brillante. Diseño elegante para principiantes o uso decorativo.",
        price: 45000,
        image: "/catalog/plug-anal-corazon-rosa.webp",
        stock: 10,
        badge: "Nuevo",
      },
    ],
  },
  {
    id: "potenciadores-femeninos",
    label: "Potenciadores femeninos",
    tagline: "Deseo, lubricación y más placer",
    accentColor: "#e879f9",
    items: [
      {
        id: "gold-fly-original",
        name: "Original GOLD FLY™",
        description:
          "Afrodisíaco potente en sobres. Mejora el deseo y la sensibilidad, aumenta el placer y la excitación. Extracto natural de animales y plantas.",
        price: 12000,
        image: "/catalog/gold-fly-original.webp",
        stock: 10,
      },
      {
        id: "firefox-women-series",
        name: "Firefox Women Series",
        description:
          "Estimulante sexual femenino en sobres. Línea Women Series. Despierta tu deseo. Bacchus Biotechnology.",
        price: 10000,
        image: "/catalog/firefox-women-series.webp",
        stock: 10,
        badge: "Nuevo",
      },
      {
        id: "firefox-women-supplement-5g",
        name: "Firefox Women Supplement — Sobre 5 g",
        description:
          "Estimulante femenino en sobre 5 g. Polvo incoloro e inodoro. Bacchus Biotechnology. Aumenta el deseo, excita rápido, mejora la lubricación, efecto multiorgásmico. Compatible con líquidos y alcohol.",
        price: 12000,
        image: "/catalog/firefox-women-supplement-5g.webp",
        stock: 10,
      },
      {
        id: "groben-penis-fem",
        name: "Groben Penis Fem — Potenciador femenino",
        description:
          "Potenciador femenino en cápsula. Aumenta el apetito sexual, mejora la lubricación y la excitación. Efecto multiorgásmico. Presentación: 1 cápsula. Tomar 1 cápsula 1 hora antes. Compatible con licor.",
        price: 10000,
        image: "/catalog/groben-penis-fem.webp",
        stock: 10,
      },
      {
        id: "sexlove-plus-chewing-gum",
        name: "Sexlove+ Chewing Gum — Chiclet estimulante femenino",
        description:
          "Chiclet estimulante sexual femenino, sabor frutas. Aumenta la libido y el deseo sexual. Efecto desde 40 minutos, dura aproximadamente 2 horas. Compatible con licor. Se mastica como un chicle normal.",
        price: 12000,
        image: "/catalog/sexlove-plus-chewing-gum.webp",
        stock: 10,
      },
    ],
  },
  {
    id: "potenciadores-masculinos",
    label: "Potenciadores masculinos",
    tagline: "Más rendimiento, más confianza",
    accentColor: "#a855f7",
    items: [
      {
        id: "big-penis-honey",
        name: "Big Penis Honey",
        description:
          "Estimulante sexual masculino 100% natural. Ginseng, maca, miel y hierbas seleccionadas. Paquete con 12 sobres de 15 g. Tomar 1 sobre diluido en agua 30 min antes.",
        sizes: [
          { label: "Paquete x12 sobres", price: 18000 },
          { label: "Sobre individual", price: 7000 },
        ],
        image: "/catalog/big-penis-honey.webp",
        stock: 10,
      },
      {
        id: "groben-penis-gold",
        name: "Groben Penis Gold",
        description:
          "Estimulante masculino en sobre/pasta. 100% natural, compatible con licor. Potencializa la erección y retarda la eyaculación. Hasta 6 días como un toro.",
        price: 10000,
        image: "/catalog/groben-penis-gold.webp",
        stock: 10,
        badge: "Nuevo",
      },
      {
        id: "groben-penis-silver",
        name: "Groben Penis Silver",
        description:
          "Estimulante masculino en sobre plateado. Erección consistente, aumenta sensibilidad y apetito sexual, incrementa duración de erección y más confianza sexual. 100% natural, no adictivo. Apto para hipertensión y diabetes (según empaque).",
        price: 10000,
        image: "/catalog/groben-penis-silver.webp",
        stock: 10,
        badge: "Nuevo",
      },
      {
        id: "groben-penis-maxxx",
        name: "Groben Penis MAXXX",
        description:
          "Estimulante sexual masculino en sobre naranja. Efecto prolongado de 4 a 5 días por estimulación. 100% natural, compatible con licor. Potencializa la erección, retarda la eyaculación y promueve engrosamiento. Excelente para diabéticos (según empaque). Hasta 5 días como un rey.",
        price: 10000,
        image: "/catalog/groben-penis-maxxx.webp",
        stock: 10,
      },
    ],
  },
  {
    id: "dilatadores-desensibilizantes",
    label: "Dilatadores y desensibilizantes",
    tagline: "Progresión y control para mayor comodidad",
    accentColor: "#a78bfa",
    items: [],
  },
  {
    id: "sadomasoquismo",
    label: "Sadomasoquismo",
    tagline: "Bondage, control y exploración",
    accentColor: "#f43f5e",
    items: [
      {
        id: "kit-bondage-10-piezas",
        name: "Kit bondage 10 piezas",
        description:
          "Set completo para parejas: esposas ajustables, antifaz, mordaza, flogger, pluma, cuerda, collar con correa, pinzas y conectores. Material negro con herrajes plateados. Ideal para iniciación.",
        price: 30000,
        image: "/catalog/kit-bondage-10-piezas.webp",
        stock: 10,
        badge: "Nuevo",
      },
      {
        id: "set-bondage-anti-back-handcuffs",
        name: "Set bondage Anti-Back Handcuffs",
        description:
          "Arnés de bondage con collar acolchado en piel sintética, esposas para muñecas y correas ajustables. Sujeta las manos a la espalda. Incluye empaque. Role play para parejas.",
        price: 45000,
        image: "/catalog/set-bondage-anti-back-handcuffs.webp",
        stock: 10,
        badge: "Nuevo",
      },
    ],
  },
  {
    id: "otros",
    label: "Otros productos",
    tagline: "Accesorios y productos especiales",
    accentColor: "#a855f7",
    items: [],
  },
];

export function formatCOP(amount: number): string {
  if (amount <= 0) return "Consultar";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCartLineId(
  item: CatalogItem,
  selectedSize?: CatalogItemSize,
): string {
  return selectedSize ? `${item.id}::${selectedSize.label}` : item.id;
}

export function getLinePrice(
  item: CatalogItem,
  selectedSize?: CatalogItemSize,
): number {
  if (item.consultOnly) return 0;
  if (selectedSize) return selectedSize.price;
  if (item.price !== undefined) return item.price;
  return item.sizes?.[0]?.price ?? 0;
}

export function formatPriceDisplay(
  item: CatalogItem,
  selectedSize?: CatalogItemSize,
): string {
  if (item.consultOnly) return "Consultar";
  const price = getLinePrice(item, selectedSize);
  if (price <= 0) return "Consultar";
  return formatCOP(price);
}

export function formatCartLineName(
  item: CatalogItem,
  selectedSize?: CatalogItemSize,
): string {
  if (selectedSize) return `${item.name} (${selectedSize.label})`;
  return item.name;
}

export function buildWhatsAppUrl(
  message: string,
  phone = BUSINESS.primaryWhatsApp,
) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
