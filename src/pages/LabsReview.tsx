import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { loadLabCart, saveLabCart, clearLabCart, type LabCartItem } from "@/lib/labCart";
import { useRazorpay } from "@/hooks/useRazorpay";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const UNIT_PRICE_PAISE = 79900; // ₹799 per test

function formatINR(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;
}

export default function LabsReview() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<LabCartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => { setCart(loadLabCart()); }, []);

  const removeItem = (itemName: string) => {
    const normalized = itemName.toLowerCase();
    setCart((prev) => {
      const next = prev.filter((item) => item.name.toLowerCase() !== normalized);
      saveLabCart(next);
      return next;
    });
  };

  const summary = useMemo(() => {
    const items = cart.map((item) => ({
      ...item,
      qty: Math.max(1, Number(item.qty) || 1),
      lineTotal: Math.max(1, Number(item.qty) || 1) * UNIT_PRICE_PAISE,
    }));
    const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
    return { items, total };
  }, [cart]);

  const { initiatePayment, loading: paymentLoading } = useRazorpay({
    description: "Lab Order",
    onSuccess: () => {
      clearLabCart();
      toast.success("Lab tests booked successfully!");
      navigate("/labs");
    },
  });

  const handleCheckout = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in all details");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to place an order");
        navigate("/login");
        return;
      }

      const { data: order, error } = await supabase.from("lab_orders").insert({
        patient_id: user.id,
        patient_name: name,
        patient_phone: phone,
        delivery_address: address,
        delivery_mode: "home_collection",
        amount_paise: summary.total,
        tests: summary.items.map((i) => ({ name: i.name, qty: i.qty })),
        status: "PENDING",
      }).select("id").single();

      if (error) throw error;

      await initiatePayment({
        amount_paise: summary.total,
        lab_order_id: order.id,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to create order");
    }
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-6 lg:px-12 py-20">
          <Button variant="ghost" size="sm" className="mb-4 gap-1.5 text-muted-foreground" onClick={() => navigate("/labs")}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="mt-8 glass rounded-3xl p-8 text-center shadow-elevated">
            <h1 className="font-serif text-3xl text-foreground">Your order is empty</h1>
            <p className="mt-3 text-sm text-muted-foreground">Add tests from the search page to review your order.</p>
            <Button className="mt-6 rounded-full" onClick={() => navigate("/labs/search")}>Go to search</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <Button variant="ghost" size="sm" className="mb-4 gap-1.5 text-muted-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <section className="glass rounded-[32px] p-8 shadow-elevated">
            <h1 className="font-serif text-3xl text-foreground">Review your lab order</h1>
            <p className="mt-2 text-sm text-muted-foreground">Confirm tests and totals before proceeding to payment.</p>

            <div className="mt-6 space-y-4">
              {summary.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {item.qty}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">{formatINR(item.lineTotal)}</span>
                    <button type="button" onClick={() => removeItem(item.name)} className="text-xs font-semibold text-destructive hover:text-destructive/80">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="text-lg font-semibold text-foreground">{formatINR(summary.total)}</span>
            </div>

            <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800 px-5 py-4 text-sm text-yellow-900 dark:text-yellow-200">
              <p className="font-semibold">Lab Order Notice</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-yellow-800 dark:text-yellow-300">
                <li>Certain tests require a doctor's prescription or referral.</li>
                <li>All collections are performed by trained phlebotomists from NABL-accredited labs.</li>
                <li>Results are confidential and shared only with you and your treating physician.</li>
              </ul>
            </div>
          </section>

          <section className="glass rounded-[32px] p-8 shadow-elevated">
            <h2 className="font-serif text-xl text-foreground">Collection details</h2>
            <p className="mt-2 text-sm text-muted-foreground">Provide contact details for home sample collection.</p>

            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="lab-name">Full Name</Label>
                <Input id="lab-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
              </div>
              <div>
                <Label htmlFor="lab-phone">Phone Number</Label>
                <Input id="lab-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div>
                <Label htmlFor="lab-address">Collection Address</Label>
                <Input id="lab-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address for sample collection" />
              </div>
              <Button className="w-full rounded-xl h-12 mt-4" disabled={paymentLoading} onClick={handleCheckout}>
                {paymentLoading ? "Processing..." : `Pay ${formatINR(summary.total)}`}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
