import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const email = process.env.ADMIN_EMAIL?.trim();
const password = process.env.ADMIN_PASSWORD;

if (!url || !serviceKey || !anonKey) {
  console.error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local",
  );
  process.exit(1);
}

if (!email || !password) {
  console.error(
    "Define ADMIN_EMAIL y ADMIN_PASSWORD en .env.local antes de ejecutar este script.",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) {
    console.error("listUsers error:", error.message);
    process.exit(1);
  }

  let user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (!user) {
    console.log("User not found — creating...");
    const { data: created, error: createError } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { role: "admin" },
      });
    if (createError) {
      console.error("createUser error:", createError.message);
      process.exit(1);
    }
    user = created.user;
    console.log("Created user:", user.id);
  } else {
    console.log("User exists:", user.id, "confirmed:", !!user.email_confirmed_at);
    const { error: updateError } = await admin.auth.admin.updateUserById(
      user.id,
      { password, email_confirm: true, app_metadata: { role: "admin" } },
    );
    if (updateError) {
      console.error("updateUser error:", updateError.message);
      process.exit(1);
    }
    console.log("Password and admin role updated.");
  }

  const client = createClient(url, anonKey);
  const { data: signIn, error: signInError } =
    await client.auth.signInWithPassword({ email, password });

  if (signInError) {
    console.error("signInWithPassword FAILED:", signInError.message);
    process.exit(1);
  }

  console.log("signInWithPassword SUCCESS — user:", signIn.user?.email);
}

main();
