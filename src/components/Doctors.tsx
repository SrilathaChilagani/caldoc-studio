import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const doctors = [
  {
    name: "Dr. Asha Menon",
    specialty: "Pediatrics",
    experience: "15+ years",
    rating: 4.9,
    reviews: 128,
    languages: ["English", "Hindi", "Malayalam"],
    initials: "AM",
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Dr. RamaDevi",
    specialty: "General Medicine",
    experience: "20+ years",
    rating: 4.8,
    reviews: 256,
    languages: ["English", "Telugu"],
    initials: "RD",
    color: "bg-orange-100 text-orange-600",
  },
  {
    name: "Dr. Rohan Iyer",
    specialty: "Dermatology",
    experience: "12+ years",
    rating: 4.9,
    reviews: 189,
    languages: ["English", "Marathi"],
    initials: "RI",
    color: "bg-violet-100 text-violet-600",
  },
  {
    name: "Dr. Priya Sharma",
    specialty: "Cardiology",
    experience: "18+ years",
    rating: 4.7,
    reviews: 312,
    languages: ["English", "Hindi"],
    initials: "PS",
    color: "bg-rose-100 text-rose-600",
  },
];

export function Doctors() {
  return (
    <section id="doctors" className="py-20 lg:py-28">
      <div className="container mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight mb-2">
            Meet Our Doctors
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Expert healthcare professionals dedicated to your wellbeing
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {doctors.map((doctor, i) => (
            <motion.div
              key={doctor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-card rounded-xl border border-border p-5 hover:border-primary/20 transition-colors"
            >
              <div className={`w-14 h-14 mx-auto mb-4 rounded-xl ${doctor.color} flex items-center justify-center`}>
                <span className="text-lg font-semibold">{doctor.initials}</span>
              </div>

              <div className="text-center">
                <h3 className="text-base font-semibold text-foreground mb-0.5">
                  {doctor.name}
                </h3>
                <p className="text-primary text-xs font-medium mb-0.5">
                  {doctor.specialty}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  {doctor.experience}
                </p>

                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-medium text-foreground">{doctor.rating}</span>
                  <span className="text-xs text-muted-foreground">({doctor.reviews})</span>
                </div>

                <p className="text-xs text-muted-foreground mb-4">
                  {doctor.languages.join(", ")}
                </p>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full rounded-lg text-xs h-8 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                >
                  Book Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link
            to="/providers"
            className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all"
          >
            View all doctors
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
