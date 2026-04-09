import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navLinks = [
  { name: "Find Doctors", href: "/providers" },
  { name: "Schedule", href: "/schedule" },
  { name: "Pharmacy", href: "/pharmacy" },
  { name: "Labs", href: "/labs" },
];

const portalLinks = [
  { name: "Patient Portal", href: "/patient-portal" },
  { name: "Provider Portal", href: "/provider-portal" },
  { name: "Admin Portal", href: "/admin-portal" },
  { name: "NGO Portal", href: "/ngo-portal" },
  { name: "Pharmacy Portal", href: "/pharmacy-portal" },
  { name: "Labs Portal", href: "/labs-portal" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [portalsOpen, setPortalsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setPortalsOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-16">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => navigate("/")} className="flex items-center">
            <img src="/caldoc-logo.png" alt="CalDoc logo" className="h-9 object-contain" />
          </button>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => navigate(link.href)}
                className={`text-sm transition-colors ${
                  isActive(link.href) ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </button>
            ))}

            {/* Portals dropdown */}
            <div className="relative">
              <button
                onClick={() => setPortalsOpen(!portalsOpen)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Portals
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${portalsOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {portalsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setPortalsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-1.5 z-50"
                    >
                      {portalLinks.map((link) => (
                        <button
                          key={link.name}
                          onClick={() => { navigate(link.href); setPortalsOpen(false); }}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            isActive(link.href) ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted"
                          }`}
                        >
                          {link.name}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden lg:block">
            <button
              onClick={() => navigate("/schedule")}
              className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Book Consultation
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 top-16 bg-background/80 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden border-t border-border bg-background relative z-50"
              >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => navigate(link.href)}
                    className={`block w-full text-left py-2 text-sm transition-colors ${
                      isActive(link.href) ? "text-primary font-medium" : "text-foreground hover:text-primary"
                    }`}
                  >
                    {link.name}
                  </button>
                ))}

                <div className="pt-2 pb-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-0 mb-1">Portals</p>
                  {portalLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => navigate(link.href)}
                      className={`block w-full text-left py-2 text-sm transition-colors ${
                        isActive(link.href) ? "text-primary font-medium" : "text-foreground hover:text-primary"
                      }`}
                    >
                      {link.name}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/schedule")}
                  className="block w-full text-center py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium mt-3"
                >
                  Book Consultation
                </button>
              </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
