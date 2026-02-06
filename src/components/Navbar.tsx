import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const specialties = [
  "Dermatology",
  "Pediatrics", 
  "Cardiology",
  "ENT",
  "Orthopedics",
  "Psychiatry",
  "General Medicine",
];

const services = [
  { name: "Rx Delivery", href: "#" },
  { name: "Labs at Home", href: "#" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-foreground">
                CAL<span className="text-primary">DOC</span>
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1 tracking-wide">
                TELEMEDICINE MADE SIMPLE
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </a>
            
            {/* Specialties Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("specialties")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Specialties
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {activeDropdown === "specialties" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-card rounded-xl shadow-elevated border border-border p-2 z-50"
                  >
                    {specialties.map((specialty) => (
                      <a
                        key={specialty}
                        href="#"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                      >
                        {specialty}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("services")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Services
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {activeDropdown === "services" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-card rounded-xl shadow-elevated border border-border p-2 z-50"
                  >
                    {services.map((service) => (
                      <a
                        key={service.name}
                        href={service.href}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                      >
                        {service.name}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Login
            </Button>
            <Button size="sm" className="bg-primary hover:bg-blue-600 text-primary-foreground shadow-soft">
              Find a Doctor
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-border"
            >
              <div className="py-4 space-y-4">
                <a href="/" className="block text-sm font-medium text-foreground">
                  Home
                </a>
                <a href="#" className="block text-sm font-medium text-foreground">
                  Specialties
                </a>
                <a href="#" className="block text-sm font-medium text-foreground">
                  Services
                </a>
                <div className="flex flex-col gap-2 pt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                  <Button size="sm" className="w-full bg-primary text-primary-foreground">
                    Find a Doctor
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
