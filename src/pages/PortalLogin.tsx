import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/Layout";
import { useAppAuth } from "@/contexts/AppAuthContext";

const portalConfig: Record<string, { label: string; color: string; redirect: string; description: string }> = {
  admin: { label: "Admin Portal", color: "text-primary", redirect: "/admin-portal", description: "Manage platform operations" },
  provider: { label: "Provider Portal", color: "text-primary", redirect: "/provider-portal", description: "Manage teleconsultations and patients" },
  pharmacy: { label: "Pharmacy Portal", color: "text-primary", redirect: "/pharmacy-portal", description: "Track prescriptions and fulfilment" },
  labs: { label: "Labs Portal", color: "text-primary", redirect: "/labs-portal", description: "Manage lab orders and results" },
  patient: { label: "Patient Portal", color: "text-primary", redirect: "/patient-portal", description: "View appointments and documents" },
};

export default function PortalLogin() {
  const [searchParams] = useSearchParams();
  const portalKey = searchParams.get("portal") || "admin";
  const config = portalConfig[portalKey] || portalConfig.admin;

  const { signIn, signUp } = useAppAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (isSignUp) {
      if (!displayName.trim()) {
        setError("Display name is required");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, displayName);
      if (error) {
        setError(error);
      } else {
        setSuccess("Account created! Check your email to confirm, then sign in.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        navigate(config.redirect);
      }
    }
    setLoading(false);
  }

  return (
    <Layout>
      <section className="pt-24 pb-10 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="rounded-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${config.color}`}>{config.label}</p>
                  <h1 className="mt-1 text-2xl font-semibold text-foreground">
                    {isSignUp ? "Create your account" : "Welcome back"}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {isSignUp ? "Sign up to get started" : config.description}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-1.5">
                      <Label>Full Name</Label>
                      <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Dr. Rajesh Kumar" required />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={8} required />
                  </div>

                  {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
                  {success && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{success}</p>}

                  <Button type="submit" className="w-full rounded-full" disabled={loading}>
                    {loading ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
                  </Button>
                </form>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccess(null); }} className="text-primary font-medium hover:underline">
                    {isSignUp ? "Sign in" : "Sign up"}
                  </button>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
