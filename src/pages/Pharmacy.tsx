import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Pill, Truck, Clock, ShieldCheck, ChevronDown, Upload, ShoppingCart, X, Minus, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAppAuth } from "@/contexts/AppAuthContext";
import { useRazorpay } from "@/hooks/useRazorpay";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
  { id: "med-1", name: "Dolo 650mg", category: "Pain Relief", pricePaise: 3000, discount: "15% off" },
  { id: "med-2", name: "Crocin Advance", category: "Fever", pricePaise: 2500, discount: "10% off" },
  { id: "med-3", name: "Shelcal 500mg", category: "Calcium", pricePaise: 18000, discount: "20% off" },
  { id: "med-4", name: "Becosules Capsules", category: "Vitamins", pricePaise: 12000, discount: "12% off" },
  { id: "med-5", name: "Pan-D Capsule", category: "Digestive", pricePaise: 9500, discount: "18% off" },
  { id: "med-6", name: "Cetirizine 10mg", category: "Allergy", pricePaise: 1500, discount: "10% off" },
];

type CartItem = { id: string; name: string; pricePaise: number; qty: number };

function formatINR(paise: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(paise / 100);
}

export default function Pharmacy() {
  const heroPharmacy = getDailyImage(pharmacyImages);
  const navigate = useNavigate();
  const { user } = useAppAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const totalPaise = cart.reduce((sum, i) => sum + i.pricePaise * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const addToCart = (med: typeof popularMeds[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === med.id);
      if (existing) return prev.map((i) => i.id === med.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: med.id, name: med.name, pricePaise: med.pricePaise, qty: 1 }];
    });
    toast.success(`${med.name} added to cart`);
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter((i) => i.qty > 0));
  };

  const removeItem = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));

  const { initiatePayment, loading: paymentLoading } = useRazorpay({
    description: "CalDoc Pharmacy Order",
    prefill: { email: user?.email || "" },
    onSuccess: () => {
      setCart([]);
      setCartOpen(false);
      setCheckingOut(false);
      toast.success("Order placed successfully!");
    },
    onError: () => setCheckingOut(false),
  });

  const handleCheckout = async () => {
    if (!user) {
      toast.info("Please log in to place an order");
      navigate("/login?portal=patient");
      return;
    }
    if (cart.length === 0) return;

    setCheckingOut(true);
    try {
      // Create pharmacy order first
      const { data: order, error } = await supabase
        .from("pharmacy_orders")
        .insert({
          patient_id: user.id,
          patient_name: user.email?.split("@")[0] || "Patient",
          items: cart.map((i) => ({ name: i.name, qty: i.qty, price_paise: i.pricePaise })),
          amount_paise: totalPaise,
          delivery_mode: "Delivery",
          status: "AWAITING_PAYMENT",
        })
        .select("id")
        .single();

      if (error) throw error;

      await initiatePayment({
        amount_paise: totalPaise,
        rx_order_id: order.id,
      });
    } catch (err: any) {
      if (err.message !== "Payment cancelled") {
        toast.error(err.message || "Checkout failed");
      }
      setCheckingOut(false);
    }
  };

  return (
    <Layout>
      {/* Floating cart button */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetTrigger asChild>
          <button className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-semibold">{cartCount}</span>
            {totalPaise > 0 && <span className="text-sm">• {formatINR(totalPaise)}</span>}
          </button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle>Your Cart ({cartCount} items)</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Your cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{formatINR(item.pricePaise)} each</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="font-semibold text-sm text-foreground w-16 text-right">{formatINR(item.pricePaise * item.qty)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Total</span>
                <span className="text-lg font-bold text-foreground">{formatINR(totalPaise)}</span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={checkingOut || paymentLoading}
                className="w-full rounded-xl h-12 gap-2"
              >
                {(checkingOut || paymentLoading) && <Loader2 className="w-4 h-4 animate-spin" />}
                {checkingOut ? "Processing…" : `Pay ${formatINR(totalPaise)}`}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

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
            {popularMeds.map((med, i) => {
              const inCart = cart.find((c) => c.id === med.id);
              return (
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
                      <span className="font-semibold text-foreground">{formatINR(med.pricePaise)}</span>
                      <span className="text-xs text-primary font-medium">{med.discount}</span>
                    </div>
                  </div>
                  {inCart ? (
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateQty(med.id, -1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{inCart.qty}</span>
                      <button onClick={() => updateQty(med.id, 1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <Button size="sm" className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => addToCart(med)}>
                      Add
                    </Button>
                  )}
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
