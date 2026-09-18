-- ====================================================================
-- DELIRIO X SEX SHOP - SCRIPT COMPLETO DE BASE DE DATOS
-- Ejecutar este archivo completo en Supabase Dashboard -> SQL Editor
-- URL: https://supabase.com/dashboard/project/qkjmebcnrrwgdudvzaoo/sql/new
-- ====================================================================

-- 1. TABLA DE CATEGORÍAS
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  tagline TEXT NOT NULL,
  accent_color TEXT NOT NULL DEFAULT '#ff2d95',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABLA DE PRODUCTOS
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER,
  stock INTEGER NOT NULL DEFAULT 10,
  image_url TEXT,
  badge TEXT,
  consult_only BOOLEAN NOT NULL DEFAULT FALSE,
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABLA DE CLIENTES
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TIPOS ENUM
DO $$ BEGIN
  CREATE TYPE delivery_type AS ENUM ('pickup', 'delivery');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 5. TABLA DE ÓRDENES Y DETALLES
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  total_amount INTEGER NOT NULL DEFAULT 0,
  delivery_type delivery_type NOT NULL DEFAULT 'pickup',
  delivery_address TEXT,
  status order_status NOT NULL DEFAULT 'pending',
  whatsapp_message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price INTEGER NOT NULL DEFAULT 0,
  size_label TEXT
);

-- 6. TABLA DE ADMINS (ALLOWLIST)
CREATE TABLE IF NOT EXISTS admin_users (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO admin_users (email)
VALUES ('dliriosexshop5@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- 7. ÍNDICES DE RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_products_consult_only ON products(consult_only);

-- 8. TRIGGER UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. FUNCIÓN DE ADMINISTRADOR
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  jwt_email TEXT;
  jwt_role TEXT;
BEGIN
  jwt_email := lower(auth.jwt() ->> 'email');
  jwt_role := auth.jwt() -> 'app_metadata' ->> 'role';

  IF jwt_role = 'admin' THEN
    RETURN true;
  END IF;

  IF jwt_email IS NOT NULL AND EXISTS (
    SELECT 1 FROM admin_users WHERE lower(email) = jwt_email
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 10. ROW LEVEL SECURITY (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas Categorías
DROP POLICY IF EXISTS "Public read categories" ON categories;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write categories" ON categories;
CREATE POLICY "Admin write categories" ON categories
  FOR INSERT TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin update categories" ON categories;
CREATE POLICY "Admin update categories" ON categories
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin delete categories" ON categories;
CREATE POLICY "Admin delete categories" ON categories
  FOR DELETE TO authenticated USING (is_admin());

-- Políticas Productos
DROP POLICY IF EXISTS "Public read active products" ON products;
CREATE POLICY "Public read active products" ON products FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin write products" ON products;
CREATE POLICY "Admin write products" ON products
  FOR INSERT TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin update products" ON products;
CREATE POLICY "Admin update products" ON products
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin delete products" ON products;
CREATE POLICY "Admin delete products" ON products
  FOR DELETE TO authenticated USING (is_admin());

-- Políticas Órdenes, Clientes y Order Items
DROP POLICY IF EXISTS "Admin all customers" ON customers;
CREATE POLICY "Admin all customers" ON customers
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin all orders" ON orders;
CREATE POLICY "Admin all orders" ON orders
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin all order_items" ON order_items;
CREATE POLICY "Admin all order_items" ON order_items
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Políticas Admin Users
DROP POLICY IF EXISTS "Deny all admin_users for anon" ON admin_users;
CREATE POLICY "Deny all admin_users for anon" ON admin_users
  FOR ALL TO anon USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "Deny all admin_users for authenticated" ON admin_users;
CREATE POLICY "Deny all admin_users for authenticated" ON admin_users
  FOR ALL TO authenticated USING (false) WITH CHECK (false);

-- 11. FUNCIONES RPC PARA ÓRDENES CON MANEJO DE STOCK
CREATE OR REPLACE FUNCTION create_order_with_stock(
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_delivery_type delivery_type,
  p_delivery_address TEXT,
  p_whatsapp_message TEXT,
  p_total_amount INTEGER,
  p_items JSONB
)
RETURNS UUID AS $$
DECLARE
  v_customer_id UUID;
  v_order_id UUID;
  item RECORD;
  agg RECORD;
BEGIN
  INSERT INTO customers (name, phone)
  VALUES (p_customer_name, p_customer_phone)
  RETURNING id INTO v_customer_id;

  INSERT INTO orders (
    customer_id, total_amount, delivery_type, delivery_address, status, whatsapp_message
  )
  VALUES (
    v_customer_id, p_total_amount, p_delivery_type, p_delivery_address, 'pending', p_whatsapp_message
  )
  RETURNING id INTO v_order_id;

  FOR agg IN
    SELECT product_id, SUM(quantity)::INTEGER AS total_qty
    FROM jsonb_to_recordset(p_items) AS x(
      product_id TEXT,
      product_name TEXT,
      quantity INTEGER,
      unit_price INTEGER,
      size_label TEXT
    )
    WHERE product_id IS NOT NULL
    GROUP BY product_id
  LOOP
    UPDATE products
    SET stock = stock - agg.total_qty
    WHERE id = agg.product_id
      AND consult_only = false
      AND stock >= agg.total_qty;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'stock_insufficient:%', agg.product_id;
    END IF;
  END LOOP;

  FOR item IN
    SELECT *
    FROM jsonb_to_recordset(p_items) AS x(
      product_id TEXT,
      product_name TEXT,
      quantity INTEGER,
      unit_price INTEGER,
      size_label TEXT
    )
  LOOP
    INSERT INTO order_items (
      order_id, product_id, product_name, quantity, unit_price, size_label
    )
    VALUES (
      v_order_id,
      item.product_id,
      item.product_name,
      item.quantity,
      item.unit_price,
      item.size_label
    );
  END LOOP;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION restore_order_stock(p_order_id UUID)
RETURNS VOID AS $$
DECLARE
  item RECORD;
BEGIN
  FOR item IN
    SELECT product_id, SUM(quantity)::INTEGER AS total_qty
    FROM order_items
    WHERE order_id = p_order_id AND product_id IS NOT NULL
    GROUP BY product_id
  LOOP
    UPDATE products
    SET stock = stock + item.total_qty
    WHERE id = item.product_id AND consult_only = false;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Permisos estrictos en RPC
REVOKE ALL ON FUNCTION public.create_order_with_stock(
  TEXT, TEXT, delivery_type, TEXT, TEXT, INTEGER, JSONB
) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_order_with_stock(
  TEXT, TEXT, delivery_type, TEXT, TEXT, INTEGER, JSONB
) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_order_with_stock(
  TEXT, TEXT, delivery_type, TEXT, TEXT, INTEGER, JSONB
) TO service_role;

REVOKE ALL ON FUNCTION public.restore_order_stock(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.restore_order_stock(UUID) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.restore_order_stock(UUID) TO service_role;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- 12. CONFIGURACIÓN DE STORAGE
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload product images" ON storage.objects;
CREATE POLICY "Admin upload product images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin update product images" ON storage.objects;
CREATE POLICY "Admin update product images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin delete product images" ON storage.objects;
CREATE POLICY "Admin delete product images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'product-images');

-- 13. SEED DE CATEGORÍAS DEFINITIVAS
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
