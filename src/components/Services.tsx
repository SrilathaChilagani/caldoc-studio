import { motion } from "framer-motion";
import { Pill, FlaskConical, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Pill,
    title: "Rx Delivery",
    description: "Get your prescriptions delivered to your doorstep within hours.",
    href: "#",
  },
  {
    icon: FlaskConical,
    title: "Labs at Home",
    description: "Book diagnostic tests with professional home sample collection.",
    href: "#",
  },
];

export function Services() {
  return (
    <section className="py-20 lg:py-28 bg-primary">
      <div className="container mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl lg:text-4xl font-semibold text-primary-foreground tracking-tight mb-2">
            Beyond Consultations
          </h2>
          <p className="text-primary-foreground/60 text-sm max-w-md mx-auto">
            Complete healthcare services at your fingertips
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {services.map((service, i) => (
            <motion.a
              key={service.title}
              href={service.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group flex items-center gap-4 bg-primary-foreground/10 rounded-xl p-5 hover:bg-primary-foreground/15 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                <service.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-primary-foreground mb-0.5">{service.title}</h3>
                <p className="text-xs text-primary-foreground/60">{service.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-primary-foreground/40 group-hover:text-primary-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
