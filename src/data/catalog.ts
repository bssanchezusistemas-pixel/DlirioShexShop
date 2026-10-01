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
  /** Perfil de Google Business / Maps de la tienda */
  mapsUrl: "https://maps.app.goo.gl/UthQrPuKLnv5T7y67",
  mapsQuery: "DlirioShexShop, Zarzal, Valle del Cauca",
  mapsEmbed:
    "https://www.google.com/maps?cid=7982407492946917755&output=embed",
  latitude: 4.392338,
  longitude: -76.072052,
};

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    "id": "lenceria",
    "label": "Lencería",
    "tagline": "Seducción y estilo para cada ocasión",
    "accentColor": "#e91e8c",
    "items": [
      {
        "id": "gummies-viking-cereza-60g",
        "name": "Ropa íntima comestible Gummies Viking — Cereza",
        "description": "Lencería comestible en gomas sabor cereza/frutas. Producto divertido para parejas. Peso neto 60 g. Ref: Ref03525.",
        "price": 35000,
        "image": "/catalog/gummies-viking-cereza-60g.webp",
        "stock": 10
      }
    ]
  },
  {
    "id": "disfraces",
    "label": "Disfraces",
    "tagline": "Fantasías y role play",
    "accentColor": "#f472b6",
    "items": []
  },
  {
    "id": "lubricantes",
    "label": "Lubricantes",
    "tagline": "Lubricación suave con sabor",
    "accentColor": "#ff6b35",
    "items": [
      {
        "id": "dsex-hot-oil-30ml",
        "name": "Hot Oil Dsex shop labs — 30 ml",
        "description": "Aceite y lubricante caliente saborizado para masaje. Lubricante comestible con sabor, línea Hot Oil de Dsex shop labs. Presentación 30 ml. Sabores disponibles: Chocolate, Piña colada, Maracuyá, Lechera, Chicle, Salpicón, Mora azul, Frutos rojos y Uva.",
        "sizes": [
          {
            "label": "Chocolate",
            "price": 15000
          },
          {
            "label": "Piña colada",
            "price": 15000
          },
          {
            "label": "Maracuyá",
            "price": 15000
          },
          {
            "label": "Lechera",
            "price": 15000
          },
          {
            "label": "Chicle",
            "price": 15000
          },
          {
            "label": "Salpicón",
            "price": 15000
          },
          {
            "label": "Mora azul",
            "price": 15000
          },
          {
            "label": "Frutos rojos",
            "price": 15000
          },
          {
            "label": "Uva",
            "price": 15000
          }
        ],
        "image": "/catalog/dsex-hot-oil-30ml.webp",
        "stock": 10
      },
      {
        "id": "ball-exotic-perlas-explosivas-x2",
        "name": "Perlas lubricantes explosivas Forsexy Ball Exotic x2",
        "description": "Perlas de masaje Forsexy Ball Exotic que estallan al frotar liberando un aceite lubricante térmico aromático de sensaciones placenteras.",
        "image": "/catalog/ball-exotic-perlas-explosivas-x2.webp",
        "stock": 10,
        "price": 25000
      }
    ]
  },
  {
    "id": "sen-intimo",
    "label": "Sen íntimo",
    "tagline": "Cosméticos íntimos con efectos únicos",
    "accentColor": "#9b2fd4",
    "items": [
      {
        "id": "sen-lub-neutro-30ml",
        "name": "Lubricante íntimo Neutro 30 ml",
        "description": "Hipoalergénico, pH equilibrado. Lubricación suave, duradera y confortable. Compatible con preservativos y accesorios. Previene resequedad, reduce fricción.",
        "price": 22000,
        "image": "/catalog/sen-lub-neutro-30ml.webp",
        "stock": 10
      },
      {
        "id": "sen-lub-neutro-1l",
        "name": "Lubricante íntimo Neutro 1 L — SEN ÍNTIMO",
        "description": "Lubricante íntimo a base de agua, pH balanceado, ideal para uso frecuente. Lubricación suave y duradera. Compatible con preservativos y accesorios. Presentación 1 L. Fábrica del Placer / SEN ÍNTIMO.",
        "price": 65000,
        "image": "/catalog/sen-lub-neutro-1l.webp",
        "stock": 10
      },
      {
        "id": "sen-lub-menta-fria-30ml",
        "name": "Lubricante íntimo Menta 30 ml — Edición Especial",
        "description": "SEN ÍNTIMO Edición Especial, 30 ml. Sensación fría con sabor menta. Seguro con preservativo. A base de agua, sedoso y suave al tacto. Fácil de lavar, no deja residuos ni manchas.",
        "price": 25000,
        "image": "/catalog/sen-lub-menta-fria-30ml.webp",
        "stock": 10
      },
      {
        "id": "sen-lub-sensacion-caliente-30ml",
        "name": "Lubricante íntimo Sensación Caliente 30 ml",
        "description": "SEN ÍNTIMO. Lubricante íntimo con sensación caliente. A base de agua, compatible con preservativos y accesorios. Presentación 30 ml. Sabores disponibles.",
        "sizes": [
          {
            "label": "Chocolate",
            "price": 25000,
            "image": "/catalog/sen-lub-sensacion-caliente-30ml-chocolate.webp"
          },
          {
            "label": "Crema de whisky",
            "price": 25000,
            "image": "/catalog/sen-lub-sensacion-caliente-30ml-crema-whisky.webp"
          },
          {
            "label": "Caramelo",
            "price": 25000,
            "image": "/catalog/sen-lub-sensacion-caliente-30ml-caramelo.webp"
          },
          {
            "label": "Café Moka",
            "price": 25000,
            "image": "/catalog/sen-lub-sensacion-caliente-30ml-cafe-moka.webp"
          }
        ],
        "image": "/catalog/sen-lub-sensacion-caliente-30ml-chocolate.webp",
        "stock": 10
      },
      {
        "id": "sen-vibrador-liquido-electrizante-frio-5ml",
        "name": "Vibrador líquido Electrizante Frío",
        "description": "Gel vibrador líquido con sensación electrizante y fría. Efecto potente e inolvidable. Aplicar pocas gotas. Contenido 5 ml.",
        "price": 39000,
        "image": "/catalog/sen-vibrador-liquido-electrizante-frio-5ml.webp",
        "stock": 10
      },
      {
        "id": "sen-lub-cum-250ml",
        "name": "Lubricante íntimo CUM — SEN ÍNTIMO",
        "description": "Lubricante íntimo SEN ÍNTIMO línea CUM. Simula la eyaculación femenina. A base de agua, compatible con preservativos y accesorios. Presentación 250 ml con dispensador.",
        "price": 50000,
        "image": "/catalog/sen-lub-cum-250ml.webp",
        "stock": 10
      },
      {
        "id": "sen-lub-estrechante-30ml",
        "name": "Lubricante íntimo Estrechante — SEN ÍNTIMO",
        "description": "Lubricante estrechante SEN ÍNTIMO. Tratamiento progresivo que devuelve la seguridad. Sensación de contracción para mayor contacto íntimo. Presentación 30 ml.",
        "price": 39000,
        "image": "/catalog/sen-lub-estrechante-30ml.webp",
        "stock": 10
      },
      {
        "id": "sen-aceite-aromaterapia-masajes-250ml",
        "name": "Aceite corporal con feromonas para masajes — SEN ÍNTIMO 250 ml",
        "description": "Aceite corporal para masajes y aromaterapia erótica con feromonas. Presentación de 250 ml con dispensador spray. Textura sedosa de fácil deslizamiento.",
        "image": "/catalog/sen-aceite-aromaterapia-masajes-250ml.webp",
        "stock": 10,
        "price": 50000,
        "badge": "250 ml"
      },
      {
        "id": "sen-lub-cum-sensitive-250ml",
        "name": "Lubricante íntimo CUM Sensitive 250 ml — SEN ÍNTIMO",
        "description": "Lubricante íntimo a base de agua que simula la eyaculación femenina. Ultra sedoso, cambia de color al frotarlo y cuenta con agradable sabor. Presentación 250 ml con dosificador.",
        "image": "/catalog/sen-lub-cum-sensitive-250ml.webp",
        "stock": 10,
        "price": 50000
      },
      {
        "id": "sen-anillo-vibrador-masajeador",
        "name": "Anillo vibrador masajeador personal — SEN ÍNTIMO",
        "description": "Anillo vibrador reutilizable Sen Íntimo en silicona elástica suave. Prolonga la erección, retarda la eyaculación y estimula a la pareja.",
        "image": "/catalog/sen-anillo-vibrador-masajeador.webp",
        "stock": 10,
        "price": 25000
      }
    ]
  },
  {
    "id": "cuidado-intimo",
    "label": "Cuidado íntimo",
    "tagline": "Cuidado y bienestar personal",
    "accentColor": "#22d3ee",
    "items": [
      {
        "id": "cerotabu-adonis-ducha-anal",
        "name": "Cerotabú Adonis — Ducha anal",
        "description": "Ducha higiénica unisex. Silicona médica de alta calidad. Capacidad 220 ml. Desarmable para fácil limpieza. Marca Cerotabú / Roky.",
        "sizes": [
          {
            "label": "Talla S",
            "price": 25000
          },
          {
            "label": "Talla M",
            "price": 30000
          },
          {
            "label": "Talla L",
            "price": 35000
          }
        ],
        "image": "/catalog/cerotabu-adonis-ducha-anal.webp",
        "stock": 10
      },
      {
        "id": "sen-despigmentante-intimo-60ml",
        "name": "Despigmentante y aclarador íntimo 60 ml — SEN ÍNTIMO",
        "description": "Tratamiento despigmentante para zonas íntimas, axilas y entrepierna. Aclara y homogeneiza el tono natural de la piel. Registro NSOC09879-21CO.",
        "image": "/catalog/sen-despigmentante-intimo-60ml.webp",
        "stock": 10,
        "price": 50000,
        "badge": "60 ml"
      },
      {
        "id": "ducha-enema-anal-silicona",
        "name": "Ducha higiénica para enema anal en silicona médica",
        "description": "Perilla para enema rectal y vaginal elaborada en silicona higiénica flexible con cánula suave desmontable.",
        "image": "/catalog/ducha-enema-anal-silicona.webp",
        "stock": 10,
        "sizes": [
          {
            "label": "Talla S (89 ml)",
            "price": 25000
          },
          {
            "label": "Talla M (160 ml)",
            "price": 32000
          },
          {
            "label": "Talla L (224 ml)",
            "price": 40000
          }
        ]
      },
      {
        "id": "truly-aceite-post-afeitado-aclarador",
        "name": "Aceite post-depilación y suavizante íntimo Truly",
        "description": "Aceite botánico corporal post-afeitado Truly (Soft Serve / Unicorn Fruit). Ayuda a calmar, nutrir y mantener la piel suave e hidratada.",
        "image": "/catalog/truly-aceite-post-afeitado-aclarador.webp",
        "stock": 10,
        "price": 40000
      },
      {
        "id": "splash-intimo-feromonas-seduction-125ml",
        "name": "Splash íntimo con feromonas Seduction 125 ml",
        "description": "Splash corporal e íntimo con feromonas Seduction 125 ml. Apto para la zona íntima, no altera el pH, aporta frescura, seguridad y aroma seductor.",
        "image": "/catalog/splash-intimo-feromonas-seduction-125ml.webp",
        "stock": 10,
        "price": 20000,
        "badge": "125 ml"
      }
    ]
  },
  {
    "id": "retardantes",
    "label": "Retardantes",
    "tagline": "Prolonga el placer y controla tus sensaciones",
    "accentColor": "#ff2d95",
    "items": [
      {
        "id": "retardex-cerotabu",
        "name": "Retardex Cerotabú",
        "description": "Retardante 5 g. Prolonga tus momentos y controla tus sensaciones. Ingredientes naturales que relajan y retrasan los impulsos.",
        "price": 8000,
        "image": "/catalog/retardex-cerotabu.webp",
        "stock": 10
      },
      {
        "id": "rhino-5ml",
        "name": "Rhino 5 ml",
        "description": "Spray retardante 5 ml. Fórmula importada de alta eficacia para prolongar el encuentro.",
        "price": 18000,
        "image": "/catalog/rhino-5ml.webp",
        "stock": 10
      },
      {
        "id": "maxman-edicion-especial",
        "name": "Maxman Edición Especial",
        "description": "Suplemento ultra-long. Mayor resistencia, control de eyaculación y vigor sostenido.",
        "price": 8000,
        "image": "/catalog/maxman-edicion-especial.webp",
        "stock": 10
      },
      {
        "id": "retardante-rhino-crema",
        "name": "Retardante Rhino (crema)",
        "description": "Crema retardante de aplicación tópica. Prolonga el encuentro y ayuda al control íntimo.",
        "price": 12000,
        "image": "/catalog/retardante-rhino-crema.webp",
        "stock": 10
      },
      {
        "id": "rhino-khartit-tubo",
        "name": "Crema Rhino Khartit — tubo",
        "description": "Crema retardante en tubo con estuche. Marca Rhino/Khartit, fórmula importada. Prolonga el rendimiento íntimo.",
        "price": 18000,
        "image": "/catalog/rhino-khartit-tubo.webp",
        "stock": 10
      },
      {
        "id": "dynamo-ultra-black-power-15ml",
        "name": "Dynamo Ultra Black Power — Spray retardante",
        "description": "Spray retardante masculino. Línea Black Power. Prolonga el rendimiento y ayuda al control íntimo. Presentación 15 ml con estuche.",
        "price": 40000,
        "image": "/catalog/dynamo-ultra-black-power-15ml.webp",
        "stock": 10
      },
      {
        "id": "jamaican-stone",
        "name": "Jamaican Stone",
        "description": "Retardante tradicional en piedra tópica. Frotar con gotas de agua y aplicar suavemente para prolongar la duración.",
        "price": 15000,
        "image": "/catalog/jamaican-stone.webp",
        "stock": 10
      },
      {
        "id": "piedra-jamaiquina-original",
        "name": "Piedra Jamaiquina tradicional original",
        "description": "Piedra retardante natural de origen tradicional. Se disuelve con unas gotas de agua formando una emulsión tópica para prolongar la relación íntima.",
        "image": "/catalog/piedra-jamaiquina-original.webp",
        "stock": 10,
        "price": 15000
      },
      {
        "id": "retardex-crema-tradicional-tarro",
        "name": "Crema retardante Retardex tradicional",
        "description": "Crema retardante clásica en práctico tarro con estuche dorado. Fórmula tópica para prolongar el rendimiento y control íntimo.",
        "image": "/catalog/retardex-crema-tradicional-tarro.webp",
        "stock": 10,
        "price": 12000
      },
      {
        "id": "rhino-cannabis-spray-retardante",
        "name": "Spray retardante Rhino Cannabis",
        "description": "Spray retardante masculino con extracto de cannabis para máxima relajación tópica y control eyaculatorio.",
        "image": "/catalog/rhino-cannabis-spray-retardante.webp",
        "stock": 10,
        "price": 18000
      },
      {
        "id": "rhino-retardante-masculino-crema-tarro",
        "name": "Crema retardante Rhino Original estuche negro",
        "description": "Crema retardante masculina Rhino en pote con estuche. De rápida acción tópica para prolongar la relación íntima.",
        "image": "/catalog/rhino-retardante-masculino-crema-tarro.webp",
        "stock": 10,
        "price": 12000
      },
      {
        "id": "stud-ejaculation-delay-spray-15ml",
        "name": "Spray retardante Stud Ejaculation Delay Black Power 15 ml",
        "description": "Spray retardante masculino premium Stud Delay línea Black Power de 15 ml para control y mayor duración en la intimidad.",
        "image": "/catalog/stud-ejaculation-delay-spray-15ml.webp",
        "stock": 10,
        "price": 45000
      },
      {
        "id": "rhino-dorado-spray-al-khartit",
        "name": "Spray retardante Rhino Dorado Al Khartit",
        "description": "Spray retardante Rhino Cairo edición dorada. Aplicación rápida de 2 a 3 pulverizaciones sin dejar residuos ni sensación pegajosa.",
        "image": "/catalog/rhino-dorado-spray-al-khartit.webp",
        "stock": 10,
        "price": 18000
      },
      {
        "id": "retardex-cerotabu-crema-5g-12k",
        "name": "Retardante Retardex Cerotabú crema 5 g",
        "description": "Retardante Retardex Cerotabú de 5 g con ingredientes naturales que ayudan a equilibrar la sensibilidad y prolongar el placer.",
        "image": "/catalog/retardex-cerotabu-crema-5g-12k.webp",
        "stock": 10,
        "price": 12000
      }
    ]
  },
  {
    "id": "juguetes-hombres",
    "label": "Juguetes para hombres",
    "tagline": "Placer pensado para él",
    "accentColor": "#38bdf8",
    "items": [
      {
        "id": "men-powerup-penis-pump",
        "name": "Agrandador de succión — Men Powerup",
        "description": "Cilindro en ABS con marcas graduadas. Bomba manual con manguera flexible. Cilindro 220 mm × 65 mm. Producto +18.",
        "price": 70000,
        "image": "/catalog/men-powerup-penis-pump.webp",
        "stock": 10,
        "badge": "+18"
      },
      {
        "id": "anillo-vibrador-basico",
        "name": "Anillo vibrador eréctil básico con textura",
        "description": "Anillo erector en silicona flexible con protuberancias estimulantes y micro vibrador superior para disfrute mutuo en pareja.",
        "image": "/catalog/anillo-vibrador-basico.webp",
        "stock": 10,
        "price": 15000
      },
      {
        "id": "vibrador-anal-doble-prostatico-10-modos",
        "name": "Vibrador anal prostático y perineal — 10 modos",
        "description": "Estimulador prostático ergonómico con curva anatómica, textura de bolas y 10 patrones de vibración independiente.",
        "image": "/catalog/vibrador-anal-doble-prostatico-10-modos.webp",
        "stock": 10,
        "price": 55000
      }
    ]
  },
  {
    "id": "juguetes-mujeres",
    "label": "Juguetes para mujeres",
    "tagline": "Placer pensado para ella",
    "accentColor": "#ff2d95",
    "items": [
      {
        "id": "vib-huevo-control-remoto",
        "name": "Vibrador huevo con control remoto",
        "description": "Huevo vibrador rosa con control remoto inalámbrico. Diseño discreto, textura suave, cordón de extracción. Estimulación versátil.",
        "price": 100000,
        "image": "/catalog/vib-huevo-control-remoto.webp",
        "stock": 10,
        "badge": "Nuevo"
      },
      {
        "id": "private-massager-control-remoto",
        "name": "Private Massager — Vibrador con control remoto",
        "description": "Vibrador huevo en silicona con control remoto inalámbrico. 18 funciones de vibración, impermeable, silencioso. Recargable por USB.",
        "price": 90000,
        "image": "/catalog/private-massager-control-remoto.webp",
        "stock": 10,
        "badge": "Nuevo"
      },
      {
        "id": "vibrador-app-smartphone",
        "name": "Vibrador con control por app",
        "description": "Huevo vibrador en silicona controlado desde el celular vía app Bluetooth. 9 modos de vibración, impermeable. Recargable.",
        "price": 100000,
        "image": "/catalog/vibrador-app-smartphone.webp",
        "stock": 10,
        "badge": "Nuevo"
      },
      {
        "id": "mini-bullet-vibrator",
        "name": "Mini Bullet Vibrator — Vibrador bala",
        "description": "Vibrador bala compacto en acabado cromado. 10 modos de vibración, impermeable, silencioso. Recargable por USB.",
        "price": 70000,
        "image": "/catalog/mini-bullet-vibrator.webp",
        "stock": 10,
        "badge": "Nuevo"
      },
      {
        "id": "malawy-029-consolador",
        "name": "Consolador Malawy 029",
        "description": "Consolador con funda transparente texturizada, núcleo interno y base ventosa. Modelo Malawy 029. Estimulación intensa.",
        "price": 60000,
        "image": "/catalog/malawy-029-consolador.webp",
        "stock": 10,
        "badge": "Nuevo"
      },
      {
        "id": "plug-anal-corazon-rosa",
        "name": "Plug anal corazón rosa con gema",
        "description": "Plug anal en acabado metálico brillante con base en forma de corazón y gema facetada rosa. Diseño elegante.",
        "price": 45000,
        "image": "/catalog/plug-anal-corazon-rosa.webp",
        "stock": 10,
        "badge": "Nuevo"
      },
      {
        "id": "vibrador-traslucido-pilas-aaa",
        "name": "Consolador vibrador traslúcido texturizado a pilas AAA",
        "description": "Vibrador texturizado elaborado en material traslúcido flexible con relieves estimulantes. Funciona con pilas AAA y cuenta con regulador giratorio.",
        "image": "/catalog/vibrador-traslucido-pilas-aaa.webp",
        "stock": 10,
        "price": 60000
      },
      {
        "id": "bala-vibradora-recargable-usb-cromada",
        "name": "Bala vibradora cromada recargable USB",
        "description": "Micro bala vibradora en elegante acabado cromado, 10 velocidades y modos de vibración, impermeable, silenciosa y recargable por USB.",
        "image": "/catalog/bala-vibradora-recargable-usb-cromada.webp",
        "stock": 10,
        "price": 70000
      },
      {
        "id": "bala-vibradora-pila-9-modos",
        "name": "Bala vibradora portátil a pila — 9 modos de vibración",
        "description": "Bala vibradora compacta de bolsillo (90 mm x 15 mm) con 9 modos de pulsación intensa. Acabado suave al tacto y botón en la base.",
        "image": "/catalog/bala-vibradora-pila-9-modos.webp",
        "stock": 10,
        "price": 35000
      },
      {
        "id": "vibrador-conejo-doble-estimulacion-rosa",
        "name": "Vibrador conejo de doble estimulación rosa y blanco",
        "description": "Vibrador estilo conejo en silicona sedosa con estimulador de clítoris y cuerpo curvado. Doble motor para estimulación simultánea.",
        "image": "/catalog/vibrador-conejo-doble-estimulacion-rosa.webp",
        "stock": 10,
        "price": 90000,
        "badge": "Popular"
      },
      {
        "id": "mini-wand-vibrador-microfono-recargable",
        "name": "Mini vibrador masajeador tipo Wand / Micrófono",
        "description": "Vibrador estilo varita mágica compacta en silicona fucsia. Cuenta con 8 velocidades y 20 modos de vibración, cabezal flexible y recarga USB.",
        "image": "/catalog/mini-wand-vibrador-microfono-recargable.webp",
        "stock": 10,
        "price": 90000
      },
      {
        "id": "plug-anal-acero-corazon-gema-morada",
        "name": "Plug anal en acero corazón con gema amatista",
        "description": "Plug anal metálico en acero inoxidable con hermosa gema facetada en forma de corazón en la base color morado/amatista.",
        "image": "/catalog/plug-anal-acero-corazon-gema-morada.webp",
        "stock": 10,
        "sizes": [
          {
            "label": "Talla S",
            "price": 40000
          },
          {
            "label": "Talla M",
            "price": 45000
          }
        ]
      },
      {
        "id": "bomba-vacio-mujer-pussy-pump",
        "name": "Bomba de vacío y estimulación íntima Pussy Pump",
        "description": "Sistema de succión de vacío con copa transparente y borde de silicona suave diseñado para estimulación y sensibilidad femenina.",
        "image": "/catalog/bomba-vacio-mujer-pussy-pump.webp",
        "stock": 10,
        "price": 90000
      },
      {
        "id": "vibrador-clasico-eco-pila-aa",
        "name": "Vibrador clásico Eco a pila AA",
        "description": "Consolador vibrador clásico con relieve anatómico, base giratoria para ajuste de velocidad. Funciona con 1 pila AA.",
        "image": "/catalog/vibrador-clasico-eco-pila-aa.webp",
        "stock": 10,
        "price": 55000
      },
      {
        "id": "cerotabu-beth-huevo-vibrador-remoto",
        "name": "Huevo vibrador Cerotabú Beth con control remoto USB",
        "description": "Huevo vibrador en silicona suave con control inalámbrico a distancia, múltiples ritmos de estimulación, recargable mediante cable USB.",
        "image": "/catalog/cerotabu-beth-huevo-vibrador-remoto.webp",
        "stock": 10,
        "price": 120000,
        "badge": "Recargable"
      },
      {
        "id": "vibrador-sube-y-baja-telescopico-usb",
        "name": "Vibrador telescópico sube y baja conejo recargable USB",
        "description": "Vibrador estimulador telescópico automático con función de movimiento ascendente y descendente (sube y baja) y orejas estimuladoras en silicona médica recargable por USB.",
        "image": "/catalog/vibrador-sube-y-baja-telescopico-usb.webp",
        "stock": 10,
        "price": 150000,
        "badge": "Premium"
      }
    ]
  },
  {
    "id": "potenciadores-femeninos",
    "label": "Potenciadores femeninos",
    "tagline": "Deseo, lubricación y más placer",
    "accentColor": "#e879f9",
    "items": [
      {
        "id": "gold-fly-original",
        "name": "Original GOLD FLY™",
        "description": "Afrodisíaco potente en sobres. Mejora el deseo y la sensibilidad, aumenta el disfrute íntimo.",
        "price": 12000,
        "image": "/catalog/gold-fly-original.webp",
        "stock": 10
      },
      {
        "id": "firefox-women-series",
        "name": "Firefox Women Series",
        "description": "Estimulante sexual femenino en sobres. Línea Women Series. Despierta tu deseo. Bacchus Biotechnology.",
        "price": 10000,
        "image": "/catalog/firefox-women-series.webp",
        "stock": 10,
        "badge": "Nuevo"
      },
      {
        "id": "firefox-women-supplement-5g",
        "name": "Firefox Women Supplement — Sobre 5 g",
        "description": "Estimulante femenino en sobre 5 g. Polvo incoloro e inodoro. Aumenta el deseo y la lubricación. Compatible con líquidos.",
        "price": 12000,
        "image": "/catalog/firefox-women-supplement-5g.webp",
        "stock": 10
      },
      {
        "id": "groben-penis-fem",
        "name": "Groben Penis Fem — Potenciador femenino",
        "description": "Potenciador femenino en cápsula. Aumenta el apetito íntimo, mejora la lubricación y la sensibilidad.",
        "price": 10000,
        "image": "/catalog/groben-penis-fem.webp",
        "stock": 10
      },
      {
        "id": "sexlove-plus-chewing-gum",
        "name": "Sexlove+ Chewing Gum — Chiclet estimulante femenino",
        "description": "Chiclet estimulante femenino, sabor frutas. Aumenta la libido y el deseo. Se consume como un chicle normal.",
        "price": 12000,
        "image": "/catalog/sexlove-plus-chewing-gum.webp",
        "stock": 10
      },
      {
        "id": "firefox-women-sobre-5g-12k",
        "name": "Potenciador femenino Firefox Women sobre 5 g",
        "description": "Estimulante íntimo femenino en sobre individual de 5 g. Ayuda a activar la excitación, lubricación y sensibilidad de forma natural.",
        "image": "/catalog/firefox-women-sobre-5g-12k.webp",
        "stock": 10,
        "price": 12000
      },
      {
        "id": "sexlove-chicles-libido-caja-x5",
        "name": "Chicles estimulantes de libido Sexlove+ Fruit Flavor (caja x5)",
        "description": "Gomas de mascar sabor frutal estimulantes para aumentar el deseo femenino y la excitación de forma rápida y práctica.",
        "image": "/catalog/sexlove-chicles-libido-caja-x5.webp",
        "stock": 10,
        "price": 15000
      },
      {
        "id": "xbull-liquido-mujer-sobre",
        "name": "Potenciador bebible Xbull Energy Drink para mujer",
        "description": "Estimulante femenino líquido Xbull en sobre individual formulado para incentivar el deseo, lubricación y placer.",
        "image": "/catalog/xbull-liquido-mujer-sobre.webp",
        "stock": 10,
        "price": 12000
      },
      {
        "id": "spanish-gold-fly-sex-drops-sobre",
        "name": "Estimulante femenino Spanish Gold Fly Sex Drops",
        "description": "Gotas estimulantes femeninas en sachet individual dorado. Diseñadas para activar el deseo y la sensibilidad femenina.",
        "image": "/catalog/spanish-gold-fly-sex-drops-sobre.webp",
        "stock": 10,
        "price": 12000
      },
      {
        "id": "firefox-women-polvo-sobre-10k",
        "name": "Estimulante femenino Firefox Women sobre individual",
        "description": "Estimulante sexual en sobre individual Firefox Bacchus Biotechnology. Ayuda a despertar la pasión y el deseo en la intimidad.",
        "image": "/catalog/firefox-women-polvo-sobre-10k.webp",
        "stock": 10,
        "price": 10000
      }
    ]
  },
  {
    "id": "potenciadores-masculinos",
    "label": "Potenciadores masculinos",
    "tagline": "Más rendimiento, más confianza",
    "accentColor": "#a855f7",
    "items": [
      {
        "id": "big-penis-honey",
        "name": "Big Penis Honey",
        "description": "Estimulante masculino 100% natural. Ginseng, maca, miel y hierbas seleccionadas. Tomar 1 sobre diluido en agua 30 min antes.",
        "sizes": [
          {
            "label": "Paquete x12 sobres",
            "price": 18000
          },
          {
            "label": "Sobre individual",
            "price": 7000
          }
        ],
        "image": "/catalog/big-penis-honey.webp",
        "stock": 10
      },
      {
        "id": "groben-penis-gold",
        "name": "Groben Penis Gold",
        "description": "Estimulante masculino en pasta/sobre. 100% natural, compatible con bebidas. Potencializa la firmeza y retarda la eyaculación.",
        "price": 10000,
        "image": "/catalog/groben-penis-gold.webp",
        "stock": 10,
        "badge": "Nuevo"
      },
      {
        "id": "groben-penis-silver",
        "name": "Groben Penis Silver",
        "description": "Estimulante masculino en sobre plateado. Firmeza consistente, mayor apetito íntimo y confianza.",
        "price": 10000,
        "image": "/catalog/groben-penis-silver.webp",
        "stock": 10,
        "badge": "Nuevo"
      },
      {
        "id": "groben-penis-maxxx",
        "name": "Groben Penis MAXXX",
        "description": "Estimulante masculino en sobre naranja. Efecto prolongado por estimulación. 100% natural, compatible con bebidas.",
        "price": 10000,
        "image": "/catalog/groben-penis-maxxx.webp",
        "stock": 10
      },
      {
        "id": "meromacho-comprimido-x2",
        "name": "Potenciador Mero Macho comprimido x2",
        "description": "Potenciador masculino natural en presentación de 2 tabletas comprimidas. Aumenta la firmeza, energía y resistencia masculina.",
        "image": "/catalog/meromacho-comprimido-x2.webp",
        "stock": 10,
        "price": 8000
      },
      {
        "id": "sex-bull-potenciador-masculino-x2",
        "name": "Potenciador masculino Sex Bull x2 tabletas",
        "description": "Estimulante sexual masculino 100% natural. Estimula el flujo sanguíneo para una erección firme y duradera. Dosis: 1 tableta 30 min antes.",
        "image": "/catalog/sex-bull-potenciador-masculino-x2.webp",
        "stock": 10,
        "price": 8000
      },
      {
        "id": "big-penis-tabletas-masculinas",
        "name": "Potenciador masculino Big Penis USA",
        "description": "Estimulante sexual masculino Big Penis USA con ingredientes naturales que favorecen la vitalidad, resistencia y firmeza.",
        "image": "/catalog/big-penis-tabletas-masculinas.webp",
        "stock": 10,
        "sizes": [
          {
            "label": "Unidad (1 pastilla)",
            "price": 8000
          },
          {
            "label": "Caja x3 pastillas",
            "price": 18000
          }
        ]
      },
      {
        "id": "xbull-liquido-hombre-sobre",
        "name": "Potenciador bebible Xbull Energy Drink para hombre",
        "description": "Bebida energizante y estimulante sexual masculino Xbull en sachet individual con extractos botánicos naturales.",
        "image": "/catalog/xbull-liquido-hombre-sobre.webp",
        "stock": 10,
        "price": 12000
      },
      {
        "id": "groben-penis-maxxx-pasta-roja",
        "name": "Potenciador masculino Groben Penis MAXXX pasta",
        "description": "Estimulante sexual masculino en pasta/sobre rojo. 100% natural, compatible con licor. Efecto duradero y mayor vigor.",
        "image": "/catalog/groben-penis-maxxx-pasta-roja.webp",
        "stock": 10,
        "price": 10000
      },
      {
        "id": "groben-penis-gold-pasta-dorada",
        "name": "Potenciador masculino Groben Penis Gold pasta",
        "description": "Estimulante sexual masculino en pasta/sobre dorado. Fórmula natural líder en el mercado para mayor firmeza y energía masculina.",
        "image": "/catalog/groben-penis-gold-pasta-dorada.webp",
        "stock": 10,
        "price": 10000
      },
      {
        "id": "maxman-capsula-unidad-8k",
        "name": "Potenciador masculino Maxman blister individual",
        "description": "Blister individual del suplemento Maxman para hombre. Estimula la potencia, resistencia y control sexual.",
        "image": "/catalog/maxman-capsula-unidad-8k.webp",
        "stock": 10,
        "price": 8000
      }
    ]
  },
  {
    "id": "dilatadores-desensibilizantes",
    "label": "Dilatadores y desensibilizantes",
    "tagline": "Progresión y control para mayor comodidad",
    "accentColor": "#a78bfa",
    "items": [
      {
        "id": "anal-eze-delicious-desensibilizante-5g",
        "name": "Desensibilizante anal Anal Eze Delicious 5 g",
        "description": "Crema desensibilizante y relajante Anal Eze Delicious de 5 g para masaje y preparación íntima. Facilita la relajación muscular para mayor confort.",
        "image": "/catalog/anal-eze-delicious-desensibilizante-5g.webp",
        "stock": 10,
        "price": 12000
      },
      {
        "id": "anal-blu-cerotabu-desensibilizante",
        "name": "Desensibilizante anal Anal Blu Cerotabú",
        "description": "Fórmula desensibilizante Cerotabú Anal Blu a base de agua con benzocaína para facilitar la relajación en la zona íntima.",
        "image": "/catalog/anal-blu-cerotabu-desensibilizante.webp",
        "stock": 10,
        "price": 12000
      }
    ]
  },
  {
    "id": "sadomasoquismo",
    "label": "Sadomasoquismo",
    "tagline": "Bondage, control y exploración",
    "accentColor": "#f43f5e",
    "items": [
      {
        "id": "kit-bondage-10-piezas",
        "name": "Kit bondage 10 piezas",
        "description": "Set para parejas: esposas ajustables, antifaz, mordaza, látigo, pluma, cuerda, collar con correa, pinzas. Material negro con herrajes.",
        "price": 30000,
        "image": "/catalog/kit-bondage-10-piezas.webp",
        "stock": 10,
        "badge": "Nuevo"
      },
      {
        "id": "set-bondage-anti-back-handcuffs",
        "name": "Set bondage Anti-Back Handcuffs",
        "description": "Arnés con collar acolchado en cuero sintético, esposas para muñecas y correas ajustables para inmovilización a la espalda.",
        "price": 45000,
        "image": "/catalog/set-bondage-anti-back-handcuffs.webp",
        "stock": 10,
        "badge": "Nuevo"
      },
      {
        "id": "kit-fetiche-10-piezas",
        "name": "Kit fetiche y bondage 10 piezas en cuero sintético",
        "description": "Set completo fetiche de 10 piezas en cuero sintético de alta resistencia. Incluye esposas de manos y tobillos, antifaz, mordaza de bola, látigo, pluma, collar con correa, pinzas y cuerdas.",
        "image": "/catalog/kit-fetiche-10-piezas.webp",
        "stock": 10,
        "price": 130000,
        "badge": "Completo"
      },
      {
        "id": "mordaza-con-pezoneras",
        "name": "Mordaza con pezoneras ajustables",
        "description": "Mordaza de bola en silicona suave con correas ajustables de cuero sintético y pinzas/pezoneras con cadena metálica extraíble.",
        "image": "/catalog/mordaza-con-pezoneras.webp",
        "stock": 10,
        "price": 45000
      },
      {
        "id": "latigo-cuero-sintetico",
        "name": "Látigo flogger en cuero sintético",
        "description": "Látigo tipo flogger con múltiples tiras en cuero sintético flexible y mango ergonómico con correa de seguridad.",
        "image": "/catalog/latigo-cuero-sintetico.webp",
        "stock": 10,
        "price": 35000
      },
      {
        "id": "esposas-cuero-sintetico-peluche",
        "name": "Esposas en cuero sintético con forro afelpado",
        "description": "Esposas ajustables de alta resistencia en cuero sintético con forro interno afelpado suave para máxima comodidad y seguridad.",
        "image": "/catalog/esposas-cuero-sintetico-peluche.webp",
        "stock": 10,
        "price": 35000
      },
      {
        "id": "arnes-para-dildo-sencillo",
        "name": "Arnés para dildo sencillo Soumission",
        "description": "Arnés ajustable con correas elásticas y panel frontal en cuero sintético con aro metálico compatible con dildos de base ancha.",
        "image": "/catalog/arnes-para-dildo-sencillo.webp",
        "stock": 10,
        "price": 45000
      },
      {
        "id": "arnes-con-dildo-realista",
        "name": "Arnés con dildo realista color piel",
        "description": "Conjunto de arnés ajustable con dildo realista flexible color piel con textura detallada y base estable.",
        "image": "/catalog/arnes-con-dildo-realista.webp",
        "stock": 10,
        "price": 100000
      },
      {
        "id": "arnes-dildo-mars-series",
        "name": "Arnés con dildo Mars Dildo Series",
        "description": "Set de arnés ergonómico con dildo anatómico Mars Dildo Series en caja de presentación. Correas ajustables para un acople perfecto.",
        "image": "/catalog/arnes-dildo-mars-series.webp",
        "stock": 10,
        "price": 100000
      }
    ]
  },
  {
    "id": "otros",
    "label": "Otros productos",
    "tagline": "Accesorios y productos especiales",
    "accentColor": "#a855f7",
    "items": [
      {
        "id": "aroma-estimulante-hermin-flow-blush",
        "name": "Aroma estimulante ambientador Hermin / Flow Blush",
        "description": "Aroma ambiental concentrado en frasco de vidrio hermético que brinda sensaciones de intensa relajación, motivación y energía sensorial.",
        "image": "/catalog/aroma-estimulante-hermin-flow-blush.webp",
        "stock": 10,
        "price": 25000
      }
    ]
  }
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
