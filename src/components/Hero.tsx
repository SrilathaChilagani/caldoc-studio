import { motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-doctor.jpg";

export function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Doctor consultation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
      </div>

      <div className="container relative mx-auto px-6 lg:px-12 py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-4">
            Book your
            <br />
            <span className="text-primary">teleconsultations</span>
            <br />
            today.
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
            Search by specialty, doctor name, or diagnosis to find the right care.
          </p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="glass rounded-2xl p-2 shadow-elevated flex flex-col sm:flex-row gap-2 max-w-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctors, specialties, symptoms..."
                  className="h-12 pl-10 bg-background/50 border-0 rounded-xl focus-visible:ring-1"
                />
              </div>
              <Input
                placeholder="Specialty (optional)"
                className="h-12 bg-background/50 border-0 rounded-xl sm:max-w-[180px] focus-visible:ring-1"
              />
              <Button
                onClick={() => navigate("/providers")}
                className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium whitespace-nowrap"
              >
                Find a doctor
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                WhatsApp confirmations
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                UPI / cards
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Instant video links
              </span>
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="rounded-xl h-11 px-8 border-border bg-background/60 hover:bg-background font-medium">
                Pharmacy
              </Button>
              <Button variant="outline" className="rounded-xl h-11 px-8 border-border bg-background/60 hover:bg-background font-medium">
                Labs
              </Button>
            </div>
          </motion.div>

          {/* Desktop: Discover More */}
          <motion.a
            href="#why"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="hidden lg:inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer mt-10"
          >
            Discover More
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>

      {/* Bottom scroll indicator (mobile) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:hidden"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center text-muted-foreground"
        >
          <span className="text-sm mb-2">Discover More</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
