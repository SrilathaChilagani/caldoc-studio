import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Stethoscope,
  User,
  GraduationCap,
  FileText,
} from "lucide-react";

const SPECIALITIES = [
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
  "Gynecology",
  "Ophthalmology",
  "Pulmonology",
  "Urology",
  "Nephrology",
];

const COUNCILS = [
  "Andhra Pradesh Medical Council",
  "Delhi Medical Council",
  "Karnataka Medical Council",
  "Kerala Medical Council",
  "Maharashtra Medical Council",
  "Tamil Nadu Medical Council",
  "Telangana State Medical Council",
  "West Bengal Medical Council",
  "Medical Council of India",
  "Other",
];

const LANGUAGES = [
  "English",
  "Hindi",
  "Telugu",
  "Tamil",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Bengali",
  "Gujarati",
  "Punjabi",
  "Urdu",
];

const STATES = [
  "Andhra Pradesh", "Bihar", "Delhi", "Goa", "Gujarat", "Haryana",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha",
  "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh",
  "West Bengal",
];

const VISIT_MODES = [
  { id: "VIDEO", label: "Video consultation" },
  { id: "AUDIO", label: "Audio consultation" },
  { id: "IN_PERSON", label: "In-person visit" },
];

const steps = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Qualification", icon: GraduationCap },
  { id: 3, label: "Practice", icon: Stethoscope },
  { id: 4, label: "Review", icon: FileText },
];

const ProviderEnrollment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Step 1: Personal
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Step 2: Qualification
  const [qualification, setQualification] = useState("");
  const [university, setUniversity] = useState("");
  const [qualificationYear, setQualificationYear] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [subSpeciality, setSubSpeciality] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [registrationCouncil, setRegistrationCouncil] = useState("");
  const [registrationYear, setRegistrationYear] = useState("");

  // Step 3: Practice
  const [experienceYears, setExperienceYears] = useState("");
  const [currentHospital, setCurrentHospital] = useState("");
  const [feePaise, setFeePaise] = useState("");
  const [languages, setLanguages] = useState<string[]>(["English"]);
  const [visitModes, setVisitModes] = useState<string[]>(["VIDEO"]);
  const [bio, setBio] = useState("");
  const [consentTelemedicine, setConsentTelemedicine] = useState(false);

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const toggleVisitMode = (mode: string) => {
    setVisitModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const canProceed = () => {
    if (step === 1)
      return fullName && email && phone && city && state && speciality;
    if (step === 2)
      return qualification && registrationNumber && registrationCouncil;
    if (step === 3)
      return visitModes.length > 0 && consentTelemedicine;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from("provider_enrollments").insert({
        full_name: fullName,
        email,
        phone,
        gender: gender || null,
        dob: dob || null,
        city,
        state,
        qualification,
        university: university || null,
        qualification_year: qualificationYear ? parseInt(qualificationYear) : null,
        speciality,
        sub_speciality: subSpeciality || null,
        registration_number: registrationNumber,
        registration_council: registrationCouncil,
        registration_year: registrationYear ? parseInt(registrationYear) : null,
        experience_years: experienceYears ? parseInt(experienceYears) : null,
        current_hospital: currentHospital || null,
        fee_paise: feePaise ? parseInt(feePaise) * 100 : null,
        languages,
        visit_modes: visitModes,
        bio: bio || null,
        consent_telemedicine: consentTelemedicine,
      });

      if (error) throw error;
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <section className="pt-24 pb-16">
          <div className="container mx-auto max-w-xl px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-serif text-3xl text-foreground">
                Application received!
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Thank you, Dr. {fullName.split(" ").pop()}. Our team will review
                your application and get back to you within 2–3 business days at{" "}
                <span className="font-medium text-foreground">{email}</span>.
              </p>
              <Button
                className="rounded-xl px-8"
                onClick={() => navigate("/")}
              >
                Back to home
              </Button>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-24 pb-16">
        <div className="container mx-auto max-w-2xl px-4 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Provider enrollment
            </p>
            <h1 className="font-serif text-3xl lg:text-4xl text-foreground mt-1">
              Join our network
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Register as a healthcare provider on CalDoc
            </p>
          </motion.div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2">
            {steps.map((s, idx) => (
              <div key={s.id} className="flex items-center gap-2">
                <button
                  onClick={() => s.id < step && setStep(s.id)}
                  disabled={s.id > step}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    s.id === step
                      ? "bg-primary text-primary-foreground"
                      : s.id < step
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <s.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.id}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-6 h-px ${
                      s.id < step ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Personal */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="rounded-2xl">
                <CardContent className="p-6 space-y-5">
                  <h2 className="text-lg font-semibold text-foreground">
                    Personal information
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor="fullName">Full name *</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Rajesh Kumar"
                        className="mt-1 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="doctor@email.com"
                        className="mt-1 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="mt-1 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className="mt-1 rounded-xl">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dob">Date of birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="mt-1 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="speciality">Speciality *</Label>
                      <Select value={speciality} onValueChange={setSpeciality}>
                        <SelectTrigger className="mt-1 rounded-xl">
                          <SelectValue placeholder="Choose speciality" />
                        </SelectTrigger>
                        <SelectContent>
                          {SPECIALITIES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Hyderabad"
                        className="mt-1 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select value={state} onValueChange={setState}>
                        <SelectTrigger className="mt-1 rounded-xl">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Qualification */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="rounded-2xl">
                <CardContent className="p-6 space-y-5">
                  <h2 className="text-lg font-semibold text-foreground">
                    Qualification & registration
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor="qualification">Qualification *</Label>
                      <Input
                        id="qualification"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        placeholder="MBBS, MD"
                        className="mt-1 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="university">University</Label>
                      <Input
                        id="university"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        placeholder="AIIMS Delhi"
                        className="mt-1 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="qualYear">Graduation year</Label>
                      <Input
                        id="qualYear"
                        type="number"
                        value={qualificationYear}
                        onChange={(e) => setQualificationYear(e.target.value)}
                        placeholder="2015"
                        className="mt-1 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subSpeciality">Sub-speciality</Label>
                      <Input
                        id="subSpeciality"
                        value={subSpeciality}
                        onChange={(e) => setSubSpeciality(e.target.value)}
                        placeholder="e.g. Interventional Cardiology"
                        className="mt-1 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="regNumber">Registration number *</Label>
                      <Input
                        id="regNumber"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        placeholder="MCI-12345"
                        className="mt-1 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="regCouncil">Registration council *</Label>
                      <Select
                        value={registrationCouncil}
                        onValueChange={setRegistrationCouncil}
                      >
                        <SelectTrigger className="mt-1 rounded-xl">
                          <SelectValue placeholder="Select council" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNCILS.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="regYear">Registration year</Label>
                      <Input
                        id="regYear"
                        type="number"
                        value={registrationYear}
                        onChange={(e) => setRegistrationYear(e.target.value)}
                        placeholder="2016"
                        className="mt-1 rounded-xl"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Practice */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="rounded-2xl">
                <CardContent className="p-6 space-y-5">
                  <h2 className="text-lg font-semibold text-foreground">
                    Practice details
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="experience">Experience (years)</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        placeholder="10"
                        className="mt-1 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hospital">Current hospital / clinic</Label>
                      <Input
                        id="hospital"
                        value={currentHospital}
                        onChange={(e) => setCurrentHospital(e.target.value)}
                        placeholder="Apollo Hospitals"
                        className="mt-1 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fee">
                        Consultation fee (₹)
                      </Label>
                      <Input
                        id="fee"
                        type="number"
                        value={feePaise}
                        onChange={(e) => setFeePaise(e.target.value)}
                        placeholder="499"
                        className="mt-1 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <Label>Languages spoken</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleLanguage(lang)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                            languages.includes(lang)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visit modes */}
                  <div>
                    <Label>Consultation modes *</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {VISIT_MODES.map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => toggleVisitMode(mode.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            visitModes.includes(mode.id)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <Label htmlFor="bio">Short bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell patients about your practice, areas of expertise…"
                      className="mt-1 rounded-xl min-h-[80px]"
                    />
                  </div>

                  {/* Consent */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={consentTelemedicine}
                      onCheckedChange={(v) =>
                        setConsentTelemedicine(v === true)
                      }
                      className="mt-0.5"
                    />
                    <span className="text-sm text-muted-foreground">
                      I consent to provide telemedicine services through CalDoc
                      and confirm that all information provided is accurate. *
                    </span>
                  </label>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="rounded-2xl">
                <CardContent className="p-6 space-y-5">
                  <h2 className="text-lg font-semibold text-foreground">
                    Review your application
                  </h2>

                  <div className="space-y-4">
                    <ReviewSection title="Personal">
                      <ReviewRow label="Name" value={fullName} />
                      <ReviewRow label="Email" value={email} />
                      <ReviewRow label="Phone" value={phone} />
                      <ReviewRow label="City / State" value={`${city}, ${state}`} />
                      {gender && <ReviewRow label="Gender" value={gender} />}
                    </ReviewSection>

                    <ReviewSection title="Qualification">
                      <ReviewRow label="Qualification" value={qualification} />
                      <ReviewRow label="Speciality" value={speciality} />
                      {subSpeciality && <ReviewRow label="Sub-speciality" value={subSpeciality} />}
                      <ReviewRow label="Registration" value={`${registrationNumber} (${registrationCouncil})`} />
                      {university && <ReviewRow label="University" value={university} />}
                    </ReviewSection>

                    <ReviewSection title="Practice">
                      {experienceYears && <ReviewRow label="Experience" value={`${experienceYears} years`} />}
                      {currentHospital && <ReviewRow label="Hospital" value={currentHospital} />}
                      {feePaise && <ReviewRow label="Fee" value={`₹${feePaise}`} />}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {visitModes.map((m) => (
                          <Badge key={m} variant="secondary" className="text-[10px] rounded-full">
                            {m}
                          </Badge>
                        ))}
                        {languages.map((l) => (
                          <Badge key={l} variant="outline" className="text-[10px] rounded-full">
                            {l}
                          </Badge>
                        ))}
                      </div>
                    </ReviewSection>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              className="rounded-xl gap-1.5"
              onClick={() => (step === 1 ? navigate(-1) : setStep(step - 1))}
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 1 ? "Cancel" : "Back"}
            </Button>

            {step < 4 ? (
              <Button
                className="rounded-xl gap-1.5 px-6"
                disabled={!canProceed()}
                onClick={() => setStep(step + 1)}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                className="rounded-xl gap-1.5 px-6"
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit application
              </Button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

const ReviewSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-border p-4">
    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
      {title}
    </p>
    <div className="space-y-1">{children}</div>
  </div>
);

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground text-right max-w-[60%] truncate">
      {value}
    </span>
  </div>
);

export default ProviderEnrollment;
