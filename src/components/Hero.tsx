import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import heroImage from "@/assets/hero-doctor.jpg";

const specialties = [
  "Dermatology",
  "Pediatrics",
  "Cardiology",
  "ENT",
  "Orthopedics",
  "Psychiatry",
  "General Medicine",
];

export function Hero() {
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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-6">
              Care, made
              <br />
              <span className="text-primary">simple.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
              Experience telemedicine the most authentic way with trusted doctors, 
              from the comfort of your home.
            </p>

            {/* Desktop: Discover More */}
            <motion.a
              href="#why"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="hidden lg:inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
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

          {/* Right: Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:ml-auto"
          >
            <div className="glass rounded-3xl p-8 shadow-elevated max-w-md">
              <h3 className="font-serif text-2xl text-foreground mb-2">
                Begin Your Consultation
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Starting from ₹299 per session
              </p>

              <form className="space-y-4">
                <Input
                  placeholder="Full Name"
                  className="h-12 bg-background/50 border-border/50 rounded-xl focus:bg-background"
                />
                <Input
                  placeholder="Enter Phone Number"
                  type="tel"
                  className="h-12 bg-background/50 border-border/50 rounded-xl focus:bg-background"
                />
                <Select>
                  <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl">
                    <SelectValue placeholder="Choose Specialty *" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty.toLowerCase()}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <textarea
                  placeholder="Describe your concern (Optional)"
                  rows={3}
                  className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium"
                >
                  Request A Callback
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
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
