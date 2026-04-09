import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Video, Phone, AlertTriangle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAppAuth } from "@/contexts/AppAuthContext";
import { toast } from "sonner";

const symptoms = ["Fever", "Headache", "Dizziness", "Chest pain", "Sore throat", "Cough", "Cold", "Breathing difficulty", "Other"];

function generateBookingId() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `EMR-${rand}`;
}

export default function EmergencyBooking() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAppAuth();

  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [connectionPref, setConnectionPref] = useState("VIDEO");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const canSubmit = patientName.trim().length > 0 && mobile.trim().length >= 10 && consent && !submitting;

  async function handleSubmit() {
    if (!user) {
      toast.error("Please sign in to book an emergency appointment.");
      navigate("/login?portal=patient");
      return;
    }
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      const bookingId = generateBookingId();
      const symptomsText = [...selectedSymptoms, notes].filter(Boolean).join("; ");

      const { error } = await supabase.from("emergency_bookings").insert({
        user_id: user.id,
        booking_id: bookingId,
        patient_name: patientName.trim(),
        patient_phone: mobile.trim(),
        consultation_type: connectionPref,
        symptoms: symptomsText || null,
        status: "pending",
      });

      if (error) throw error;

      navigate("/booking-confirmed", {
        state: {
          emergency: true,
          bookingId,
          patientName: patientName.trim(),
          mobile: mobile.trim(),
          connectionPref,
          symptoms: selectedSymptoms,
          notes,
        },
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to create emergency booking");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <section className="pt-20 pb-10">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <Link
            to="/providers"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to doctors
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl shadow-soft p-6 lg:p-8 space-y-6"
          >
            {/* Emergency header */}
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-destructive/10 p-2.5">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h1 className="font-serif text-2xl lg:text-3xl text-foreground">
                  Emergency Visit
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Need urgent medical attention? Submit your details and we'll assign a doctor to you as soon as possible.
                  No slot selection needed — we handle the scheduling.
                </p>
              </div>
            </div>

            {/* Patient Details */}
            <div className="glass rounded-2xl p-5 shadow-soft space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Patient Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Full name *</label>
                  <Input
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    maxLength={100}
                    className="bg-background/50 border-border rounded-xl h-10"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Mobile number *</label>
                  <Input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    maxLength={15}
                    className="bg-background/50 border-border rounded-xl h-10"
                  />
                </div>
              </div>
            </div>

            {/* Connection Preference */}
            <div className="glass rounded-2xl p-5 shadow-soft">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Consultation Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "VIDEO", icon: Video, label: "Video call" },
                  { key: "AUDIO", icon: Phone, label: "Audio call" },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setConnectionPref(key)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-3 border transition-all duration-200 ${
                      connectionPref === key
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      connectionPref === key ? "border-primary" : "border-muted-foreground"
                    }`}>
                      {connectionPref === key && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <Icon className={`w-4 h-4 ${connectionPref === key ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-sm ${connectionPref === key ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div className="glass rounded-2xl p-5 shadow-soft">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Symptoms</h3>
              <p className="text-xs text-muted-foreground mb-3">Select all that apply so the doctor can prepare.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {symptoms.map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer group">
                    <Checkbox
                      checked={selectedSymptoms.includes(s)}
                      onCheckedChange={() => toggleSymptom(s)}
                    />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">{s}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="glass rounded-2xl p-5 shadow-soft">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Additional notes (optional)</h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your condition, duration, or any remarks for the doctor"
                maxLength={1000}
                className="bg-background/50 border-border rounded-xl min-h-[100px] resize-none text-sm"
              />
            </div>

            {/* Consent */}
            <div className="glass rounded-2xl px-5 py-4 shadow-soft">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                  className="mt-0.5"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I confirm that this is a telemedicine consultation with limitations that may not replace in-person care.
                  I consent to a teleconsultation with a registered medical practitioner and acknowledge that
                  Schedule X controlled drugs cannot be prescribed via telemedicine.
                </span>
              </label>
            </div>

            {/* Submit */}
            <Button
              className="w-full h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl font-medium shadow-soft text-base"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                </span>
              ) : (
                "Request Emergency Appointment"
              )}
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
