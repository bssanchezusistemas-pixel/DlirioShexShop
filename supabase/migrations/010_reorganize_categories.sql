-- Reorganizar categorías del catálogo según el orden de la tienda

-- 1. Insertar / actualizar categorías nuevas y renombradas
INSERT INTO categories (id, label, tagline, accent_color, sort_order) VALUES
  ('lenceria', 'Lencería', 'Seducción y estilo para cada ocasión', '#e91e8c', 1),
  ('disfraces', 'Disfraces', 'Fantasías y role play', '#f472b6', 2),
  ('lubricantes', 'Lubricantes', 'Lubricación suave con sabor', '#ff6b35', 3),
  ('sen-intimo', 'Sen íntimo', 'Cosméticos íntimos con efectos únicos', '#9b2fd4', 4),
  ('cuidado-intimo', 'Cuidado íntimo', 'Cuidado y bienestar personal', '#22d3ee', 5),
  ('retardantes', 'Retardantes', 'Prolonga el placer y controla tus sensaciones', '#ff2d95', 6),
  ('juguetes-hombres', 'Juguetes para hombres', 'Placer pensado para él', '#38bdf8', 7),
  ('juguetes-mujeres', 'Juguetes para mujeres', 'Placer pensado para ella', '#ff2d95', 8),
  ('potenciadores-femeninos', 'Potenciadores femeninos', 'Deseo, lubricación y más placer', '#e879f9', 9),
  ('potenciadores-masculinos', 'Potenciadores masculinos', 'Más rendimiento, más confianza', '#a855f7', 10),
  ('dilatadores-desensibilizantes', 'Dilatadores y desensibilizantes', 'Progresión y control para mayor comodidad', '#a78bfa', 11),
  ('sadomasoquismo', 'Sadomasoquismo', 'Bondage, control y exploración', '#f43f5e', 12),
  ('otros', 'Otros productos', 'Accesorios y productos especiales', '#a855f7', 13)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  tagline = EXCLUDED.tagline,
  accent_color = EXCLUDED.accent_color,
  sort_order = EXCLUDED.sort_order;

-- 2. Reasignar productos a las nuevas categorías
UPDATE products SET category_id = 'cuidado-intimo' WHERE category_id = 'higiene';

UPDATE products SET category_id = 'juguetes-mujeres'
WHERE id IN (
  'vib-huevo-control-remoto',
  'private-massager-control-remoto',
  'vibrador-app-smartphone',
  'mini-bullet-vibrator',
  'malawy-029-consolador',
  'plug-anal-corazon-rosa'
);

UPDATE products SET category_id = 'sadomasoquismo'
WHERE id IN (
  'kit-bondage-10-piezas',
  'set-bondage-anti-back-handcuffs'
);

UPDATE products SET category_id = 'juguetes-hombres'
WHERE id = 'men-powerup-penis-pump';

UPDATE products SET category_id = 'potenciadores-femeninos'
WHERE id IN (
  'firefox-women-series',
  'firefox-women-supplement-5g',
  'groben-penis-fem',
  'sexlove-plus-chewing-gum',
  'gold-fly-original'
);

UPDATE products SET category_id = 'potenciadores-masculinos'
WHERE id IN (
  'big-penis-honey',
  'groben-penis-gold',
  'groben-penis-silver',
  'groben-penis-maxxx',
  'test-product-1783091764842'
);

-- Cualquier producto que quede en categorías viejas
UPDATE products SET category_id = 'juguetes-mujeres' WHERE category_id = 'juguetes';
UPDATE products SET category_id = 'potenciadores-masculinos' WHERE category_id = 'estimulantes';

-- 3. Eliminar categorías obsoletas
DELETE FROM categories
WHERE id IN ('juguetes', 'estimulantes', 'higiene');
