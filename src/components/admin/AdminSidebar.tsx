"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/clientes", label: "Clientes" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-white/10 bg-cinema-black">
      <div className="border-b border-white/10 px-5 py-6">
        <Link href="/admin" className="block">
          <span className="font-[family-name:var(--font-display)] text-lg uppercase text-white">
            Dlirio
          </span>
          <span className="ml-1 font-[family-name:var(--font-display)] text-lg uppercase text-neon neon-text">
            Admin
          </span>
        </Link>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/40">
          Panel de gestión
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2.5 text-xs uppercase tracking-[0.15em] transition ${
                isActive
                  ? "bg-neon/15 text-neon neon-border"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-white/40 hover:text-neon"
        >
          Ver sitio web →
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-full border border-white/15 py-2 text-[10px] uppercase tracking-[0.15em] text-white/60 transition hover:border-neon hover:text-neon"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
