# Delirio X Sex Shop

Landing para tienda erótica en Zarzal, Valle del Cauca. Catálogo por categorías, carrito y pedidos por WhatsApp.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3001](http://localhost:3001) (puerto 3001 para no chocar con otros proyectos).

## Deploy

Proyecto independiente de Granizados de Película. Compatible con Vercel — importa esta carpeta como repo o proyecto nuevo.

## Datos del negocio

Edita `src/data/catalog.ts`:

- `BUSINESS` — nombre, dirección, WhatsApp, Instagram
- `CATALOG_CATEGORIES` — categorías y productos

## Admin y Supabase

Copia `.env.example` a `.env.local` y configura las variables de Supabase.

- `ADMIN_EMAILS` — lista de correos con acceso al panel (separados por coma).
- Alternativa: asignar `app_metadata.role = "admin"` al usuario en Supabase Auth.
- **Seguridad:** desactiva el registro público en Supabase Dashboard → Authentication → Providers → Email. Solo cuentas invitadas deben poder registrarse.
- Tras aplicar migraciones, inserta tu email en `admin_users` si usas RLS:  
  `INSERT INTO admin_users (email) VALUES ('tu@email.com');`

## Stack

Next.js 15 · React 19 · Tailwind CSS 4 · GSAP · Supabase
