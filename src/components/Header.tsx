"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/Logo";

const navItems = [
  { label: "HOME", href: "/#home" },
  { label: "Visual Stories", href: "/#visual-stories" },
  { label: "Expressions", href: "/#expressions" },
  { label: "Behind the Canvas", href: "/#behind-the-canvas" },
  { label: "Say Hello", href: "/#say-hello" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-white">
      {/* Barra superior negra con correo */}
      <div className="flex h-8 items-center justify-center bg-ink px-5 sm:px-8">
        <a
          href="mailto:ikkoastudio@gmail.com"
          className="font-[family-name:var(--font-nav)] text-[11px] tracking-[0.14em] text-white transition-opacity hover:opacity-70 sm:text-xs"
        >
          ikkoastudio@gmail.com
        </a>
      </div>

      {/* Fila del logo, centrado */}
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-start px-5 sm:h-24 sm:px-8 lg:justify-center">
        <a
          href="/"
          className="block shrink-0"
          onClick={() => setOpen(false)}
          aria-label="IkKOA STUDIO — Home"
        >
          <Logo priority className="h-14 w-auto sm:h-18" />
        </a>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="absolute right-5 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-5 flex-col gap-1.5">
            <span
              className={`h-px w-full bg-ink transition-transform duration-300 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-full bg-ink transition-opacity duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-px w-full bg-ink transition-transform duration-300 ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Fila del menú, debajo del logo (solo escritorio) */}
      <nav className="hidden justify-center gap-10 border-t border-line py-4 lg:flex">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="font-[family-name:var(--font-nav)] text-sm uppercase tracking-wide text-ink transition-opacity hover:opacity-55"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Menú móvil */}
      <div
        className={`fixed inset-0 top-28 bg-white transition-all duration-400 lg:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-8 px-8">
          {navItems.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-[family-name:var(--font-nav)] text-3xl uppercase text-ink transition-opacity hover:opacity-55 sm:text-4xl"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(12px)",
                transitionProperty: "opacity, transform",
                transitionDuration: "0.35s",
                transitionTimingFunction: "ease",
                transitionDelay: open ? `${i * 40}ms` : "0ms",
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
