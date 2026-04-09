import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
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
                  <h1 className="text-2xl font-semibold text-foreground">Reset your password</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter your email and we'll send you a reset link
                  </p>
                </div>

                {sent ? (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-3">
                      Check your email for a password reset link. It may take a minute to arrive.
                    </p>
                    <Link to="/login" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                      <ArrowLeft className="h-4 w-4" /> Back to sign in
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}

                    <Button type="submit" className="w-full rounded-full" disabled={loading}>
                      {loading ? "Sending…" : "Send reset link"}
                    </Button>

                    <p className="text-center">
                      <Link to="/login" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                        <ArrowLeft className="h-4 w-4" /> Back to sign in
                      </Link>
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
