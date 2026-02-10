import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Video, Phone } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const allDoctors = [
  { slug: "dr-asha-menon", name: "Dr. Asha Menon", specialty: "Pediatrics", fee: 499 },
  { slug: "dr-farhan-siddiqui", name: "Dr. Farhan Siddiqui", specialty: "Gastroenterology", fee: 499 },
  { slug: "dr-geeta-balakrishnan", name: "Dr. Geeta Balakrishnan", specialty: "Neurology", fee: 499 },
  { slug: "dr-kavya-rao", name: "Dr. Kavya Rao", specialty: "Cardiology", fee: 499 },
  { slug: "dr-lidiya-thomas", name: "Dr. Lidiya Thomas", specialty: "Endocrinology", fee: 499 },
  { slug: "dr-ramadevi", name: "Dr. RamaDevi", specialty: "General Medicine", fee: 499 },
  { slug: "dr-rohan-iyer", name: "Dr. Rohan Iyer", specialty: "Dermatology", fee: 499 },
  { slug: "dr-priya-sharma", name: "Dr. Priya Sharma", specialty: "Psychiatry", fee: 599 },
  { slug: "dr-suresh-nair", name: "Dr. Suresh Nair", specialty: "Orthopedics", fee: 599 },
  { slug: "dr-meena-krishnan", name: "Dr. Meena Krishnan", specialty: "ENT", fee: 499 },
];

const generateSlots = () => {
  const slots = [];
  const now = new Date();
  for (let i = 0; i < 8; i++) {
    const slotTime = new Date(now.getTime() + (i + 1) * 30 * 60 * 1000);
    slots.push({
      id: i,
      date: slotTime.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
      time: slotTime.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }),
    });
  }
  return slots;
};

const symptoms = ["Fever", "Headache", "Dizziness", "Chest pain", "Sore throat", "Cough", "Cold", "Other"];

const BookDoctor = () => {
  const { doctorSlug } = useParams();
  const doctor = allDoctors.find((d) => d.slug === doctorSlug) || allDoctors[0];
  const slots = useMemo(() => generateSlots(), []);

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [connectionPref, setConnectionPref] = useState("video");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-20 pb-10">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Back link */}
          <Link
            to="/providers"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to doctors
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5"
          >
            <h1 className="font-serif text-2xl lg:text-3xl text-foreground">
              Book {doctor.name} <span className="text-muted-foreground font-sans text-base">· {doctor.specialty}</span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Select a slot, enter patient details, and accept the telemedicine consent to continue.
            </p>
          </motion.div>

          {/* Main Layout */}
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 space-y-4"
            >
              {/* Time Slots */}
              <div className="glass rounded-2xl p-4 shadow-soft">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`rounded-xl px-3 py-2 text-left transition-all duration-200 border ${
                        selectedSlot === slot.id
                          ? "bg-primary text-primary-foreground border-primary shadow-soft"
                          : "bg-card border-border hover:border-primary/40"
                      }`}
                    >
                      <p className={`text-sm font-medium ${selectedSlot === slot.id ? "text-primary-foreground" : "text-foreground"}`}>
                        {slot.date}
                      </p>
                      <p className={`text-xs ${selectedSlot === slot.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {slot.time} · ₹{doctor.fee}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Details + Connection Preference */}
              <div className="glass rounded-2xl p-4 shadow-soft space-y-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Patient Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Patient full name</label>
                      <Input
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="bg-background/50 border-border rounded-xl h-9"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Mobile number</label>
                      <Input
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="bg-background/50 border-border rounded-xl h-9"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Connection Preference</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setConnectionPref("video")}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border transition-all duration-200 ${
                        connectionPref === "video"
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                        connectionPref === "video" ? "border-primary" : "border-muted-foreground"
                      }`}>
                        {connectionPref === "video" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </div>
                      <Video className={`w-3.5 h-3.5 ${connectionPref === "video" ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-sm ${connectionPref === "video" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        Video call
                      </span>
                    </button>
                    <button
                      onClick={() => setConnectionPref("audio")}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border transition-all duration-200 ${
                        connectionPref === "audio"
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                        connectionPref === "audio" ? "border-primary" : "border-muted-foreground"
                      }`}>
                        {connectionPref === "audio" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </div>
                      <Phone className={`w-3.5 h-3.5 ${connectionPref === "audio" ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-sm ${connectionPref === "audio" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        Audio-only
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Consent */}
              <div className="glass rounded-2xl px-4 py-3 shadow-soft">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={consent}
                    onCheckedChange={(v) => setConsent(v === true)}
                    className="mt-0.5"
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    I confirm that I have read the disclaimer and consent to receiving medical advice via telemedicine. Read our{" "}
                    <span className="text-primary hover:underline cursor-pointer">disclaimer</span> and{" "}
                    <span className="text-primary hover:underline cursor-pointer">terms of service</span>.
                  </span>
                </label>
              </div>
            </motion.div>

            {/* Right Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-72 shrink-0 space-y-4"
            >
              {/* Symptoms */}
              <div className="glass rounded-2xl p-4 shadow-soft">
                <h3 className="font-serif text-base text-foreground mb-1">Common symptoms</h3>
                <p className="text-xs text-muted-foreground mb-3">Select all that apply.</p>
                <div className="grid grid-cols-2 gap-2">
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
              <div className="glass rounded-2xl p-4 shadow-soft">
                <h3 className="font-serif text-base text-foreground mb-2">Notes (optional)</h3>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Symptoms, duration, or remarks"
                  className="bg-background/50 border-border rounded-xl min-h-[80px] resize-none text-sm"
                />
              </div>

              {/* Continue Button */}
              <Button
                className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium shadow-soft"
                disabled={!selectedSlot && selectedSlot !== 0}
              >
                Continue
              </Button>
            </motion.aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookDoctor;
