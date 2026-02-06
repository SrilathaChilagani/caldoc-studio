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
    <section className="py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl lg:text-4xl mb-4">
            Beyond Consultations
          </h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto">
            Complete healthcare services at your fingertips
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {services.map((service, index) => (
            <motion.a
              key={service.title}
              href={service.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group flex items-center gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                <service.icon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-xl mb-1">{service.title}</h3>
                <p className="text-sm text-primary-foreground/70">
                  {service.description}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
