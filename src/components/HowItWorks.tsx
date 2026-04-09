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

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight mb-4">
              Your journey to better health,{" "}
              <span className="text-primary">simplified.</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              From booking to follow-up, we've designed every step to be seamless and stress-free.
            </p>
          </motion.div>

          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-4 items-start p-4 rounded-xl bg-background border border-border hover:border-primary/20 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-medium text-muted-foreground">{step.number}</span>
                    <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
