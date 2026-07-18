import BehindCanvas from "@/components/BehindCanvas";
import Expressions from "@/components/Expressions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MaintenanceView from "@/components/MaintenanceView";
import SayHello from "@/components/SayHello";
import VisualStories from "@/components/VisualStories";
import { getLocale } from "@/lib/locale-server";
import { getSiteContent } from "@/lib/site-content";
import { getHomeEnabled } from "@/lib/site-settings";

export default async function Home() {
  const [homeEnabled, content, locale] = await Promise.all([
    getHomeEnabled(),
    getSiteContent(),
    getLocale(),
  ]);

  if (!homeEnabled) {
    return <MaintenanceView />;
  }

  return (
    <>
      <Header locale={locale} />
      <main>
        <Hero content={content[locale].hero} />
        <VisualStories locale={locale} />
        <Expressions content={content[locale].expressions} />
        <BehindCanvas content={content[locale].behind} locale={locale} />
        <SayHello locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
