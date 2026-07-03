-- Explicit revoke: Supabase default grants EXECUTE to anon/authenticated on new functions

REVOKE EXECUTE ON FUNCTION public.create_order_with_stock(
  TEXT, TEXT, delivery_type, TEXT, TEXT, INTEGER, JSONB
) FROM anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.restore_order_stock(UUID) FROM anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;

-- admin_users: explicit deny-all for API roles (service_role bypasses RLS)
DROP POLICY IF EXISTS "Deny all admin_users for anon" ON admin_users;
CREATE POLICY "Deny all admin_users for anon" ON admin_users
  FOR ALL TO anon USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "Deny all admin_users for authenticated" ON admin_users;
CREATE POLICY "Deny all admin_users for authenticated" ON admin_users
  FOR ALL TO authenticated USING (false) WITH CHECK (false);
