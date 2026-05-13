import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import Features from "@/components/sections/Features";
import AppValueCalculator from "@/components/sections/AppValueCalculator";
import Founders from "@/components/sections/Founders";
import FAQ from "@/components/sections/FAQ";
import Pricing from "@/components/sections/Pricing";
import CtaSection from "@/components/sections/CtaSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustStrip />
      <Features />
      <AppValueCalculator />
      <Founders />
      <FAQ />
      <Pricing />
      <CtaSection />
      <Footer />
    </main>
  );
}
