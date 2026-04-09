import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage1 from "@/assets/hero-doctor.jpg";
import heroImage2 from "@/assets/hero-doctor-2.jpg";
import heroImage3 from "@/assets/hero-doctor-3.jpg";
import heroImage4 from "@/assets/hero-doctor-4.jpg";
import heroImage5 from "@/assets/hero-doctor-5.jpg";
import heroImage6 from "@/assets/hero-doctor-6.jpg";
import heroImage7 from "@/assets/hero-doctor-7.jpg";
import heroImage8 from "@/assets/hero-doctor-8.jpg";
import heroImage9 from "@/assets/hero-doctor-9.jpg";
import heroImage10 from "@/assets/hero-doctor-10.jpg";
import heroImage11 from "@/assets/hero-doctor-11.jpg";

const heroImages = [heroImage1, heroImage2, heroImage3, heroImage4, heroImage5, heroImage6, heroImage7, heroImage8, heroImage9, heroImage10, heroImage11];

function getDailyImage() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return heroImages[dayOfYear % heroImages.length];
}

export function Hero() {
  const navigate = useNavigate();
  const heroImage = getDailyImage();

  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Doctor consultation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
      </div>

      <div className="container relative mx-auto px-6 lg:px-16 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs font-medium text-primary">Telemedicine platform</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.1] mb-5 tracking-tight">
            Book your
            <br />
            <span className="text-primary">teleconsultations</span>
            <br />
            today.
          </h1>
          <p className="text-base text-muted-foreground max-w-md mb-8">
            Search by specialty, doctor name, or diagnosis to find the right care — anytime, anywhere.
          </p>

          {/* Search Bar */}
          <div className="bg-background rounded-xl border border-border p-1.5 flex flex-col sm:flex-row gap-1.5 max-w-lg">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors, specialties..."
                className="h-11 pl-10 border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
            <Button
              onClick={() => navigate("/providers")}
              className="h-11 px-5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium"
            >
              Find a doctor
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-4 mt-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              WhatsApp confirmations
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              UPI / cards
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              Instant video links
            </span>
          </div>

          {/* Quick action buttons */}
          <div className="flex gap-2 mt-6">
            <Button onClick={() => navigate("/pharmacy")} variant="outline" className="rounded-lg h-9 px-4 text-sm">
              Pharmacy
            </Button>
            <Button onClick={() => navigate("/labs")} variant="outline" className="rounded-lg h-9 px-4 text-sm">
              Labs
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Bottom scroll indicator (mobile) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:hidden"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-muted-foreground"
        >
          <span className="text-xs">Scroll down</span>
          <ArrowRight className="w-4 h-4 rotate-90 mt-1" />
        </motion.div>
      </motion.div>
    </section>
  );
}
