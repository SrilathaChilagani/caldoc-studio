import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Specialties } from "@/components/Specialties";
import { Doctors } from "@/components/Doctors";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { Services } from "@/components/Services";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <Specialties />
      <Doctors />
      <HowItWorks />
      <Testimonials />
      <Services />
      <Contact />
    </Layout>
  );
};

export default Index;
