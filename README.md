# ikkoa

Landing page del estudio de pintura **ikkoa** — construida con Next.js, Tailwind CSS y preparada para integrar Supabase.

## Stack

- [Next.js](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- Supabase (próximo)

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com/dashboard).
2. Copia `.env.example` a `.env.local` y pega **Project URL** y **anon public** key (Settings → API).
3. En el SQL Editor, ejecuta `supabase/schema.sql` para crear las tablas.
4. Reinicia `npm run dev`.

Clientes listos en:
- `src/lib/supabase/client.ts` — navegador
- `src/lib/supabase/server.ts` — Server Components / Route Handlers
- `src/middleware.ts` — refresco de sesión
