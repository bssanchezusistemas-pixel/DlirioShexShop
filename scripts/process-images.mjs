import fs from "fs";
import path from "path";
import sharp from "sharp";

export const PRODUCTS_51 = [
  {
    index: 1,
    sourceFile: "IMG-20260927-WA0006.jpg",
    id: "kit-fetiche-10-piezas",
    name: "Kit fetiche y bondage 10 piezas en cuero sintético",
    categoryId: "sadomasoquismo",
    price: 130000,
    badge: "Completo",
    image: "/catalog/kit-fetiche-10-piezas.webp",
    description: "Set completo fetiche de 10 piezas en cuero sintético de alta resistencia. Incluye esposas de manos y tobillos, antifaz, mordaza de bola, látigo, pluma, collar con correa, pinzas y cuerdas."
  },
  {
    index: 2,
    sourceFile: "IMG-20260927-WA0021.jpg",
    id: "mordaza-con-pezoneras",
    name: "Mordaza con pezoneras ajustables",
    categoryId: "sadomasoquismo",
    price: 45000,
    image: "/catalog/mordaza-con-pezoneras.webp",
    description: "Mordaza de bola en silicona suave con correas ajustables de cuero sintético y pinzas/pezoneras con cadena metálica extraíble."
  },
  {
    index: 3,
    sourceFile: "IMG-20260927-WA0046.jpg",
    id: "latigo-cuero-sintetico",
    name: "Látigo flogger en cuero sintético",
    categoryId: "sadomasoquismo",
    price: 35000,
    image: "/catalog/latigo-cuero-sintetico.webp",
    description: "Látigo tipo flogger con múltiples tiras en cuero sintético flexible y mango ergonómico con correa de seguridad."
  },
  {
    index: 4,
    sourceFile: "IMG-20260927-WA0034.jpg",
    id: "esposas-cuero-sintetico-peluche",
    name: "Esposas en cuero sintético con forro afelpado",
    categoryId: "sadomasoquismo",
    price: 35000,
    image: "/catalog/esposas-cuero-sintetico-peluche.webp",
    description: "Esposas ajustables de alta resistencia en cuero sintético con forro interno afelpado suave para máxima comodidad y seguridad."
  },
  {
    index: 5,
    sourceFile: "IMG-20260927-WA0013.jpg",
    id: "sen-aceite-aromaterapia-masajes-250ml",
    name: "Aceite corporal con feromonas para masajes — SEN ÍNTIMO 250 ml",
    categoryId: "sen-intimo",
    price: 50000,
    badge: "250 ml",
    image: "/catalog/sen-aceite-aromaterapia-masajes-250ml.webp",
    description: "Aceite corporal para masajes y aromaterapia erótica con feromonas. Presentación de 250 ml con dispensador spray. Textura sedosa de fácil deslizamiento."
  },
  {
    index: 6,
    sourceFile: "IMG-20260927-WA0028.jpg",
    id: "sen-lub-cum-sensitive-250ml",
    name: "Lubricante íntimo CUM Sensitive 250 ml — SEN ÍNTIMO",
    categoryId: "sen-intimo",
    price: 50000,
    image: "/catalog/sen-lub-cum-sensitive-250ml.webp",
    description: "Lubricante íntimo a base de agua que simula la eyaculación femenina. Ultra sedoso, cambia de color al frotarlo y cuenta con agradable sabor. Presentación 250 ml con dosificador."
  },
  {
    index: 7,
    sourceFile: "IMG-20260927-WA0041.jpg",
    id: "anal-eze-delicious-desensibilizante-5g",
    name: "Desensibilizante anal Anal Eze Delicious 5 g",
    categoryId: "dilatadores-desensibilizantes",
    price: 12000,
    image: "/catalog/anal-eze-delicious-desensibilizante-5g.webp",
    description: "Crema desensibilizante y relajante Anal Eze Delicious de 5 g para masaje y preparación íntima. Facilita la relajación muscular para mayor confort."
  },
  {
    index: 8,
    sourceFile: "IMG-20260927-WA0009.jpg",
    id: "meromacho-comprimido-x2",
    name: "Potenciador Mero Macho comprimido x2",
    categoryId: "potenciadores-masculinos",
    price: 8000,
    image: "/catalog/meromacho-comprimido-x2.webp",
    description: "Potenciador masculino natural en presentación de 2 tabletas comprimidas. Aumenta la firmeza, energía y resistencia masculina."
  },
  {
    index: 9,
    sourceFile: "IMG-20260927-WA0017.jpg",
    id: "piedra-jamaiquina-original",
    name: "Piedra Jamaiquina tradicional original",
    categoryId: "retardantes",
    price: 15000,
    image: "/catalog/piedra-jamaiquina-original.webp",
    description: "Piedra retardante natural de origen tradicional. Se disuelve con unas gotas de agua formando una emulsión tópica para prolongar la relación íntima."
  },
  {
    index: 10,
    sourceFile: "IMG-20260927-WA0025.jpg",
    id: "vibrador-traslucido-pilas-aaa",
    name: "Consolador vibrador traslúcido texturizado a pilas AAA",
    categoryId: "juguetes-mujeres",
    price: 60000,
    image: "/catalog/vibrador-traslucido-pilas-aaa.webp",
    description: "Vibrador texturizado elaborado en material traslúcido flexible con relieves estimulantes. Funciona con pilas AAA y cuenta con regulador giratorio."
  },
  {
    index: 11,
    sourceFile: "IMG-20260702-WA0086.jpg",
    id: "bala-vibradora-recargable-usb-cromada",
    name: "Bala vibradora cromada recargable USB",
    categoryId: "juguetes-mujeres",
    price: 70000,
    image: "/catalog/bala-vibradora-recargable-usb-cromada.webp",
    description: "Micro bala vibradora en elegante acabado cromado, 10 velocidades y modos de vibración, impermeable, silenciosa y recargable por USB."
  },
  {
    index: 12,
    sourceFile: "IMG-20260927-WA0037.jpg",
    id: "bala-vibradora-pila-9-modos",
    name: "Bala vibradora portátil a pila — 9 modos de vibración",
    categoryId: "juguetes-mujeres",
    price: 35000,
    image: "/catalog/bala-vibradora-pila-9-modos.webp",
    description: "Bala vibradora compacta de bolsillo (90 mm x 15 mm) con 9 modos de pulsación intensa. Acabado suave al tacto y botón en la base."
  },
  {
    index: 13,
    sourceFile: "IMG-20260702-WA0081.jpg",
    id: "bomba-vacio-alargadora-hombre-80k",
    name: "Bomba de vacío y cilindro de succión para hombre",
    categoryId: "juguetes-hombres",
    price: 80000,
    badge: "+18",
    image: "/catalog/bomba-vacio-alargadora-hombre-80k.webp",
    description: "Cilindro transparente graduado de 220 mm x 65 mm en ABS resistente con manguera flexible y mango ergonómico de succión manual."
  },
  {
    index: 14,
    sourceFile: "IMG-20260927-WA0007.jpg",
    id: "firefox-women-sobre-5g-12k",
    name: "Potenciador femenino Firefox Women sobre 5 g",
    categoryId: "potenciadores-femeninos",
    price: 12000,
    image: "/catalog/firefox-women-sobre-5g-12k.webp",
    description: "Estimulante íntimo femenino en sobre individual de 5 g. Ayuda a activar la excitación, lubricación y sensibilidad de forma natural."
  },
  {
    index: 15,
    sourceFile: "IMG-20260927-WA0011.jpg",
    id: "anal-blu-cerotabu-desensibilizante",
    name: "Desensibilizante anal Anal Blu Cerotabú",
    categoryId: "dilatadores-desensibilizantes",
    price: 12000,
    image: "/catalog/anal-blu-cerotabu-desensibilizante.webp",
    description: "Fórmula desensibilizante Cerotabú Anal Blu a base de agua con benzocaína para facilitar la relajación en la zona íntima."
  },
  {
    index: 16,
    sourceFile: "IMG-20260927-WA0015.jpg",
    id: "anillo-vibrador-basico",
    name: "Anillo vibrador eréctil básico con textura",
    categoryId: "juguetes-hombres",
    price: 15000,
    image: "/catalog/anillo-vibrador-basico.webp",
    description: "Anillo erector en silicona flexible con protuberancias estimulantes y micro vibrador superior para disfrute mutuo en pareja."
  },
  {
    index: 17,
    sourceFile: "IMG-20260927-WA0019.jpg",
    id: "sen-anillo-vibrador-masajeador",
    name: "Anillo vibrador masajeador personal — SEN ÍNTIMO",
    categoryId: "sen-intimo",
    price: 25000,
    image: "/catalog/sen-anillo-vibrador-masajeador.webp",
    description: "Anillo vibrador reutilizable Sen Íntimo en silicona elástica suave. Prolonga la erección, retarda la eyaculación y estimula a la pareja."
  },
  {
    index: 18,
    sourceFile: "IMG-20260927-WA0023.jpg",
    id: "vibrador-anal-doble-prostatico-10-modos",
    name: "Vibrador anal prostático y perineal — 10 modos",
    categoryId: "juguetes-hombres",
    price: 55000,
    image: "/catalog/vibrador-anal-doble-prostatico-10-modos.webp",
    description: "Estimulador prostático ergonómico con curva anatómica, textura de bolas y 10 patrones de vibración independiente."
  },
  {
    index: 19,
    sourceFile: "IMG-20260927-WA0027.jpg",
    id: "vibrador-conejo-doble-estimulacion-rosa",
    name: "Vibrador conejo de doble estimulación rosa y blanco",
    categoryId: "juguetes-mujeres",
    price: 90000,
    badge: "Popular",
    image: "/catalog/vibrador-conejo-doble-estimulacion-rosa.webp",
    description: "Vibrador estilo conejo en silicona sedosa con estimulador de clítoris y cuerpo curvado. Doble motor para estimulación simultánea."
  },
  {
    index: 20,
    sourceFile: "IMG-20260927-WA0029.jpg",
    id: "mini-wand-vibrador-microfono-recargable",
    name: "Mini vibrador masajeador tipo Wand / Micrófono",
    categoryId: "juguetes-mujeres",
    price: 90000,
    image: "/catalog/mini-wand-vibrador-microfono-recargable.webp",
    description: "Vibrador estilo varita mágica compacta en silicona fucsia. Cuenta con 8 velocidades y 20 modos de vibración, cabezal flexible y recarga USB."
  },
  {
    index: 21,
    sourceFile: "IMG-20260927-WA0032.jpg",
    id: "arnes-para-dildo-sencillo",
    name: "Arnés para dildo sencillo Soumission",
    categoryId: "sadomasoquismo",
    price: 45000,
    image: "/catalog/arnes-para-dildo-sencillo.webp",
    description: "Arnés ajustable con correas elásticas y panel frontal en cuero sintético con aro metálico compatible con dildos de base ancha."
  },
  {
    index: 22,
    sourceFile: "IMG-20260927-WA0036.jpg",
    id: "retardex-crema-tradicional-tarro",
    name: "Crema retardante Retardex tradicional",
    categoryId: "retardantes",
    price: 12000,
    image: "/catalog/retardex-crema-tradicional-tarro.webp",
    description: "Crema retardante clásica en práctico tarro con estuche dorado. Fórmula tópica para prolongar el rendimiento y control íntimo."
  },
  {
    index: 23,
    sourceFile: "IMG-20260927-WA0039.jpg",
    id: "plug-anal-acero-corazon-gema-morada",
    name: "Plug anal en acero corazón con gema amatista",
    categoryId: "juguetes-mujeres",
    sizes: [
      { label: "Talla S", price: 40000 },
      { label: "Talla M", price: 45000 }
    ],
    image: "/catalog/plug-anal-acero-corazon-gema-morada.webp",
    description: "Plug anal metálico en acero inoxidable con hermosa gema facetada en forma de corazón en la base color morado/amatista."
  },
  {
    index: 24,
    sourceFile: "IMG-20260927-WA0043.jpg",
    id: "rhino-cannabis-spray-retardante",
    name: "Spray retardante Rhino Cannabis",
    categoryId: "retardantes",
    price: 18000,
    image: "/catalog/rhino-cannabis-spray-retardante.webp",
    description: "Spray retardante masculino con extracto de cannabis para máxima relajación tópica y control eyaculatorio."
  },
  {
    index: 25,
    sourceFile: "IMG-20260927-WA0045.jpg",
    id: "sex-bull-potenciador-masculino-x2",
    name: "Potenciador masculino Sex Bull x2 tabletas",
    categoryId: "potenciadores-masculinos",
    price: 8000,
    image: "/catalog/sex-bull-potenciador-masculino-x2.webp",
    description: "Estimulante sexual masculino 100% natural. Estimula el flujo sanguíneo para una erección firme y duradera. Dosis: 1 tableta 30 min antes."
  },
  {
    index: 26,
    sourceFile: "IMG-20260927-WA0048.jpg",
    id: "big-penis-tabletas-masculinas",
    name: "Potenciador masculino Big Penis USA",
    categoryId: "potenciadores-masculinos",
    sizes: [
      { label: "Unidad (1 pastilla)", price: 8000 },
      { label: "Caja x3 pastillas", price: 18000 }
    ],
    image: "/catalog/big-penis-tabletas-masculinas.webp",
    description: "Estimulante sexual masculino Big Penis USA con ingredientes naturales que favorecen la vitalidad, resistencia y firmeza."
  },
  {
    index: 27,
    sourceFile: "IMG-20260927-WA0008.jpg",
    id: "sen-despigmentante-intimo-60ml",
    name: "Despigmentante y aclarador íntimo 60 ml — SEN ÍNTIMO",
    categoryId: "cuidado-intimo",
    price: 50000,
    badge: "60 ml",
    image: "/catalog/sen-despigmentante-intimo-60ml.webp",
    description: "Tratamiento despigmentante para zonas íntimas, axilas y entrepierna. Aclara y homogeneiza el tono natural de la piel. Registro NSOC09879-21CO."
  },
  {
    index: 28,
    sourceFile: "IMG-20260927-WA0010.jpg",
    id: "sexlove-chicles-libido-caja-x5",
    name: "Chicles estimulantes de libido Sexlove+ Fruit Flavor (caja x5)",
    categoryId: "potenciadores-femeninos",
    price: 15000,
    image: "/catalog/sexlove-chicles-libido-caja-x5.webp",
    description: "Gomas de mascar sabor frutal estimulantes para aumentar el deseo femenino y la excitación de forma rápida y práctica."
  },
  {
    index: 29,
    sourceFile: "IMG-20260927-WA0012.jpg",
    id: "arnes-con-dildo-realista",
    name: "Arnés con dildo realista color piel",
    categoryId: "sadomasoquismo",
    price: 100000,
    image: "/catalog/arnes-con-dildo-realista.webp",
    description: "Conjunto de arnés ajustable con dildo realista flexible color piel con textura detallada y base estable."
  },
  {
    index: 30,
    sourceFile: "IMG-20260927-WA0014.jpg",
    id: "xbull-liquido-hombre-sobre",
    name: "Potenciador bebible Xbull Energy Drink para hombre",
    categoryId: "potenciadores-masculinos",
    price: 12000,
    image: "/catalog/xbull-liquido-hombre-sobre.webp",
    description: "Bebida energizante y estimulante sexual masculino Xbull en sachet individual con extractos botánicos naturales."
  },
  {
    index: 31,
    sourceFile: "IMG-20260927-WA0016.jpg",
    id: "xbull-liquido-mujer-sobre",
    name: "Potenciador bebible Xbull Energy Drink para mujer",
    categoryId: "potenciadores-femeninos",
    price: 12000,
    image: "/catalog/xbull-liquido-mujer-sobre.webp",
    description: "Estimulante femenino líquido Xbull en sobre individual formulado para incentivar el deseo, lubricación y placer."
  },
  {
    index: 32,
    sourceFile: "IMG-20260927-WA0018.jpg",
    id: "rhino-retardante-masculino-crema-tarro",
    name: "Crema retardante Rhino Original estuche negro",
    categoryId: "retardantes",
    price: 12000,
    image: "/catalog/rhino-retardante-masculino-crema-tarro.webp",
    description: "Crema retardante masculina Rhino en pote con estuche. De rápida acción tópica para prolongar la relación íntima."
  },
  {
    index: 33,
    sourceFile: "IMG-20260927-WA0020.jpg",
    id: "spanish-gold-fly-sex-drops-sobre",
    name: "Estimulante femenino Spanish Gold Fly Sex Drops",
    categoryId: "potenciadores-femeninos",
    price: 12000,
    image: "/catalog/spanish-gold-fly-sex-drops-sobre.webp",
    description: "Gotas estimulantes femeninas en sachet individual dorado. Diseñadas para activar el deseo y la sensibilidad femenina."
  },
  {
    index: 34,
    sourceFile: "IMG-20260927-WA0022.jpg",
    id: "bomba-vacio-mujer-pussy-pump",
    name: "Bomba de vacío y estimulación íntima Pussy Pump",
    categoryId: "juguetes-mujeres",
    price: 90000,
    image: "/catalog/bomba-vacio-mujer-pussy-pump.webp",
    description: "Sistema de succión de vacío con copa transparente y borde de silicona suave diseñado para estimulación y sensibilidad femenina."
  },
  {
    index: 35,
    sourceFile: "IMG-20260927-WA0024.jpg",
    id: "stud-ejaculation-delay-spray-15ml",
    name: "Spray retardante Stud Ejaculation Delay Black Power 15 ml",
    categoryId: "retardantes",
    price: 45000,
    image: "/catalog/stud-ejaculation-delay-spray-15ml.webp",
    description: "Spray retardante masculino premium Stud Delay línea Black Power de 15 ml para control y mayor duración en la intimidad."
  },
  {
    index: 36,
    sourceFile: "IMG-20260927-WA0026.jpg",
    id: "rhino-dorado-spray-al-khartit",
    name: "Spray retardante Rhino Dorado Al Khartit",
    categoryId: "retardantes",
    price: 18000,
    image: "/catalog/rhino-dorado-spray-al-khartit.webp",
    description: "Spray retardante Rhino Cairo edición dorada. Aplicación rápida de 2 a 3 pulverizaciones sin dejar residuos ni sensación pegajosa."
  },
  {
    index: 37,
    sourceFile: "IMG-20260702-WA0067.jpg",
    id: "groben-penis-maxxx-pasta-roja",
    name: "Potenciador masculino Groben Penis MAXXX pasta",
    categoryId: "potenciadores-masculinos",
    price: 10000,
    image: "/catalog/groben-penis-maxxx-pasta-roja.webp",
    description: "Estimulante sexual masculino en pasta/sobre rojo. 100% natural, compatible con licor. Efecto duradero y mayor vigor."
  },
  {
    index: 38,
    sourceFile: "IMG-20260702-WA0066.jpg",
    id: "groben-penis-gold-pasta-dorada",
    name: "Potenciador masculino Groben Penis Gold pasta",
    categoryId: "potenciadores-masculinos",
    price: 10000,
    image: "/catalog/groben-penis-gold-pasta-dorada.webp",
    description: "Estimulante sexual masculino en pasta/sobre dorado. Fórmula natural líder en el mercado para mayor firmeza y energía masculina."
  },
  {
    index: 39,
    sourceFile: "IMG-20260927-WA0030.jpg",
    id: "vibrador-clasico-eco-pila-aa",
    name: "Vibrador clásico Eco a pila AA",
    categoryId: "juguetes-mujeres",
    price: 55000,
    image: "/catalog/vibrador-clasico-eco-pila-aa.webp",
    description: "Consolador vibrador clásico con relieve anatómico, base giratoria para ajuste de velocidad. Funciona con 1 pila AA."
  },
  {
    index: 40,
    sourceFile: "IMG-20260927-WA0031.jpg",
    id: "ducha-enema-anal-silicona",
    name: "Ducha higiénica para enema anal en silicona médica",
    categoryId: "cuidado-intimo",
    sizes: [
      { label: "Talla S (89 ml)", price: 25000 },
      { label: "Talla M (160 ml)", price: 32000 },
      { label: "Talla L (224 ml)", price: 40000 }
    ],
    image: "/catalog/ducha-enema-anal-silicona.webp",
    description: "Perilla para enema rectal y vaginal elaborada en silicona higiénica flexible con cánula suave desmontable."
  },
  {
    index: 41,
    sourceFile: "IMG-20260927-WA0033.jpg",
    id: "maxman-capsula-unidad-8k",
    name: "Potenciador masculino Maxman blister individual",
    categoryId: "potenciadores-masculinos",
    price: 8000,
    image: "/catalog/maxman-capsula-unidad-8k.webp",
    description: "Blister individual del suplemento Maxman para hombre. Estimula la potencia, resistencia y control sexual."
  },
  {
    index: 42,
    sourceFile: "IMG-20260927-WA0035.jpg",
    id: "cerotabu-beth-huevo-vibrador-remoto",
    name: "Huevo vibrador Cerotabú Beth con control remoto USB",
    categoryId: "juguetes-mujeres",
    price: 120000,
    badge: "Recargable",
    image: "/catalog/cerotabu-beth-huevo-vibrador-remoto.webp",
    description: "Huevo vibrador en silicona suave con control inalámbrico a distancia, múltiples ritmos de estimulación, recargable mediante cable USB."
  },
  {
    index: 43,
    sourceFile: "IMG-20260702-WA0063.jpg",
    id: "firefox-women-polvo-sobre-10k",
    name: "Estimulante femenino Firefox Women sobre individual",
    categoryId: "potenciadores-femeninos",
    price: 10000,
    image: "/catalog/firefox-women-polvo-sobre-10k.webp",
    description: "Estimulante sexual en sobre individual Firefox Bacchus Biotechnology. Ayuda a despertar la pasión y el deseo en la intimidad."
  },
  {
    index: 44,
    sourceFile: "IMG-20260927-WA0038.jpg",
    id: "retardex-cerotabu-crema-5g-12k",
    name: "Retardante Retardex Cerotabú crema 5 g",
    categoryId: "retardantes",
    price: 12000,
    image: "/catalog/retardex-cerotabu-crema-5g-12k.webp",
    description: "Retardante Retardex Cerotabú de 5 g con ingredientes naturales que ayudan a equilibrar la sensibilidad y prolongar el placer."
  },
  {
    index: 45,
    sourceFile: "IMG-20260927-WA0040.jpg",
    id: "ball-exotic-perlas-explosivas-x2",
    name: "Perlas lubricantes explosivas Forsexy Ball Exotic x2",
    categoryId: "lubricantes",
    price: 25000,
    image: "/catalog/ball-exotic-perlas-explosivas-x2.webp",
    description: "Perlas de masaje Forsexy Ball Exotic que estallan al frotar liberando un aceite lubricante térmico aromático de sensaciones placenteras."
  },
  {
    index: 46,
    sourceFile: "IMG-20260927-WA0042.jpg",
    id: "truly-aceite-post-afeitado-aclarador",
    name: "Aceite post-depilación y suavizante íntimo Truly",
    categoryId: "cuidado-intimo",
    price: 40000,
    image: "/catalog/truly-aceite-post-afeitado-aclarador.webp",
    description: "Aceite botánico corporal post-afeitado Truly (Soft Serve / Unicorn Fruit). Ayuda a calmar, nutrir y mantener la piel suave e hidratada."
  },
  {
    index: 47,
    sourceFile: "IMG-20260927-WA0044.jpg",
    id: "arnes-dildo-mars-series",
    name: "Arnés con dildo Mars Dildo Series",
    categoryId: "sadomasoquismo",
    price: 100000,
    image: "/catalog/arnes-dildo-mars-series.webp",
    description: "Set de arnés ergonómico con dildo anatómico Mars Dildo Series en caja de presentación. Correas ajustables para un acople perfecto."
  },
  {
    index: 48,
    sourceFile: "IMG-20260927-WA0005.jpg",
    id: "aroma-estimulante-hermin-flow-blush",
    name: "Aroma estimulante ambientador Hermin / Flow Blush",
    categoryId: "otros",
    price: 25000,
    image: "/catalog/aroma-estimulante-hermin-flow-blush.webp",
    description: "Aroma ambiental concentrado en frasco de vidrio hermético que brinda sensaciones de intensa relajación, motivación y energía sensorial."
  },
  {
    index: 49,
    sourceFile: "IMG-20260630-WA0039.jpg",
    id: "ropa-comestible-gummies-viking-cherry",
    name: "Ropa íntima comestible Gummies Viking Cherry 60 g",
    categoryId: "lenceria",
    price: 35000,
    image: "/catalog/ropa-comestible-gummies-viking-cherry.webp",
    description: "Lencería comestible elaborada en dulce gomita sabor a cereza/frutas. Peso neto 60 g. Diseñada para juegos sensuales en pareja."
  },
  {
    index: 50,
    sourceFile: "IMG-20260927-WA0047.jpg",
    id: "splash-intimo-feromonas-seduction-125ml",
    name: "Splash íntimo con feromonas Seduction 125 ml",
    categoryId: "cuidado-intimo",
    price: 20000,
    badge: "125 ml",
    image: "/catalog/splash-intimo-feromonas-seduction-125ml.webp",
    description: "Splash corporal e íntimo con feromonas Seduction 125 ml. Apto para la zona íntima, no altera el pH, aporta frescura, seguridad y aroma seductor."
  },
  {
    index: 51,
    sourceFile: "IMG-20260927-WA0049.jpg",
    id: "vibrador-sube-y-baja-telescopico-usb",
    name: "Vibrador telescópico sube y baja conejo recargable USB",
    categoryId: "juguetes-mujeres",
    price: 150000,
    badge: "Premium",
    image: "/catalog/vibrador-sube-y-baja-telescopico-usb.webp",
    description: "Vibrador estimulador telescópico automático con función de movimiento ascendente y descendente (sube y baja) y orejas estimuladoras en silicona médica recargable por USB."
  }
];

async function convertAllImages() {
  const sourceDir = path.join(process.cwd(), "temp_whatsapp");
  const targetDir = path.join(process.cwd(), "public", "catalog");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log(`Starting image conversion for ${PRODUCTS_51.length} products...`);

  for (const prod of PRODUCTS_51) {
    const srcPath = path.join(sourceDir, prod.sourceFile);
    const targetFilename = path.basename(prod.image);
    const dstPath = path.join(targetDir, targetFilename);

    if (!fs.existsSync(srcPath)) {
      console.error(`ERROR: Source file does not exist: ${srcPath}`);
      continue;
    }

    try {
      const buffer = await sharp(srcPath)
        .rotate()
        .resize(900, 900, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      fs.writeFileSync(dstPath, buffer);
      console.log(`[${prod.index}/51] Converted ${prod.sourceFile} -> ${targetFilename} (${Math.round(buffer.length / 1024)} KB)`);
    } catch (err) {
      console.error(`Failed to convert ${prod.sourceFile}:`, err);
    }
  }

  console.log("All conversions complete!");
}

if (process.argv[1]?.endsWith("process-images.mjs")) {
  convertAllImages();
}
