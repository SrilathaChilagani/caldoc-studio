import { motion } from "framer-motion";
import { Pill, FlaskConical, ArrowRight, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Pill,
    title: "Rx Delivery",
    description: "Get your prescriptions delivered to your doorstep. Fast, convenient, and hassle-free.",
    features: ["Same-day delivery", "Authentic medicines", "Easy refills"],
    color: "from-primary to-teal-600",
    accentColor: "bg-primary/10 text-primary",
    href: "#",
  },
  {
    icon: FlaskConical,
    title: "Labs at Home",
    description: "Book diagnostic tests from the comfort of your home. Professional sample collection.",
    features: ["Home sample collection", "Quick reports", "Trusted labs"],
    color: "from-coral to-rose-500",
    accentColor: "bg-coral/10 text-coral",
    href: "#",
  },
];

export function Services() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Beyond consultations
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete healthcare services at your fingertips
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -8 }}
              className="group relative bg-card rounded-3xl p-8 lg:p-10 shadow-soft hover:shadow-elevated transition-all duration-300 border border-border overflow-hidden"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <div className="relative">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${service.accentColor} mb-6`}>
                  <service.icon className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${service.accentColor}`}>
                        <Clock className="w-3 h-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant="outline"
                  className="group/btn border-border hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
