import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import DemoSection from "@/components/sections/DemoSection";
import Features from "@/components/sections/Features";
import RoiCalculator from "@/components/sections/RoiCalculator";
import Founders from "@/components/sections/Founders";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import CtaSection from "@/components/sections/CtaSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <DemoSection />
      <RoiCalculator />
      <Features />
      <Pricing />
      <Founders />
      <FAQ />
      <CtaSection />
      <Footer />
    </main>
  );
}
