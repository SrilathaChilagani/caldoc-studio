import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Specialties } from "@/components/Specialties";
import { Doctors } from "@/components/Doctors";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { Services } from "@/components/Services";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Specialties />
      <Doctors />
      <HowItWorks />
      <Testimonials />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
