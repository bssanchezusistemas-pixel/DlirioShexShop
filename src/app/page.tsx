import { AgeGate } from "@/components/AgeGate";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MarqueeStrip } from "@/components/MarqueeStrip";
import { CatalogSection } from "@/components/CatalogSection";
import { TrustSection } from "@/components/TrustSection";
import { LocationSection } from "@/components/LocationSection";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingActions } from "@/components/FloatingActions";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <AgeGate>
      <Header />
      <main>
        <Hero />
        <MarqueeStrip />
        <CatalogSection />
        <TrustSection />
        <LocationSection />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingActions />
    </AgeGate>
  );
}
