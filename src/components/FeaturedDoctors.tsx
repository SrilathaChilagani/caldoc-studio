import { motion } from "framer-motion";
import { Star, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const doctors = [
  {
    name: "Dr. Asha Menon",
    specialty: "Pediatrics",
    rating: 4.9,
    reviews: 128,
    languages: ["English", "Hindi", "Malayalam"],
    available: true,
    image: "AM",
    color: "from-primary to-teal-600",
  },
  {
    name: "Dr. RamaDevi",
    specialty: "General Medicine",
    qualification: "MBBS, MD",
    rating: 4.8,
    reviews: 256,
    languages: ["English", "Telugu"],
    available: true,
    image: "RD",
    color: "from-coral to-rose-500",
  },
  {
    name: "Dr. Rohan Iyer",
    specialty: "Dermatology",
    rating: 4.9,
    reviews: 189,
    languages: ["English", "Marathi"],
    available: false,
    image: "RI",
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "Dr. Priya Sharma",
    specialty: "Cardiology",
    qualification: "MBBS, DM",
    rating: 4.7,
    reviews: 312,
    languages: ["English", "Hindi"],
    available: true,
    image: "PS",
    color: "from-sky-500 to-blue-600",
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
  visible: { opacity: 1, y: 0 },
};

export function FeaturedDoctors() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Featured doctors
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with experienced healthcare professionals for personalized care
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
              whileHover={{ y: -8 }}
              className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 border border-border"
            >
              {/* Avatar */}
              <div className="relative mb-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${doctor.color} flex items-center justify-center mx-auto`}>
                  <span className="text-2xl font-bold text-primary-foreground">
                    {doctor.image}
                  </span>
                </div>
                {doctor.available && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    Available
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="font-semibold text-foreground text-lg mb-1">
                  {doctor.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-2">
                  {doctor.specialty}
                </p>
                {doctor.qualification && (
                  <p className="text-xs text-muted-foreground mb-3">
                    {doctor.qualification}
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-medium text-foreground">
                    {doctor.rating}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({doctor.reviews} reviews)
                  </span>
                </div>

                {/* Languages */}
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-6">
                  <Globe className="w-3 h-3" />
                  {doctor.languages.join(", ")}
                </div>

                <Button
                  className="w-full bg-primary hover:bg-teal-600 text-primary-foreground"
                  size="sm"
                >
                  Book online
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
          <Button
            variant="outline"
            size="lg"
            className="group border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            View all doctors
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
