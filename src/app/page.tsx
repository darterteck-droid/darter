import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import RoiCalculator from "@/components/sections/RoiCalculator";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import Founders from "@/components/sections/Founders";
import CtaSection from "@/components/sections/CtaSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Problem />
      <RoiCalculator />
      <HowItWorks />
      <Features />
      <Founders />
      <CtaSection />
      <Footer />
    </main>
  );
}
