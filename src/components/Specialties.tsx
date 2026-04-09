import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const specialties = [
  { name: "Dermatology", description: "Skin, hair & nail treatments", image: "🩹", doctors: 24 },
  { name: "Pediatrics", description: "Complete child healthcare", image: "👶", doctors: 18 },
  { name: "Cardiology", description: "Heart & cardiovascular care", image: "❤️", doctors: 12 },
  { name: "Psychiatry", description: "Mental health & wellness", image: "🧠", doctors: 15 },
  { name: "Orthopedics", description: "Bone & joint specialists", image: "🦴", doctors: 20 },
  { name: "ENT", description: "Ear, nose & throat care", image: "👂", doctors: 16 },
];

export function Specialties() {
  return (
    <section id="specialties" className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight mb-1">
              Browse Specialties
            </h2>
            <p className="text-muted-foreground text-sm">
              Find the right specialist for your health needs
            </p>
          </div>
          <a href="#" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all">
            View all specialties
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {specialties.map((specialty, i) => (
            <motion.a
              key={specialty.name}
              href="#"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group bg-background rounded-xl p-5 lg:p-6 border border-border hover:border-primary/30 transition-all"
            >
              <span className="text-3xl mb-3 block">{specialty.image}</span>
              <h3 className="text-base font-semibold text-foreground mb-0.5">
                {specialty.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {specialty.description}
              </p>
              <p className="text-xs text-primary font-medium">
                {specialty.doctors}+ doctors
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
