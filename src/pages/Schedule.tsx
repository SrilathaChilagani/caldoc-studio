import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Video,
  Phone,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Calendar as CalendarIcon,
  Shield,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { format, addDays } from "date-fns";
import { useDoctors, type Doctor as DbDoctor } from "@/hooks/useDoctors";

// ── Data ──────────────────────────────────────────────
const specialties = [
  "All",
  "General Medicine",
  "Pediatrics",
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Psychiatry",
  "Neurology",
  "ENT",
  "Gastroenterology",
  "Endocrinology",
];

const insurances = ["Any Insurance", "Aetna", "BlueCross", "Cigna", "United", "Medicare"];

// Doctor type alias for this page
type Doctor = DbDoctor;

// Generate date tabs (today + next 6 days)
const generateDateTabs = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i);
    return {
      date,
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : format(date, "EEE"),
      dateStr: format(date, "MMM d"),
      slotsAvailable: Math.floor(Math.random() * 8) + 2,
    };
  });
};

// Generate time slots for a doctor
const generateTimeSlots = () => {
  const times = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "5:00 PM"];
  const available = times.filter(() => Math.random() > 0.3);
  return available.length > 0 ? available : ["10:00 AM", "2:00 PM"];
};

// ── Components ────────────────────────────────────────

const DoctorCard = ({ doctor, dateTabs }: { doctor: Doctor; dateTabs: ReturnType<typeof generateDateTabs> }) => {
  const navigate = useNavigate();
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Doctor Info */}
        <div className="flex gap-4 lg:w-[340px] shrink-0">
          <img
            src={doctor.image_url || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face"}
            alt={doctor.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-border"
          />
          <div className="min-w-0">
            <h3 className="font-serif text-lg text-foreground font-semibold truncate">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground">{doctor.specialty} · {doctor.experience_years} yrs exp</p>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {doctor.location}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-primary" />
                <span className="text-xs font-semibold">{doctor.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">({doctor.review_count} reviews)</span>
            </div>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {doctor.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px] px-2 py-0 font-medium"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-2">
              {doctor.video_consult && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Video className="w-3.5 h-3.5" /> Video
                </span>
              )}
              {doctor.audio_consult && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" /> Audio
                </span>
              )}
              <span className="text-xs font-semibold text-foreground">₹{(doctor.fee_paise / 100).toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Inline Slot Picker */}
        <div className="flex-1 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-5">
          {/* Date tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
            {dateTabs.slice(0, 5).map((dt, idx) => (
              <button
                key={idx}
                onClick={() => { setSelectedDateIdx(idx); setSelectedTime(null); }}
                className={`flex flex-col items-center px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
                  selectedDateIdx === idx
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <span className="font-medium">{dt.label}</span>
                <span className={selectedDateIdx === idx ? "text-primary-foreground/80" : ""}>{dt.dateStr}</span>
              </button>
            ))}
          </div>

          {/* Time slots */}
          <div className="flex flex-wrap gap-2 mt-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  selectedTime === time
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-foreground hover:border-primary/50"
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          {/* Book button */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {selectedTime
                ? `${dateTabs[selectedDateIdx].label}, ${dateTabs[selectedDateIdx].dateStr} at ${selectedTime}`
                : "Select a time slot"}
            </p>
            <Button
              size="sm"
              disabled={!selectedTime}
              className="rounded-xl px-5"
              onClick={() => navigate(`/book/${doctor.slug}`)}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Page ─────────────────────────────────────────

const Schedule = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedInsurance, setSelectedInsurance] = useState("Any Insurance");
  const [consultType, setConsultType] = useState<"all" | "video" | "audio">("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data: doctors = [], isLoading } = useDoctors();
  const dateTabs = useMemo(() => generateDateTabs(), []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        !searchQuery ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
      const matchesConsult =
        consultType === "all" ||
        (consultType === "video" && doc.video_consult) ||
        (consultType === "audio" && doc.audio_consult);
      return matchesSearch && matchesSpecialty && matchesConsult;
    });
  }, [doctors, searchQuery, selectedSpecialty, consultType]);

  const activeFilterCount = [
    selectedSpecialty !== "All",
    selectedInsurance !== "Any Insurance",
    consultType !== "all",
  ].filter(Boolean).length;

  return (
    <Layout>

      {/* Hero Search Bar */}
      <section className="pt-20 pb-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="font-serif text-3xl lg:text-4xl text-foreground mb-2">
              Find & book a doctor
            </h1>
            <p className="text-muted-foreground text-sm">
              Trusted practitioners · Instant scheduling · Video & audio consultations
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-3 shadow-sm flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doctor name or specialty..."
                className="pl-9 border-0 bg-transparent shadow-none focus-visible:ring-0 h-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl gap-1.5 h-10"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-3.5 h-3.5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <Button size="sm" className="rounded-xl h-10 px-6">
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="container mx-auto px-4 lg:px-12 py-4">
              <div className="bg-card border border-border rounded-2xl p-4 max-w-3xl mx-auto space-y-3">
                {/* Specialty chips */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Specialty</p>
                  <div className="flex flex-wrap gap-1.5">
                    {specialties.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSpecialty(s)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          selectedSpecialty === s
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Consult type */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Consultation Type</p>
                  <div className="flex gap-2">
                    {(["all", "video", "audio"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setConsultType(type)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          consultType === type
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {type === "video" && <Video className="w-3.5 h-3.5" />}
                        {type === "audio" && <Phone className="w-3.5 h-3.5" />}
                        {type === "all" ? "All types" : type === "video" ? "Video" : "Audio"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear filters */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      setSelectedSpecialty("All");
                      setSelectedInsurance("Any Insurance");
                      setConsultType("all");
                    }}
                    className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Clear all filters
                  </button>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Results */}
      <section className="py-6">
        <div className="container mx-auto px-4 lg:px-12">
          {/* Results header */}
          <div className="flex items-center justify-between mb-4 max-w-5xl mx-auto">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredDoctors.length}</span> doctors available
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5 text-primary" />
              All doctors are verified & licensed
            </div>
          </div>

          {/* Doctor cards */}
          <div className="space-y-4 max-w-5xl mx-auto">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} dateTabs={dateTabs} />
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 max-w-5xl mx-auto"
            >
              <p className="text-lg text-muted-foreground">No doctors match your criteria</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search term</p>
            </motion.div>
          )}
        </div>
      </section>

    </Layout>
  );
};

export default Schedule;
