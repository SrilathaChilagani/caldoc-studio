import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Nair",
    location: "Mumbai",
    rating: 5,
    text: "CalDoc made it so easy to consult a dermatologist from home. The doctor was incredibly thorough and my skin has never looked better!",
    avatar: "PN",
  },
  {
    name: "Rahul Krishnan",
    location: "Bangalore",
    rating: 5,
    text: "As a busy professional, I don't have time for clinic visits. CalDoc's video consultations are a game-changer. Highly recommended!",
    avatar: "RK",
  },
  {
    name: "Anjali Sharma",
    location: "Delhi",
    rating: 5,
    text: "The pediatrician on CalDoc helped us at 2 AM when our baby had a fever. The peace of mind is priceless.",
    avatar: "AS",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-28">
      <div className="container mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight mb-2">
            What Our Patients Say
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Real stories from people who found care with CalDoc
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-card rounded-xl border border-border p-6 relative"
            >
              <Quote className="absolute top-5 right-5 w-6 h-6 text-primary/10" />
              
              <div className="flex gap-0.5 mb-3">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-sm text-foreground leading-relaxed mb-5">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
