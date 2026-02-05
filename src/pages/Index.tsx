import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Specialties } from "@/components/Specialties";
import { FeaturedDoctors } from "@/components/FeaturedDoctors";
import { HowItWorks } from "@/components/HowItWorks";
import { Services } from "@/components/Services";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Specialties />
      <FeaturedDoctors />
      <HowItWorks />
      <Services />
      <Footer />
    </div>
  );
};

export default Index;
