import { motion } from "framer-motion";
import { Search, Pill, Truck, Clock, ShieldCheck, ChevronDown, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import heroPharmacy from "@/assets/hero-pharmacy.jpg";

const categories = [
  { name: "Pain Relief", icon: "💊" },
  { name: "Vitamins", icon: "🧬" },
  { name: "Skin Care", icon: "🧴" },
  { name: "Diabetes", icon: "🩸" },
  { name: "Heart Health", icon: "❤️" },
  { name: "Immunity", icon: "🛡️" },
  { name: "Digestive", icon: "🫁" },
  { name: "Women's Health", icon: "🌸" },
];

const features = [
  { icon: Truck, title: "Free Delivery", desc: "On orders above ₹499" },
  { icon: Clock, title: "Same-Day Dispatch", desc: "Order before 2 PM" },
  { icon: ShieldCheck, title: "Genuine Medicines", desc: "100% authentic products" },
  { icon: Pill, title: "Prescription Upload", desc: "Easy Rx upload & refill" },
];

const popularMeds = [
  { name: "Dolo 650mg", category: "Pain Relief", price: "₹30", discount: "15% off" },
  { name: "Crocin Advance", category: "Fever", price: "₹25", discount: "10% off" },
  { name: "Shelcal 500mg", category: "Calcium", price: "₹180", discount: "20% off" },
  { name: "Becosules Capsules", category: "Vitamins", price: "₹120", discount: "12% off" },
  { name: "Pan-D Capsule", category: "Digestive", price: "₹95", discount: "18% off" },
  { name: "Cetirizine 10mg", category: "Allergy", price: "₹15", discount: "10% off" },
];

export default function Pharmacy() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img src={heroPharmacy} alt="Pharmacy shelves" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        </div>

        <div className="container relative mx-auto px-6 lg:px-12 py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-4">
              Your medicines,
              <br />
              <span className="text-primary">delivered fast.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
              Search by medicine name or upload your prescription for instant ordering.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="glass rounded-2xl p-2 shadow-elevated flex flex-col sm:flex-row gap-2 max-w-xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search medicines, health products..."
                    className="h-12 pl-10 bg-background/50 border-0 rounded-xl focus-visible:ring-1"
                  />
                </div>
                <Button className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium whitespace-nowrap">
                  Search
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Free delivery above ₹499
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Genuine medicines
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Easy returns
                </span>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="rounded-xl h-11 px-8 border-border bg-background/60 hover:bg-background font-medium gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Prescription
                </Button>
              </div>
            </motion.div>

            <motion.a
              href="#categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="hidden lg:inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer mt-10"
            >
              Browse Categories
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 lg:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-3">Shop by Category</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Find what you need, fast</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl p-5 text-center hover:shadow-elevated transition-all duration-300 cursor-pointer"
              >
                <span className="text-3xl mb-2 block">{cat.icon}</span>
                <span className="text-sm font-medium text-foreground">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Medicines */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-3">Popular Medicines</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Frequently ordered by our customers</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {popularMeds.map((med, i) => (
              <motion.div
                key={med.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass rounded-2xl p-5 flex items-center justify-between hover:shadow-elevated transition-all duration-300"
              >
                <div>
                  <h3 className="font-medium text-foreground">{med.name}</h3>
                  <p className="text-xs text-muted-foreground">{med.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-semibold text-foreground">{med.price}</span>
                    <span className="text-xs text-primary font-medium">{med.discount}</span>
                  </div>
                </div>
                <Button size="sm" className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
                  Add
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl lg:text-4xl mb-4">Have a Prescription?</h2>
            <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
              Upload your prescription and we'll deliver your medicines to your doorstep.
            </p>
            <Button
              variant="outline"
              className="rounded-xl h-12 px-10 border-primary-foreground/30 text-primary-foreground bg-white/10 hover:bg-white/20 font-medium gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Prescription
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
