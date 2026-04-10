import { motion } from "framer-motion";
import { Search, Pill, Truck, Clock, ShieldCheck, ChevronDown, Upload, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { loadRxCart, saveRxCart, type RxCartItem } from "@/lib/rxCart";
import heroPharmacy1 from "@/assets/hero-pharmacy.jpg";
import heroPharmacy2 from "@/assets/hero-pharmacy-2.jpg";
import heroPharmacy3 from "@/assets/hero-pharmacy-3.jpg";
import heroPharmacy4 from "@/assets/hero-pharmacy-4.jpg";

const pharmacyImages = [heroPharmacy1, heroPharmacy2, heroPharmacy3, heroPharmacy4];

function getDailyImage(images: string[]) {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return images[dayOfYear % images.length];
}

const categories = [
  { name: "Pain Relief", slug: "pain-relief", icon: "💊" },
  { name: "Vitamins", slug: "vitamins", icon: "🧬" },
  { name: "Skin Care", slug: "skin-care", icon: "🧴" },
  { name: "Diabetes", slug: "diabetes", icon: "🩸" },
  { name: "Heart Health", slug: "heart-health", icon: "❤️" },
  { name: "Immunity", slug: "immunity", icon: "🛡️" },
  { name: "Digestive", slug: "digestive", icon: "🫁" },
  { name: "Women's Health", slug: "womens-health", icon: "🌸" },
];

const features = [
  { icon: Truck, title: "Free Delivery", desc: "On orders above ₹499" },
  { icon: Clock, title: "Same-Day Dispatch", desc: "Order before 2 PM" },
  { icon: ShieldCheck, title: "Genuine Medicines", desc: "100% authentic products" },
  { icon: Pill, title: "Prescription Upload", desc: "Easy Rx upload & refill" },
];

const popularMeds = [
  { name: "Dolo 650mg", category: "Pain Relief" },
  { name: "Crocin Advance", category: "Fever" },
  { name: "Shelcal 500mg", category: "Calcium" },
  { name: "Becosules Capsules", category: "Vitamins" },
  { name: "Pan-D Capsule", category: "Digestive" },
  { name: "Cetirizine 10mg", category: "Allergy" },
];

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

export default function Pharmacy() {
  const navigate = useNavigate();
  const heroPharmacy = getDailyImage(pharmacyImages);

  const [cart, setCart] = useState<RxCartItem[]>([]);
  const [draftQty, setDraftQty] = useState<Record<string, number>>({});
  const [draftVisible, setDraftVisible] = useState<Record<string, boolean>>({});

  useEffect(() => { setCart(loadRxCart()); }, []);
  useEffect(() => { saveRxCart(cart); }, [cart]);

  const cartMap = useMemo(() => {
    const map = new Map<string, RxCartItem>();
    cart.forEach((item) => map.set(normalizeName(item.name), item));
    return map;
  }, [cart]);

  const totalItems = cart.reduce((sum, item) => sum + Math.max(1, item.qty || 0), 0);

  const updateCartItem = (med: { name: string; category: string }, qty: number) => {
    const normalized = normalizeName(med.name);
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => normalizeName(item.name) !== normalized));
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      const idx = next.findIndex((item) => normalizeName(item.name) === normalized);
      if (idx >= 0) {
        next[idx] = { ...next[idx], qty };
      } else {
        next.push({ name: med.name, qty });
      }
      return next;
    });
  };

  return (
    <Layout>
      {/* Floating cart badge */}
      {totalItems > 0 && (
        <button
          onClick={() => navigate("/pharmacy/review")}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          {totalItems} item{totalItems !== 1 ? "s" : ""} — Review Order
        </button>
      )}

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
              <form
                onSubmit={(e) => { e.preventDefault(); navigate("/pharmacy/search"); }}
                className="glass rounded-2xl p-2 shadow-elevated flex flex-col sm:flex-row gap-2 max-w-xl"
              >
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    readOnly
                    onFocus={() => navigate("/pharmacy/search")}
                    onClick={() => navigate("/pharmacy/search")}
                    placeholder="Search medicines, health products..."
                    className="h-12 pl-10 bg-background/50 border-0 rounded-xl focus-visible:ring-1 cursor-pointer"
                  />
                </div>
                <Button type="submit" className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium whitespace-nowrap">
                  Search
                </Button>
              </form>

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
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={`/pharmacy/search?category=${encodeURIComponent(cat.slug)}`}
                  className="glass rounded-2xl p-5 text-center hover:shadow-elevated transition-all duration-300 cursor-pointer block"
                >
                  <span className="text-3xl mb-2 block">{cat.icon}</span>
                  <span className="text-sm font-medium text-foreground">{cat.name}</span>
                </Link>
              </motion.div>
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
            {popularMeds.map((med, i) => {
              const cartItem = cartMap.get(normalizeName(med.name));
              const isDraft = draftVisible[normalizeName(med.name)] && !cartItem;
              return (
                <motion.div
                  key={med.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="glass rounded-2xl p-5 flex flex-col gap-4 justify-between hover:shadow-elevated transition-all duration-300"
                >
                  <div>
                    <h3 className="font-medium text-foreground">{med.name}</h3>
                    <p className="text-xs text-muted-foreground">{med.category}</p>
                    <p className="text-sm font-semibold text-foreground mt-1">₹199 / item</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {cartItem ? (
                      <>
                        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1 text-sm text-foreground">
                          <button type="button" onClick={() => updateCartItem(med, Math.max(1, cartItem.qty - 1))} className="h-7 w-7 rounded-full border border-border text-muted-foreground hover:bg-muted">-</button>
                          <input type="number" min={1} max={99} value={cartItem.qty} onChange={(e) => updateCartItem(med, Number(e.target.value) || 1)} className="w-12 bg-transparent text-center text-sm outline-none" />
                          <button type="button" onClick={() => updateCartItem(med, cartItem.qty + 1)} className="h-7 w-7 rounded-full border border-border text-muted-foreground hover:bg-muted">+</button>
                        </div>
                        <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary">Added</span>
                        <button type="button" onClick={() => updateCartItem(med, 0)} className="text-xs font-semibold text-destructive hover:text-destructive/80">Remove</button>
                      </>
                    ) : isDraft ? (
                      <>
                        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1 text-sm text-foreground">
                          <span className="text-xs text-muted-foreground">Qty</span>
                          <input type="number" min={1} max={99} value={draftQty[normalizeName(med.name)] ?? 1}
                            onChange={(e) => setDraftQty((prev) => ({ ...prev, [normalizeName(med.name)]: Math.max(1, Number(e.target.value) || 1) }))}
                            className="w-12 bg-transparent text-center text-sm outline-none" />
                        </div>
                        <Button size="sm" className="rounded-xl" onClick={() => {
                          updateCartItem(med, draftQty[normalizeName(med.name)] ?? 1);
                          setDraftVisible((prev) => ({ ...prev, [normalizeName(med.name)]: false }));
                        }}>Add to order</Button>
                      </>
                    ) : (
                      <Button size="sm" className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => {
                        setDraftVisible((prev) => ({ ...prev, [normalizeName(med.name)]: true }));
                        setDraftQty((prev) => ({ ...prev, [normalizeName(med.name)]: prev[normalizeName(med.name)] ?? 1 }));
                      }}>Add</Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
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
    </Layout>
  );
}
