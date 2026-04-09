import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight mb-4">
              Get in Touch
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm">
              Have questions? We're here to help. Reach out and our team will get back to you within 24 hours.
            </p>

            <div className="space-y-4">
              {[
                { icon: Phone, label: "Call us", value: "+91 800 123 4567" },
                { icon: Mail, label: "Email us", value: "hello@caldoc.in" },
                { icon: MapPin, label: "Visit us", value: "Bangalore, India" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-background rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-5">
                Send us a message
              </h3>
              <form className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <Input placeholder="First Name" className="h-10 rounded-lg bg-muted/50 border-border text-sm" />
                  <Input placeholder="Last Name" className="h-10 rounded-lg bg-muted/50 border-border text-sm" />
                </div>
                <Input placeholder="Email Address" type="email" className="h-10 rounded-lg bg-muted/50 border-border text-sm" />
                <Input placeholder="Phone Number" type="tel" className="h-10 rounded-lg bg-muted/50 border-border text-sm" />
                <textarea
                  placeholder="Your Message"
                  rows={3}
                  className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
                <Button type="submit" className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium">
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
