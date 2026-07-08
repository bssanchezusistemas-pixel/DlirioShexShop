-- Nuevas categorías: Dilatadores y Desensibilizantes
INSERT INTO categories (id, label, tagline, accent_color, sort_order) VALUES
  ('dilatadores', 'Dilatadores', 'Progresión suave para mayor comodidad', '#c084fc', 8),
  ('desensibilizantes', 'Desensibilizantes', 'Reduce la sensibilidad para mayor control', '#818cf8', 9)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  tagline = EXCLUDED.tagline,
  accent_color = EXCLUDED.accent_color,
  sort_order = EXCLUDED.sort_order;

UPDATE categories SET sort_order = 10 WHERE id = 'otros';
