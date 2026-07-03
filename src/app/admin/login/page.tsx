"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "denied") {
      const supabase = createClient();
      void supabase.auth.signOut();
      setError("No tienes permisos para acceder al panel de administración.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Ingresa tu contraseña.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    const verifyRes = await fetch("/api/admin/categories");
    if (!verifyRes.ok) {
      await supabase.auth.signOut();
      setError("No tienes permisos para acceder al panel de administración.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-cinema-dark p-8">
      <div className="mb-8 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase text-white">
          Dlirio <span className="text-neon neon-text">Admin</span>
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Ingresa para gestionar productos y pedidos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-white/50"
          >
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-cinema-gray px-4 py-3 text-sm text-white outline-none transition focus:border-neon"
            placeholder="admin@deliriox.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-white/50"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-cinema-gray px-4 py-3 text-sm text-white outline-none transition focus:border-neon"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-center text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-neon py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-white neon-border transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-cinema-dark p-8 text-center text-sm text-white/50">
          Cargando...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
