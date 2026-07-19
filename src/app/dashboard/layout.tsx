import { redirect } from "next/navigation";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { createClient } from "@/lib/supabase/server";
import { getHomeEnabled } from "@/lib/site-settings";

async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const homeEnabled = await getHomeEnabled();

  const links = [
    { href: "/dashboard", label: "Resumen" },
    { href: "/dashboard/categories", label: "Categorías" },
    { href: "/dashboard/artworks", label: "Obras" },
    { href: "/dashboard/studio-journal", label: "Studio Journal" },
    { href: "/dashboard/content", label: "Contenido del sitio" },
  ];

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-50 border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-nav)] text-sm uppercase tracking-wide text-ink">
              IkKOA Dashboard
            </p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <DashboardNav
            links={links}
            homeEnabled={homeEnabled}
            signOutAction={signOut}
          />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
