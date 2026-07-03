import type { User } from "@supabase/supabase-js";

function parseAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user: User): boolean {
  if (user.app_metadata?.role === "admin") return true;
  const email = user.email?.toLowerCase();
  if (!email) return false;
  return parseAdminEmails().includes(email);
}
