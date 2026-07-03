-- Security hardening: RLS on admin_users, lock down RPC, storage listing, search_path

-- 1. admin_users: enable RLS (service_role bypasses; no client access)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Seed primary admin if missing (matches ADMIN_EMAILS env)
INSERT INTO admin_users (email)
VALUES ('dliriosexshop5@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- 2. Fix mutable search_path on trigger helper
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 3. RPC: only service_role may execute order functions (Next.js API uses service role)
REVOKE ALL ON FUNCTION public.create_order_with_stock(
  TEXT, TEXT, delivery_type, TEXT, TEXT, INTEGER, JSONB
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_order_with_stock(
  TEXT, TEXT, delivery_type, TEXT, TEXT, INTEGER, JSONB
) TO service_role;

REVOKE ALL ON FUNCTION public.restore_order_stock(UUID) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.restore_order_stock(UUID) TO service_role;

-- is_admin: used in RLS policies by authenticated; block anon RPC access
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- 4. Storage: public bucket URLs work without a broad SELECT policy (prevents bucket listing)
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
