-- Admin RLS: replace permissive authenticated policies with is_admin() checks

CREATE TABLE IF NOT EXISTS admin_users (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE admin_users IS
  'Allowlist de emails admin. Insertar: INSERT INTO admin_users (email) VALUES (''tu@email.com'');';

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

-- Categories: public read, admin write
DROP POLICY IF EXISTS "Admin all categories" ON categories;
CREATE POLICY "Admin write categories" ON categories
  FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admin update categories" ON categories
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete categories" ON categories
  FOR DELETE TO authenticated USING (is_admin());

-- Products: public read active, admin write
DROP POLICY IF EXISTS "Admin all products" ON products;
CREATE POLICY "Admin write products" ON products
  FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admin update products" ON products
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete products" ON products
  FOR DELETE TO authenticated USING (is_admin());

-- Customers, orders, order_items: admin only (no public access)
DROP POLICY IF EXISTS "Admin all customers" ON customers;
CREATE POLICY "Admin all customers" ON customers
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin all orders" ON orders;
CREATE POLICY "Admin all orders" ON orders
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin all order_items" ON order_items;
CREATE POLICY "Admin all order_items" ON order_items
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Storage: public read, admin upload/update/delete
DROP POLICY IF EXISTS "Admin upload product images" ON storage.objects;
CREATE POLICY "Admin upload product images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND is_admin());

DROP POLICY IF EXISTS "Admin update product images" ON storage.objects;
CREATE POLICY "Admin update product images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND is_admin())
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

DROP POLICY IF EXISTS "Admin delete product images" ON storage.objects;
CREATE POLICY "Admin delete product images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND is_admin());

-- Increase bucket limit to 5 MB (compressed WebP output is typically smaller)
UPDATE storage.buckets
SET file_size_limit = 5242880
WHERE id = 'product-images';
