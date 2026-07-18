"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import HomeEnabledToggle from "@/components/dashboard/HomeEnabledToggle";

type LinkItem = {
  href: string;
  label: string;
};

type Props = {
  links: LinkItem[];
  homeEnabled: boolean;
  signOutAction: () => Promise<void>;
};

export default function DashboardNav({
  links,
  homeEnabled,
  signOutAction,
}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Desktop nav */}
      <div className="hidden items-center gap-5 lg:flex">
        <nav className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] transition-colors ${
                isActive(link.href)
                  ? "text-ink"
                  : "text-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink"
        >
          Ver sitio
        </Link>
        <HomeEnabledToggle initialEnabled={homeEnabled} />
        <form action={signOutAction}>
          <button
            type="submit"
            className="bg-ink px-4 py-2 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-white"
          >
            Cerrar sesión
          </button>
        </form>
      </div>

      {/* Mobile hamburger */}
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        className="relative z-50 flex h-10 w-10 items-center justify-center lg:hidden"
        onClick={() => setOpen((v) => !v)}
      >
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

      {/* Mobile panel */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-opacity duration-300 lg:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col px-6 pb-10 pt-24">
          <nav className="flex flex-col gap-1">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`border-b border-line py-4 font-[family-name:var(--font-nav)] text-xl uppercase tracking-[0.08em] transition-colors ${
                  isActive(link.href) ? "text-ink" : "text-muted"
                }`}
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(10px)",
                  transitionProperty: "opacity, transform",
                  transitionDuration: "0.3s",
                  transitionTimingFunction: "ease",
                  transitionDelay: open ? `${i * 40}ms` : "0ms",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="border-b border-line py-4 font-[family-name:var(--font-nav)] text-xl uppercase tracking-[0.08em] text-muted"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(10px)",
                transitionProperty: "opacity, transform",
                transitionDuration: "0.3s",
                transitionTimingFunction: "ease",
                transitionDelay: open ? `${links.length * 40}ms` : "0ms",
              }}
            >
              Ver sitio
            </Link>
          </nav>

          <div className="mt-auto space-y-5">
            <div className="flex items-center justify-between border border-line px-4 py-3">
              <span className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-muted">
                Página de inicio
              </span>
              <HomeEnabledToggle initialEnabled={homeEnabled} />
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="h-12 w-full bg-ink font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-white"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
