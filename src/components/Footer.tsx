import { publicText, type Locale } from "@/lib/locale";

const socials = [
  {
    name: "Instagram",
    href: "https://instagram.com/ikkoastudio",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-5 w-5"
        aria-hidden
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com/ikkoastudio",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden
      >
        <path d="M13.5 21v-7h2.4l.45-3H13.5V9.1c0-.87.28-1.6 1.66-1.6h1.34V4.85c-.64-.09-1.4-.17-2.2-.17-2.3 0-3.8 1.4-3.8 3.95V11H8v3h2.5v7h3Z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@ikkoastudio",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden
      >
        <path d="M16.6 3c.36 1.94 1.7 3.44 3.9 3.58v2.85c-1.42.05-2.77-.4-3.9-1.2v5.9c0 3.62-2.5 5.87-5.6 5.87-2.98 0-5.5-2.2-5.5-5.44 0-3.3 2.62-5.5 5.72-5.4.3 0 .6.03.9.1v2.98a2.86 2.86 0 0 0-.94-.14 2.53 2.53 0 0 0-2.6 2.5c0 1.44 1.1 2.5 2.5 2.5 1.5 0 2.5-1.06 2.5-2.7V3h3.02Z" />
      </svg>
    ),
  },
];

export default function Footer({ locale = "en" }: { locale?: Locale }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:flex-row sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
          © {year} IkKOA STUDIO · {publicText[locale].footer}
        </p>

        <div className="flex items-center gap-5">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="text-ink transition-opacity hover:opacity-55"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
