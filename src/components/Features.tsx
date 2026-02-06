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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function Features() {
  return (
    <section id="why" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl lg:text-5xl text-foreground mb-4">
            Healthcare where comfort meets care.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience medical consultations designed around your lifestyle
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group text-center p-8 rounded-3xl bg-card hover:bg-secondary/50 transition-all duration-500"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500">
                <feature.icon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
