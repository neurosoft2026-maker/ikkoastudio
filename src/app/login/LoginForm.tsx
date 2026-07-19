"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("ikkoastudio@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace(next);
    router.refresh();
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-5">
      <div className="w-full max-w-md border border-line bg-white p-8 sm:p-10">
        <Link
          href="/"
          aria-label="IkKOA STUDIO — Home"
          className="mb-8 flex justify-center"
        >
          <Logo priority className="h-16 w-auto sm:h-20" />
        </Link>

        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
          Administración
        </p>
        <h1 className="font-[family-name:var(--font-title)] text-3xl font-semibold text-ink">
          Iniciar sesión
        </h1>
        <p className="mt-3 text-sm text-muted">
          Accede al panel de IkKOA Studio para gestionar categorías y obras.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
              Correo electrónico
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-ink/25 bg-transparent py-3 text-ink outline-none focus:border-ink"
              autoComplete="email"
            />
          </label>

          <div>
            <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
              Contraseña
            </span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-ink/25 bg-transparent py-3 pr-10 text-ink outline-none focus:border-ink"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-ink/60 transition-colors hover:text-ink"
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.7a2 2 0 002.8 2.8" />
                    <path d="M9.9 5.1A10.4 10.4 0 0112 5c5 0 9.3 3.1 11 7.5a11.7 11.7 0 01-4 5.1" />
                    <path d="M6.7 6.7A11.6 11.6 0 001 12.5C2.7 16.9 7 20 12 20a10.4 10.4 0 005.1-1.3" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    <path d="M1 12.5C2.7 8.1 7 5 12 5s9.3 3.1 11 7.5c-1.7 4.4-6 7.5-11 7.5S2.7 16.9 1 12.5z" />
                    <circle cx="12" cy="12.5" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center bg-ink font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-8 flex items-center justify-center gap-2 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
        >
          ← Volver al sitio
        </Link>
      </div>
    </main>
  );
}
