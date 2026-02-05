import { motion } from "framer-motion";
import { Search, Check, Video, CreditCard, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const features = [
  { icon: MessageCircle, text: "WhatsApp confirmations" },
  { icon: CreditCard, text: "UPI / cards" },
  { icon: Video, text: "Instant video links" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-teal-50/30 to-background" />
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 to-coral/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-teal-100/50 to-transparent blur-3xl" />
      
      <div className="container relative mx-auto px-4 lg:px-8 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
              Trusted by 10,000+ patients
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Book your{" "}
              <span className="text-primary">teleconsultations</span>{" "}
              today.
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Search by specialty, doctor name, or diagnosis to find the right care from anywhere.
            </p>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-strong rounded-2xl p-2 shadow-elevated max-w-xl mx-auto lg:mx-0"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search doctors, specialties..."
                    className="pl-12 h-12 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                  />
                </div>
                <Button size="lg" className="h-12 px-8 bg-primary hover:bg-teal-600 text-primary-foreground shadow-soft">
                  Find a doctor
                </Button>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  {feature.text}
                </div>
              ))}
            </motion.div>

            {/* Service Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3 mt-8"
            >
              <Button
                variant="outline"
                size="lg"
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                Pharmacy
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-coral/30 text-coral hover:bg-coral/10"
              >
                Labs
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main Circle */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/20 to-teal-100 animate-pulse-soft" />
              
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-12 right-0 glass-strong rounded-xl p-4 shadow-elevated"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Video className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Video Consultation</p>
                    <p className="text-xs text-muted-foreground">Available 24/7</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-24 left-0 glass-strong rounded-xl p-4 shadow-elevated"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Instant Booking</p>
                    <p className="text-xs text-muted-foreground">Get confirmed in minutes</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-1/2 right-4 glass-strong rounded-xl p-4 shadow-elevated"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium border-2 border-background">
                      Dr
                    </div>
                    <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center text-accent-foreground text-xs font-medium border-2 border-background">
                      Dr
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">100+ doctors</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
