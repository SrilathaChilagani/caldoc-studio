import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const doctors = [
  {
    name: "Dr. Asha Menon",
    specialty: "Pediatrics",
    experience: "15+ years",
    rating: 4.9,
    reviews: 128,
    languages: ["English", "Hindi", "Malayalam"],
    initials: "AM",
    gradient: "from-primary to-blue-400",
  },
  {
    name: "Dr. RamaDevi",
    specialty: "General Medicine",
    experience: "20+ years",
    rating: 4.8,
    reviews: 256,
    languages: ["English", "Telugu"],
    initials: "RD",
    gradient: "from-accent to-orange-400",
  },
  {
    name: "Dr. Rohan Iyer",
    specialty: "Dermatology",
    experience: "12+ years",
    rating: 4.9,
    reviews: 189,
    languages: ["English", "Marathi"],
    initials: "RI",
    gradient: "from-violet-500 to-purple-400",
  },
  {
    name: "Dr. Priya Sharma",
    specialty: "Cardiology",
    experience: "18+ years",
    rating: 4.7,
    reviews: 312,
    languages: ["English", "Hindi"],
    initials: "PS",
    gradient: "from-rose-500 to-pink-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function Doctors() {
  return (
    <section id="doctors" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl lg:text-5xl text-foreground mb-4">
            Meet Our Doctors
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Expert healthcare professionals dedicated to your wellbeing
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {doctors.map((doctor) => (
            <motion.div
              key={doctor.name}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group bg-card rounded-3xl p-6 shadow-soft hover:shadow-elevated transition-all duration-500"
            >
              {/* Avatar */}
              <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${doctor.gradient} flex items-center justify-center shadow-soft`}>
                <span className="text-3xl font-serif text-white font-medium">
                  {doctor.initials}
                </span>
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="font-serif text-xl text-foreground mb-1">
                  {doctor.name}
                </h3>
                <p className="text-primary font-medium text-sm mb-1">
                  {doctor.specialty}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  {doctor.experience} experience
                </p>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-medium text-foreground">
                    {doctor.rating}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({doctor.reviews})
                  </span>
                </div>

                {/* Languages */}
                <p className="text-xs text-muted-foreground mb-6">
                  Speaks: {doctor.languages.join(", ")}
                </p>

                <Button
                  size="sm"
                  className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-xl transition-all duration-300"
                >
                  Book Now
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View all doctors
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
