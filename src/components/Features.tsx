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
    <section id="why" className="py-24 lg:py-32 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-sm font-medium tracking-widest uppercase text-primary mb-4">
            Why Choose Us
          </span>
          <h2 className="font-serif text-3xl lg:text-5xl text-foreground mb-5">
            Healthcare where comfort
            <br className="hidden sm:block" />
            meets care.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Experience medical consultations designed around your lifestyle
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 lg:gap-10"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative text-center p-10 rounded-3xl bg-background shadow-soft hover:shadow-elevated transition-all duration-500"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <feature.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
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
