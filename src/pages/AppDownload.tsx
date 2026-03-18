import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Video,
  Shield,
  Bell,
  Pill,
  FileText,
  Calendar,
  Star,
  Smartphone,
  ArrowRight,
  CheckCircle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroWebapp from "@/assets/hero-webapp.jpg";
import appMockup1 from "@/assets/app-mockup-1.jpg";
import appMockup2 from "@/assets/app-mockup-2.jpg";
import appMockup3 from "@/assets/app-mockup-3.jpg";

const appFeatures = [
  {
    icon: Video,
    title: "HD Video Consultations",
    description: "Crystal-clear video calls with doctors, even on slow connections.",
  },
  {
    icon: Calendar,
    title: "Instant Booking",
    description: "Book appointments in seconds with real-time availability.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "WhatsApp & push notifications so you never miss an appointment.",
  },
  {
    icon: Pill,
    title: "Rx Delivery",
    description: "Get prescriptions delivered to your doorstep within hours.",
  },
  {
    icon: FileText,
    title: "Health Records",
    description: "All your reports, prescriptions, and history in one place.",
  },
  {
    icon: Shield,
    title: "End-to-End Encrypted",
    description: "Your health data stays private with bank-grade security.",
  },
];

const stats = [
  { value: "500K+", label: "Downloads" },
  { value: "4.8", label: "App Rating", icon: Star },
  { value: "50K+", label: "Consultations/mo" },
  { value: "2 min", label: "Avg. Wait Time" },
];

const steps = [
  { step: "1", title: "Download the app", description: "Available on Android & iOS" },
  { step: "2", title: "Create your profile", description: "Quick sign-up with phone or Aadhaar" },
  { step: "3", title: "Book & consult", description: "Find a doctor and start your video visit" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AppDownload() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              >
                <Smartphone className="w-4 h-4" />
                Web App & Mobile App
              </motion.span>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-6">
                A doctor in
                <br />
                your <span className="text-primary">pocket.</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                Consult certified doctors, order lab tests, and get medicines delivered — all from your phone.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Button
                  size="lg"
                  onClick={() => navigate("/providers")}
                  className="h-13 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-medium text-base"
                >
                  Find a Doctor
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 px-8 rounded-2xl font-medium text-base border-border"
                >
                  Watch Demo
                  <Video className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  End-to-end encrypted
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  500K+ consultations
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  4.8 avg rating
                </span>
              </motion.div>
            </motion.div>

            {/* Right: App Card Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-sm rounded-[2rem] bg-primary p-8 shadow-elevated text-primary-foreground">
                <span className="text-xs font-medium tracking-wider uppercase opacity-70">
                  CalDoc Web App
                </span>
                <h2 className="font-serif text-3xl mt-3 mb-4 leading-snug">
                  Healthcare that comes to you.
                </h2>
                <p className="text-sm opacity-70 mb-8 leading-relaxed">
                  Book teleconsultations, manage prescriptions, and access your complete health records — right from your browser.
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-0">
                  <div className="flex-1 text-center">
                    <span className="text-2xl font-serif font-bold">500+</span>
                    <span className="block text-xs opacity-60 mt-1">Consults</span>
                  </div>
                  <div className="w-px h-10 bg-primary-foreground/20" />
                  <div className="flex-1 text-center">
                    <span className="text-2xl font-serif font-bold">12+</span>
                    <span className="block text-xs opacity-60 mt-1">Doctors</span>
                  </div>
                  <div className="w-px h-10 bg-primary-foreground/20" />
                  <div className="flex-1 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-2xl font-serif font-bold">4.8</span>
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <span className="block text-xs opacity-60 mt-1">Rating</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  {stat.icon && <stat.icon className="w-5 h-5 text-primary-foreground fill-primary-foreground" />}
                  <span className="text-3xl lg:text-4xl font-serif font-bold text-primary-foreground">
                    {stat.value}
                  </span>
                </div>
                <span className="text-sm text-primary-foreground/70">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 lg:py-32 bg-card">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl lg:text-5xl text-foreground mb-4">
              Everything you need,
              <br className="hidden sm:block" />
              one app.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Designed for Indian healthcare — works offline, supports UPI, and speaks your language.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {appFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group p-8 rounded-3xl bg-background shadow-soft hover:shadow-elevated transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-500">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                </div>
                <h3 className="font-serif text-xl text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* App Screenshots Showcase */}
      <section className="py-24 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl lg:text-5xl text-foreground mb-4">
              See it in action
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A glimpse of what CalDoc looks like on your phone
            </p>
          </motion.div>

          <div className="flex justify-center items-end gap-6 md:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="hidden md:block"
            >
              <img
                src={appMockup3}
                alt="CalDoc health records screen"
                className="w-48 lg:w-56 rounded-[1.5rem] shadow-elevated opacity-80"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <img
                src={appMockup1}
                alt="CalDoc appointment booking screen"
                className="w-56 lg:w-72 rounded-[2rem] shadow-elevated"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="hidden md:block"
            >
              <img
                src={appMockup2}
                alt="CalDoc video consultation screen"
                className="w-48 lg:w-56 rounded-[1.5rem] shadow-elevated opacity-80"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl lg:text-5xl text-foreground mb-4">
              Get started in minutes
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-serif font-bold text-primary">{s.step}</span>
                </div>
                <h3 className="font-serif text-lg text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 lg:py-32 bg-primary">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl lg:text-5xl text-primary-foreground mb-6">
              Download CalDoc today
            </h2>
            <p className="text-primary-foreground/70 max-w-lg mx-auto mb-10 text-lg">
              Join 500,000+ Indians who trust CalDoc for their healthcare needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="h-14 px-8 bg-background hover:bg-background/90 text-foreground rounded-2xl font-medium gap-3"
              >
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <span className="text-[10px] block opacity-60 leading-none">GET IT ON</span>
                  <span className="text-sm font-semibold leading-tight">Google Play</span>
                </div>
              </Button>
              <Button
                size="lg"
                className="h-14 px-8 bg-background hover:bg-background/90 text-foreground rounded-2xl font-medium gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <span className="text-[10px] block opacity-60 leading-none">Download on the</span>
                  <span className="text-sm font-semibold leading-tight">App Store</span>
                </div>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
