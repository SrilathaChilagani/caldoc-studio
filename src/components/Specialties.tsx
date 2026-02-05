import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const specialties = [
  {
    name: "Dermatology",
    description: "Skin, hair & nail care",
    color: "from-rose-400 to-rose-600",
    icon: "🩹",
  },
  {
    name: "Pediatrics",
    description: "Child healthcare",
    color: "from-sky-400 to-sky-600",
    icon: "👶",
  },
  {
    name: "Cardiology",
    description: "Heart & cardiovascular",
    color: "from-red-400 to-red-600",
    icon: "❤️",
  },
  {
    name: "ENT",
    description: "Ear, nose & throat",
    color: "from-amber-400 to-amber-600",
    icon: "👂",
  },
  {
    name: "Orthopedics",
    description: "Bones & joints",
    color: "from-emerald-400 to-emerald-600",
    icon: "🦴",
  },
  {
    name: "Psychiatry",
    description: "Mental wellness",
    color: "from-violet-400 to-violet-600",
    icon: "🧠",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function Specialties() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Browse by specialty
            </h2>
            <p className="text-muted-foreground">
              Find the right specialist for your health needs
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            See all doctors
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {specialties.map((specialty) => (
            <motion.a
              key={specialty.name}
              href="#"
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 border border-border overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${specialty.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative">
                <span className="text-4xl mb-4 block">{specialty.icon}</span>
                <h3 className="font-semibold text-foreground mb-1">
                  {specialty.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {specialty.description}
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
