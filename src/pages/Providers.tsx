import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ArrowLeft, Clock, Globe, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import heroImage from "@/assets/hero-doctor.jpg";

const allDoctors = [
  {
    name: "Dr. Asha Menon",
    specialty: "Pediatrics",
    gender: "Female",
    experience: "12+ years",
    languages: ["English", "Hindi", "Malayalam"],
    fee: 499,
    available24x7: true,
    consultationType: ["video"],
    initials: "AM",
    gradient: "from-primary to-blue-400",
  },
  {
    name: "Dr. Farhan Siddiqui",
    specialty: "Gastroenterology",
    gender: "Male",
    experience: "10+ years",
    languages: ["English", "Hindi", "Urdu"],
    fee: 499,
    available24x7: false,
    consultationType: ["video", "audio"],
    initials: "FS",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    name: "Dr. Geeta Balakrishnan",
    specialty: "Neurology",
    gender: "Female",
    experience: "15+ years",
    languages: ["English", "Malayalam"],
    fee: 499,
    available24x7: false,
    consultationType: ["video"],
    initials: "GB",
    gradient: "from-violet-500 to-purple-400",
  },
  {
    name: "Dr. Kavya Rao",
    specialty: "Cardiology",
    gender: "Female",
    experience: "18+ years",
    languages: ["English", "Hindi", "Telugu"],
    fee: 499,
    available24x7: true,
    consultationType: ["video", "audio"],
    initials: "KR",
    gradient: "from-rose-500 to-pink-400",
  },
  {
    name: "Dr. Lidiya Thomas",
    specialty: "Endocrinology",
    gender: "Female",
    experience: "8+ years",
    languages: ["English", "Malayalam", "Tamil"],
    fee: 499,
    available24x7: true,
    consultationType: ["video"],
    initials: "LT",
    gradient: "from-amber-500 to-orange-400",
  },
  {
    name: "Dr. RamaDevi",
    specialty: "General Medicine",
    gender: "Female",
    experience: "20+ years",
    languages: ["English", "Telugu"],
    fee: 499,
    available24x7: false,
    consultationType: ["video", "audio"],
    initials: "RD",
    gradient: "from-accent to-orange-400",
  },
  {
    name: "Dr. Rohan Iyer",
    specialty: "Dermatology",
    gender: "Male",
    experience: "12+ years",
    languages: ["English", "Marathi"],
    fee: 499,
    available24x7: false,
    consultationType: ["video"],
    initials: "RI",
    gradient: "from-sky-500 to-cyan-400",
  },
  {
    name: "Dr. Priya Sharma",
    specialty: "Psychiatry",
    gender: "Female",
    experience: "14+ years",
    languages: ["English", "Hindi"],
    fee: 599,
    available24x7: true,
    consultationType: ["video", "audio"],
    initials: "PS",
    gradient: "from-indigo-500 to-blue-400",
  },
  {
    name: "Dr. Suresh Nair",
    specialty: "Orthopedics",
    gender: "Male",
    experience: "22+ years",
    languages: ["English", "Hindi", "Malayalam"],
    fee: 599,
    available24x7: false,
    consultationType: ["video"],
    initials: "SN",
    gradient: "from-lime-600 to-green-400",
  },
  {
    name: "Dr. Meena Krishnan",
    specialty: "ENT",
    gender: "Female",
    experience: "16+ years",
    languages: ["English", "Tamil"],
    fee: 499,
    available24x7: false,
    consultationType: ["audio"],
    initials: "MK",
    gradient: "from-fuchsia-500 to-pink-400",
  },
];

const specialties = [
  "Cardiology",
  "Dermatology",
  "ENT",
  "Endocrinology",
  "Gastroenterology",
  "General Medicine",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
];

const availabilityOptions = [
  { label: "Available in next 30 mins", value: "30min" },
  { label: "Available today", value: "today" },
  { label: "Available this week", value: "week" },
  { label: "Any time", value: "any" },
];

const FilterContent = ({
  selectedAvailability,
  setSelectedAvailability,
  selectedConsultation,
  toggleConsultation,
  selectedSpecialties,
  toggleSpecialty,
  clearAll,
}: {
  selectedAvailability: string;
  setSelectedAvailability: (v: string) => void;
  selectedConsultation: string[];
  toggleConsultation: (c: string) => void;
  selectedSpecialties: string[];
  toggleSpecialty: (s: string) => void;
  clearAll: () => void;
}) => (
  <>
    <div className="flex items-center justify-between mb-6">
      <h3 className="font-semibold text-foreground">Filters</h3>
      <button onClick={clearAll} className="text-sm text-primary hover:underline">
        Clear all
      </button>
    </div>

    <div className="mb-6">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Availability</h4>
      <div className="space-y-2.5">
        {availabilityOptions.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="radio"
              name="availability"
              checked={selectedAvailability === opt.value}
              onChange={() => setSelectedAvailability(opt.value)}
              className="w-4 h-4 text-primary border-border accent-primary"
            />
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>

    <div className="mb-6">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Consultation Type</h4>
      <div className="space-y-2.5">
        {["audio", "video"].map((type) => (
          <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
            <Checkbox checked={selectedConsultation.includes(type)} onCheckedChange={() => toggleConsultation(type)} />
            <span className="text-sm text-foreground group-hover:text-primary transition-colors capitalize">{type} call</span>
          </label>
        ))}
      </div>
    </div>

    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Specialty</h4>
      <div className="space-y-2.5">
        {specialties.map((s) => (
          <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
            <Checkbox checked={selectedSpecialties.includes(s)} onCheckedChange={() => toggleSpecialty(s)} />
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">{s}</span>
          </label>
        ))}
      </div>
    </div>
  </>
);

const Providers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState("any");
  const [selectedConsultation, setSelectedConsultation] = useState<string[]>([]);

  const filteredDoctors = useMemo(() => {
    return allDoctors.filter((doc) => {
      const matchesSearch =
        !searchQuery ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.languages.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSpecialty =
        selectedSpecialties.length === 0 ||
        selectedSpecialties.includes(doc.specialty);

      const matchesConsultation =
        selectedConsultation.length === 0 ||
        selectedConsultation.some((c) => doc.consultationType.includes(c));

      return matchesSearch && matchesSpecialty && matchesConsultation;
    });
  }, [searchQuery, selectedSpecialties, selectedConsultation]);

  const toggleSpecialty = (s: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const toggleConsultation = (c: string) => {
    setSelectedConsultation((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const clearAll = () => {
    setSelectedSpecialties([]);
    setSelectedAvailability("any");
    setSelectedConsultation([]);
    setSearchQuery("");
  };

  const activeFilterCount = selectedSpecialties.length + selectedConsultation.length + (selectedAvailability !== "any" ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero-style header */}
      <section className="relative pt-20 pb-16">
        <div className="absolute inset-0 h-[340px]">
          <img
            src={heroImage}
            alt="Find a doctor"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </div>

        <div className="container relative mx-auto px-6 lg:px-12 pt-8">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors mb-8 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Header + Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-6">
              Find a doctor
            </h1>
            <div className="glass rounded-2xl p-2 shadow-elevated flex gap-2 max-w-3xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search specialties, doctor names, symptoms, or registration number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-11 bg-background/50 border-0 rounded-xl focus-visible:ring-1"
                />
              </div>
              <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium">
                Search
              </Button>
            </div>
          </motion.div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-xl gap-2 bg-card border-border">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-background overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="font-serif">Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <FilterContent
                    selectedAvailability={selectedAvailability}
                    setSelectedAvailability={setSelectedAvailability}
                    selectedConsultation={selectedConsultation}
                    toggleConsultation={toggleConsultation}
                    selectedSpecialties={selectedSpecialties}
                    toggleSpecialty={toggleSpecialty}
                    clearAll={clearAll}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Layout */}
          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden lg:block w-64 shrink-0"
            >
              <div className="sticky top-28 glass rounded-2xl p-6 shadow-soft">
                <FilterContent
                  selectedAvailability={selectedAvailability}
                  setSelectedAvailability={setSelectedAvailability}
                  selectedConsultation={selectedConsultation}
                  toggleConsultation={toggleConsultation}
                  selectedSpecialties={selectedSpecialties}
                  toggleSpecialty={toggleSpecialty}
                  clearAll={clearAll}
                />
              </div>
            </motion.aside>

            {/* Doctor Cards */}
            <div className="flex-1 space-y-4">
              {filteredDoctors.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-lg">No doctors found matching your criteria.</p>
                  <button onClick={clearAll} className="text-primary mt-2 hover:underline">
                    Clear filters
                  </button>
                </div>
              )}

              {filteredDoctors.map((doctor, i) => (
                <motion.div
                  key={doctor.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-card rounded-2xl border border-border p-6 flex items-center gap-6 hover:shadow-soft transition-all duration-300"
                >
                  {/* Avatar */}
                  <div
                    className={`w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br ${doctor.gradient} flex items-center justify-center shadow-soft`}
                  >
                    <span className="text-2xl font-serif text-white font-medium">
                      {doctor.initials}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xl text-foreground">
                      {doctor.name}
                    </h3>
                    <p className="text-primary font-medium text-sm">
                      {doctor.specialty}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Gender: {doctor.gender} · Experience: {doctor.experience}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Globe className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {doctor.languages.join(", ")}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Consultation fee: <span className="font-medium text-foreground">₹{doctor.fee}.00</span>
                    </p>
                    {doctor.available24x7 && (
                      <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-primary">
                        <Clock className="w-3 h-3" />
                        Available 24×7
                      </span>
                    )}
                  </div>

                  {/* Right side */}
                  <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                        Next Availability
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        No slots open
                      </p>
                    </div>
                    <Link to={`/book/${doctor.name.toLowerCase().replace(/[\s.]+/g, '-').replace(/^dr-/, 'dr-')}`}>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 font-medium">
                        Book doctor
                      </Button>
                    </Link>
                  </div>

                  {/* Mobile book button */}
                  <div className="sm:hidden">
                    <Link to={`/book/${doctor.name.toLowerCase().replace(/[\s.]+/g, '-').replace(/^dr-/, 'dr-')}`}>
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                        Book
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Providers;
