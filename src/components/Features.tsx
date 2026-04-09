import { motion } from "framer-motion";
import { Video, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Virtual Care",
    description: "Connect face-to-face with doctors through secure video consultations.",
  },
  {
    icon: Shield,
    title: "Trusted Experts",
    description: "Verified specialists with years of experience in their fields.",
  },
  {
    icon: Clock,
    title: "Quick Access",
    description: "Book appointments in minutes, get care when you need it.",
  },
];

export function Features() {
  return (
    <section id="why" className="py-20 lg:py-28">
      <div className="container mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
            Why Choose Us
          </p>
          <h2 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
            Healthcare where comfort meets care
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors"
            >
              <div className="w-10 h-10 mb-5 rounded-lg bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
