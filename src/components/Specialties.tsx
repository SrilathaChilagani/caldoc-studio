import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const specialties = [
  {
    name: "Dermatology",
    description: "Skin, hair & nail treatments",
    image: "🩹",
    doctors: 24,
  },
  {
    name: "Pediatrics",
    description: "Complete child healthcare",
    image: "👶",
    doctors: 18,
  },
  {
    name: "Cardiology",
    description: "Heart & cardiovascular care",
    image: "❤️",
    doctors: 12,
  },
  {
    name: "Psychiatry",
    description: "Mental health & wellness",
    image: "🧠",
    doctors: 15,
  },
  {
    name: "Orthopedics",
    description: "Bone & joint specialists",
    image: "🦴",
    doctors: 20,
  },
  {
    name: "ENT",
    description: "Ear, nose & throat care",
    image: "👂",
    doctors: 16,
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Specialties() {
  return (
    <section id="specialties" className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <h2 className="font-serif text-3xl lg:text-5xl text-foreground mb-3">
              Browse Specialties
            </h2>
            <p className="text-muted-foreground">
              Find the right specialist for your health needs
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View all specialties
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          {specialties.map((specialty) => (
            <motion.a
              key={specialty.name}
              href="#"
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group bg-card rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-soft hover:shadow-elevated transition-all duration-500"
            >
              <span className="text-4xl lg:text-5xl mb-4 block">{specialty.image}</span>
              <h3 className="font-serif text-lg lg:text-xl text-foreground mb-1">
                {specialty.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {specialty.description}
              </p>
              <p className="text-xs text-primary font-medium">
                {specialty.doctors}+ doctors
              </p>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
