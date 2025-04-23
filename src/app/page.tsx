import Pricing from "@/components/landingpage/pricing";
import Features from "@/components/landingpage/features";
import FooterSection from "@/components/landingpage/footer";
import HeroSection from "@/components/landingpage/hero-section";
import { NavbarApp } from "@/components/landingpage/navbar";
import Testimonials from "@/components/landingpage/testimonial";
import LinkAccountButton from "@/components/link-account-button";
import { Button } from "@/components/ui/button";
import StatsSection from "@/components/landingpage/stats-section";
import HypermailFAQs from "@/components/landingpage/faqs";
import EmailProblem from "@/components/landingpage/email-problem";

export default async function Home() {
  return (
    <>
      <main className="relative mx-auto flex flex-col justify-center overflow-hidden">
        <NavbarApp>
          <HeroSection />
          <StatsSection/>
          <EmailProblem/>
          <Features/>
          <Testimonials/>
          <Pricing/>
          <HypermailFAQs/>
          <FooterSection/>
        </NavbarApp>
      </main>
    </>
  );
}
