import Footer from "@/components/footer/Footer";
import Hero1 from "../../components/hero1/Hero1";
import Features from "@/components/features/Features";
import Faq from "@/components/faq/Faq";
import Pricing from "@/pages/pricingPage/PricingPage";

function LandingPage() {
  return (
    <main className="pl-5 pr-5 flex flex-col items-center">
      <Hero1 />
      <Features />
      <Pricing />
      <Faq />
      <Footer />
    </main>
  );
}

export default LandingPage;
