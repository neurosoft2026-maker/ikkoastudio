import BehindCanvas from "@/components/BehindCanvas";
import Expressions from "@/components/Expressions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SayHello from "@/components/SayHello";
import VisualStories from "@/components/VisualStories";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <VisualStories />
        <Expressions />
        <BehindCanvas />
        <SayHello />
      </main>
      <Footer />
    </>
  );
}
