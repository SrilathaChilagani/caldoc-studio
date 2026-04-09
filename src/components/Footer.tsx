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
    <footer className="bg-foreground text-background py-12 lg:py-16">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-semibold text-sm text-primary-foreground">C</span>
              </div>
              <span className="text-lg font-semibold">CalDoc</span>
            </div>
            <p className="text-background/50 text-sm mb-5 max-w-xs leading-relaxed">
              Making quality healthcare accessible to everyone, anywhere. Telemedicine made simple.
            </p>
            <div className="flex gap-2">
              {["𝕏", "in", "📷", "▶"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors text-xs"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-medium mb-3 capitalize">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-sm text-background/50 hover:text-background transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-background/30 text-xs">© 2025 CalDoc. All rights reserved.</p>
          <p className="text-background/30 text-xs">Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
