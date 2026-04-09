import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Video, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/Layout";

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
  const navigate = useNavigate();
  const doctor = allDoctors.find((d) => d.slug === doctorSlug) || allDoctors[0];
  const slots = useMemo(() => generateSlots(), []);

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [bookingFor, setBookingFor] = useState<"myself" | "other">("myself");
  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [connectionPref, setConnectionPref] = useState("video");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);

  const slotsRef = useRef<HTMLDivElement>(null);
  const [slotPage, setSlotPage] = useState(0);
  const slotsPerPage = 4;
  const totalPages = Math.ceil(slots.length / slotsPerPage);
  const visibleSlots = slots.slice(slotPage * slotsPerPage, (slotPage + 1) * slotsPerPage);

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
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to doctors
          </Link>

          {/* Main card container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl shadow-soft p-6 lg:p-8"
          >
            {/* Header */}
            <div className="mb-6">
              <h1 className="font-serif text-2xl lg:text-3xl text-foreground">
                Book {doctor.name}{" "}
                <span className="text-muted-foreground font-sans text-base">· {doctor.specialty}</span>
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Select a slot, enter patient details, and accept the telemedicine consent to continue.
              </p>
            </div>

            {/* Two-column layout */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column */}
              <div className="flex-1 space-y-5">
                {/* Time Slots with pagination */}
                <div>
                  <div className="relative" ref={slotsRef}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {visibleSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot.id)}
                          className={`rounded-xl px-4 py-3 text-left transition-all duration-200 border ${
                            selectedSlot === slot.id
                              ? "bg-primary text-primary-foreground border-primary shadow-soft"
                              : "bg-card border-border hover:border-primary/40"
                          }`}
                        >
                          <p className={`text-sm font-medium ${selectedSlot === slot.id ? "text-primary-foreground" : "text-foreground"}`}>
                            {slot.date}
                          </p>
                          <p className={`text-sm ${selectedSlot === slot.id ? "text-primary-foreground" : "text-foreground"}`}>
                            {slot.time}
                          </p>
                          <p className={`text-xs mt-0.5 ${selectedSlot === slot.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                            ₹{doctor.fee.toFixed(2)}
                          </p>
                        </button>
                      ))}
                    </div>

                    {/* Pagination arrows */}
                    <div className="flex justify-between mt-3">
                      <button
                        onClick={() => setSlotPage((p) => Math.max(0, p - 1))}
                        disabled={slotPage === 0}
                        className="text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSlotPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={slotPage >= totalPages - 1}
                        className="text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Patient Details */}
                <div className="glass rounded-2xl p-5 shadow-soft space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Patient Details</h3>

                  {/* Booking for myself / someone else */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setBookingFor("myself")}
                      className={`flex items-center gap-2 rounded-xl px-4 py-3 border transition-all duration-200 ${
                        bookingFor === "myself"
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        bookingFor === "myself" ? "border-primary" : "border-muted-foreground"
                      }`}>
                        {bookingFor === "myself" && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <span className={`text-sm ${bookingFor === "myself" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        Booking for myself
                      </span>
                    </button>
                    <button
                      onClick={() => setBookingFor("other")}
                      className={`flex items-center gap-2 rounded-xl px-4 py-3 border transition-all duration-200 ${
                        bookingFor === "other"
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        bookingFor === "other" ? "border-primary" : "border-muted-foreground"
                      }`}>
                        {bookingFor === "other" && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <span className={`text-sm ${bookingFor === "other" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        Booking for someone else
                      </span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Full name</label>
                      <Input
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="bg-background/50 border-border rounded-xl h-10"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Mobile number</label>
                      <Input
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="+91 or +1 for international"
                        className="bg-background/50 border-border rounded-xl h-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Connection Preference */}
                <div className="glass rounded-2xl p-5 shadow-soft">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Connection Preference</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setConnectionPref("video")}
                      className={`flex items-center gap-2 rounded-xl px-4 py-3 border transition-all duration-200 ${
                        connectionPref === "video"
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        connectionPref === "video" ? "border-primary" : "border-muted-foreground"
                      }`}>
                        {connectionPref === "video" && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <Video className={`w-4 h-4 ${connectionPref === "video" ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-sm ${connectionPref === "video" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        Video call (default)
                      </span>
                    </button>
                    <button
                      onClick={() => setConnectionPref("audio")}
                      className={`flex items-center gap-2 rounded-xl px-4 py-3 border transition-all duration-200 ${
                        connectionPref === "audio"
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        connectionPref === "audio" ? "border-primary" : "border-muted-foreground"
                      }`}>
                        {connectionPref === "audio" && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <Phone className={`w-4 h-4 ${connectionPref === "audio" ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-sm ${connectionPref === "audio" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        Audio-only call
                      </span>
                    </button>
                  </div>
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
                      I confirm that I have read the disclaimer and terms, understand that this is a telemedicine
                      consultation with limitations that may not replace in-person care, consent to a teleconsultation
                      with a registered medical practitioner (NMC/State Medical Council registered), and acknowledge
                      that Schedule X controlled drugs cannot be prescribed via telemedicine. Read our{" "}
                      <span className="text-primary hover:underline cursor-pointer">disclaimer</span> and{" "}
                      <span className="text-primary hover:underline cursor-pointer">terms of service</span>.
                    </span>
                  </label>
                </div>
              </div>

              {/* Right Sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:w-72 shrink-0 space-y-4"
              >
                {/* Symptoms */}
                <div className="glass rounded-2xl p-5 shadow-soft">
                  <h3 className="font-serif text-base text-foreground mb-1">Common symptoms</h3>
                  <p className="text-xs text-muted-foreground mb-3">Select all that apply so the doctor can prepare.</p>
                  <div className="grid grid-cols-2 gap-2.5">
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
                  <h3 className="font-serif text-base text-foreground mb-2">Notes for doctor (optional)</h3>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Symptoms, duration, or remarks"
                    className="bg-background/50 border-border rounded-xl min-h-[100px] resize-none text-sm"
                  />
                </div>

                {/* Continue Button */}
                <Button
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium shadow-soft"
                  disabled={selectedSlot === null || !consent}
                  onClick={() => {
                    const slot = slots.find((s) => s.id === selectedSlot);
                    navigate("/booking-confirmed", {
                      state: {
                        doctorName: doctor.name,
                        specialty: doctor.specialty,
                        date: slot?.date || "",
                        time: slot?.time || "",
                        fee: doctor.fee,
                        patientName,
                        mobile,
                        connectionPref,
                        symptoms: selectedSymptoms,
                        notes,
                      },
                    });
                  }}
                >
                  Continue
                </Button>
              </motion.aside>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookDoctor;
