import { publicText, type Locale } from "@/lib/locale";

const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/ikkoastudio",
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
    href: "https://www.facebook.com/share/1JnvrYaMzu/?mibextid=wwXIfr",
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
];

export default function Footer({ locale = "en" }: { locale?: Locale }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:flex-row sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
          © {year} IkKOA STUDIO · Miami, Florida · {publicText[locale].footer}
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
