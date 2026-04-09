import { motion } from "framer-motion";
import { CheckCircle, Calendar, Clock, Video, Phone, User, ArrowLeft, Home, Copy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { toast } from "@/hooks/use-toast";

interface BookingState {
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  fee: number;
  patientName: string;
  mobile: string;
  connectionPref: "video" | "audio";
  symptoms: string[];
  notes: string;
}

const BookingConfirmation = () => {
  const location = useLocation();
  const booking = location.state as BookingState | null;

  // Fallback if accessed directly
  const data: BookingState = booking || {
    doctorName: "Dr. Asha Menon",
    specialty: "Pediatrics",
    date: "Today",
    time: "3:30 PM",
    fee: 499,
    patientName: "Patient",
    mobile: "",
    connectionPref: "video",
    symptoms: [],
    notes: "",
  };

  const bookingId = `CD-${Date.now().toString(36).toUpperCase()}`;

  const copyBookingId = () => {
    navigator.clipboard.writeText(bookingId);
    toast({ title: "Copied!", description: "Booking ID copied to clipboard." });
  };

  return (
    <Layout>

      <section className="pt-24 pb-16">
        <div className="container mx-auto px-6 lg:px-12 max-w-2xl">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="font-serif text-2xl lg:text-3xl text-foreground mb-2">
              Appointment Confirmed
            </h1>
            <p className="text-muted-foreground text-sm">
              Your teleconsultation has been booked successfully. Details are below.
            </p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass rounded-2xl shadow-soft overflow-hidden"
          >
            {/* Booking ID Banner */}
            <div className="bg-primary/5 border-b border-border px-6 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Booking ID</p>
                <p className="text-sm font-semibold text-foreground font-mono">{bookingId}</p>
              </div>
              <button
                onClick={copyBookingId}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Doctor Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-lg text-foreground">{data.doctorName}</h2>
                  <p className="text-sm text-muted-foreground">{data.specialty}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Date</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{data.date}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Time</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{data.time}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    {data.connectionPref === "video" ? (
                      <Video className="w-4 h-4 text-primary" />
                    ) : (
                      <Phone className="w-4 h-4 text-primary" />
                    )}
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Mode</span>
                  </div>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {data.connectionPref === "video" ? "Video Call" : "Audio Call"}
                  </p>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-primary font-bold">₹</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Fee</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">₹{data.fee.toFixed(2)}</p>
                </div>
              </div>

              {/* Patient */}
              <div className="border-t border-border pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Patient Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-sm font-medium text-foreground">{data.patientName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mobile</p>
                    <p className="text-sm font-medium text-foreground">{data.mobile || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              {data.symptoms.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Reported Symptoms</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.symptoms.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {data.notes && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Notes for Doctor</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{data.notes}</p>
                </div>
              )}
            </div>

            {/* What's Next */}
            <div className="bg-primary/5 border-t border-border px-6 py-5">
              <h3 className="font-serif text-base text-foreground mb-3">What happens next?</h3>
              <ol className="space-y-2">
                {[
                  "You'll receive a confirmation SMS and email shortly.",
                  "A consultation link will be shared 10 minutes before your slot.",
                  "Join via the link — no app download required.",
                  "Your prescription will be available in your account after the call.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 mt-0.5 font-medium">
                      {i + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 mt-6"
          >
            <Link to="/providers" className="flex-1">
              <Button variant="outline" className="w-full h-11 rounded-xl gap-2">
                <ArrowLeft className="w-4 h-4" />
                Book Another
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button className="w-full h-11 rounded-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

    </Layout>
  );
};

export default BookingConfirmation;
