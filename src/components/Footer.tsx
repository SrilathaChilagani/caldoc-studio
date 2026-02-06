import { motion } from "framer-motion";

const footerLinks = {
  company: [
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Press", href: "#" },
  ],
  services: [
    { name: "Find Doctors", href: "#" },
    { name: "Rx Delivery", href: "#" },
    { name: "Labs at Home", href: "#" },
    { name: "Health Plans", href: "#" },
  ],
  legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="font-serif text-xl text-primary-foreground">C</span>
              </div>
              <span className="font-serif text-2xl">CalDoc</span>
            </div>
            <p className="text-background/60 mb-6 max-w-sm leading-relaxed">
              Making quality healthcare accessible to everyone, anywhere. 
              Telemedicine made simple.
            </p>
            <div className="flex gap-4">
              {["𝕏", "in", "📷", "▶"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <h4 className="font-medium mb-4 capitalize">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-background/60 hover:text-background transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-background/40 text-sm">
            © 2025 CalDoc. All rights reserved.
          </p>
          <p className="text-background/40 text-sm">
            Made with ❤️ in India
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
