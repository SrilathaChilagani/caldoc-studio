import { motion } from "framer-motion";
import { Search, Calendar, Video, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Search & Compare",
    description: "Filter by specialty, language, rating, and availability to find your perfect match.",
  },
  {
    icon: Calendar,
    number: "02",
    title: "Book & Pay",
    description: "Confirm your slot, accept the consent, and pay securely via UPI or cards.",
  },
  {
    icon: Video,
    number: "03",
    title: "Join Your Visit",
    description: "Get WhatsApp reminders and a video link before your consultation.",
  },
  {
    icon: CheckCircle,
    number: "04",
    title: "Follow Up",
    description: "Receive prescriptions, book follow-ups, and access your health records.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

export function HowItWorks() {
  return (
    <section className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl lg:text-5xl text-foreground mb-6 leading-tight">
              Your journey to better health,{" "}
              <span className="text-primary">simplified.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From booking to follow-up, we've designed every step to be seamless 
              and stress-free. Here's how it works.
            </p>
          </motion.div>

          {/* Right: Steps */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={stepVariants}
                className="flex gap-6 items-start group"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-card shadow-soft flex items-center justify-center group-hover:bg-primary group-hover:shadow-elevated transition-all duration-500">
                    <step.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-primary/60">
                      {step.number}
                    </span>
                    <h3 className="font-serif text-xl text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
