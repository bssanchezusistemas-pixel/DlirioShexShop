-- Unificar dilatadores y desensibilizantes en una sola categoría
UPDATE products
SET category_id = 'dilatadores-desensibilizantes'
WHERE category_id IN ('dilatadores', 'desensibilizantes');

INSERT INTO categories (id, label, tagline, accent_color, sort_order) VALUES
  ('dilatadores-desensibilizantes', 'Dilatadores y desensibilizantes', 'Progresión y control para mayor comodidad', '#a78bfa', 8)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  tagline = EXCLUDED.tagline,
  accent_color = EXCLUDED.accent_color,
  sort_order = EXCLUDED.sort_order;

DELETE FROM categories WHERE id IN ('dilatadores', 'desensibilizantes');

UPDATE categories SET sort_order = 9 WHERE id = 'otros';
