import { useState } from "react";
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
import { CheckCircle2, Loader2 } from "lucide-react";

const QUALIFICATIONS = [
  "MBBS", "MD", "MS", "DNB", "DM", "MCh", "BHMS", "BAMS", "BDS", "MDS",
  "DNBE", "FRCS", "MRCP", "Fellowship", "Other",
];

const SPECIALITIES = [
  "General Medicine", "General Surgery", "Pediatrics", "Gynecology & Obstetrics",
  "Cardiology", "Dermatology", "Orthopedics", "Neurology", "Psychiatry",
  "ENT (Ear Nose Throat)", "Ophthalmology", "Urology", "Nephrology",
  "Gastroenterology", "Endocrinology", "Pulmonology / Chest Medicine",
  "Oncology", "Radiology", "Anesthesiology", "Emergency Medicine",
  "Family Medicine", "Geriatrics", "Diabetology", "Rheumatology",
  "Hematology", "Infectious Disease", "Physical Medicine & Rehab",
  "Ayurveda", "Homeopathy", "Dental", "Other",
];

const COUNCILS = [
  "Medical Council of India (MCI) / NMC", "Delhi Medical Council",
  "Maharashtra Medical Council", "Karnataka Medical Council",
  "Tamil Nadu Medical Council", "Telangana State Medical Council",
  "Andhra Pradesh Medical Council", "Kerala State Medical Council",
  "West Bengal Medical Council", "Gujarat Medical Council",
  "Rajasthan Medical Council", "Uttar Pradesh Medical Council",
  "Punjab Medical Council", "Haryana Medical Council",
  "Other State Medical Council", "Dental Council of India",
  "Central Council of Homoeopathy", "Central Council of Indian Medicine",
];

const LANGUAGES = [
  "English", "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu",
  "Gujarati", "Kannada", "Malayalam", "Odia", "Punjabi", "Assamese",
];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Delhi", "Jammu & Kashmir",
  "Ladakh", "Puducherry",
];

function SectionHeader({ num, title, sub }: { num: number; title: string; sub?: string }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {num}
      </span>
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

function ChipSelect({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (val: string) =>
    onChange(selected.includes(val) ? selected.filter((x) => x !== val) : [...selected, val]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            selected.includes(opt)
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background border-border text-muted-foreground hover:border-primary/50"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

const ProviderEnrollment = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [qualification, setQualification] = useState("");
  const [university, setUniversity] = useState("");
  const [qualificationYear, setQualificationYear] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [registrationCouncil, setRegistrationCouncil] = useState("");
  const [registrationYear, setRegistrationYear] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [subSpeciality, setSubSpeciality] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [currentHospital, setCurrentHospital] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [feePaise, setFeePaise] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [visitModes, setVisitModes] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!consent) { setError("You must agree to the telemedicine guidelines."); return; }
    if (languages.length === 0) { setError("Please select at least one language."); return; }
    if (visitModes.length === 0) { setError("Please select at least one consultation mode."); return; }

    setSubmitting(true);
    try {
      const { error: dbError } = await supabase.from("provider_enrollments").insert({
        full_name: fullName,
        email,
        phone,
        gender: gender || null,
        dob: dob || null,
        qualification,
        university: university || null,
        qualification_year: qualificationYear ? parseInt(qualificationYear) : null,
        registration_number: registrationNumber,
        registration_council: registrationCouncil,
        registration_year: registrationYear ? parseInt(registrationYear) : null,
        speciality,
        sub_speciality: subSpeciality || null,
        experience_years: experienceYears ? parseInt(experienceYears) : null,
        current_hospital: currentHospital || null,
        city,
        state,
        fee_paise: feePaise ? parseInt(feePaise) * 100 : null,
        languages,
        visit_modes: visitModes,
        bio: bio || null,
        consent_telemedicine: consent,
      });
      if (dbError) throw dbError;
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (err: any) {
      setError(err.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <section className="pt-24 pb-16">
          <div className="container mx-auto max-w-xl px-4 text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-serif text-3xl text-foreground">Application Submitted!</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Thank you for enrolling with CalDoc. We will review your application and get back
              to you within 2–3 business days. You will receive a WhatsApp message and email once approved.
            </p>
            <Button className="rounded-xl px-8" onClick={() => navigate("/")}>Back to home</Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-24 pb-16">
        <div className="container mx-auto max-w-2xl px-4 space-y-6">
          {/* Header */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Provider Enrollment</p>
            <h1 className="mt-1 font-serif text-3xl text-foreground">Join CalDoc as a Doctor</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete this form to apply for a provider account. Our team will review within 2–3 business days.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <Badge variant="secondary" className="rounded-full gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> MoHFW Guidelines 2020 compliant
              </Badge>
              <Badge variant="secondary" className="rounded-full gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Takes about 5 minutes
              </Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Section 1: Personal */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <SectionHeader num={1} title="Personal Information" sub="As per your medical registration." />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label>Full name (as per registration) *</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Dr. Priya Sharma" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label>Date of birth</Label>
                    <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Email address *</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="doctor@email.com" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label>Mobile / WhatsApp *</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+91 98765 43210" className="mt-1 rounded-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Medical Qualification */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <SectionHeader num={2} title="Medical Qualification" sub="Your highest or primary medical degree." />
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label>Qualification *</Label>
                    <Select value={qualification} onValueChange={setQualification}>
                      <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{QUALIFICATIONS.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>University / Institute</Label>
                    <Input value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="e.g. AIIMS New Delhi" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label>Year of passing</Label>
                    <Input type="number" value={qualificationYear} onChange={(e) => setQualificationYear(e.target.value)} placeholder="e.g. 2010" className="mt-1 rounded-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Medical Registration */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <SectionHeader num={3} title="Medical Registration" sub="Required under MoHFW Telemedicine Practice Guidelines 2020." />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Registration number *</Label>
                    <Input value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} required placeholder="e.g. DMC/2010/12345" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label>Year of registration</Label>
                    <Input type="number" value={registrationYear} onChange={(e) => setRegistrationYear(e.target.value)} placeholder="e.g. 2010" className="mt-1 rounded-xl" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Registering council *</Label>
                    <Select value={registrationCouncil} onValueChange={setRegistrationCouncil}>
                      <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Select council" /></SelectTrigger>
                      <SelectContent>{COUNCILS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Practice Details */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <SectionHeader num={4} title="Practice Details" sub="Tell us about your speciality and experience." />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Primary speciality *</Label>
                    <Select value={speciality} onValueChange={setSpeciality}>
                      <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Select speciality" /></SelectTrigger>
                      <SelectContent>{SPECIALITIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Sub-speciality (optional)</Label>
                    <Input value={subSpeciality} onChange={(e) => setSubSpeciality(e.target.value)} placeholder="e.g. Interventional Cardiology" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label>Years of experience</Label>
                    <Input type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} placeholder="e.g. 8" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label>Current hospital / clinic</Label>
                    <Input value={currentHospital} onChange={(e) => setCurrentHospital(e.target.value)} placeholder="e.g. Apollo Hospitals" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label>City *</Label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} required placeholder="e.g. Hyderabad" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label>State *</Label>
                    <Select value={state} onValueChange={setState}>
                      <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Select state" /></SelectTrigger>
                      <SelectContent>{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 5: Telemedicine Preferences */}
            <Card className="rounded-2xl">
              <CardContent className="p-6 space-y-5">
                <SectionHeader num={5} title="Telemedicine Preferences" sub="How you prefer to consult with patients." />
                <div>
                  <Label className="mb-2 block">Consultation modes *</Label>
                  <ChipSelect options={["Video", "Audio"]} selected={visitModes} onChange={setVisitModes} />
                </div>
                <div>
                  <Label className="mb-2 block">Languages you consult in *</Label>
                  <ChipSelect options={LANGUAGES} selected={languages} onChange={setLanguages} />
                </div>
                <div>
                  <Label>Consultation fee (₹)</Label>
                  <Input type="number" value={feePaise} onChange={(e) => setFeePaise(e.target.value)} placeholder="e.g. 500" className="mt-1 rounded-xl max-w-[200px]" />
                </div>
              </CardContent>
            </Card>

            {/* Section 6: Bio */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <SectionHeader num={6} title="Professional Bio" sub="This will appear on your public CalDoc profile." />
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder="e.g. I am a board-certified cardiologist with 12 years of experience…" className="rounded-xl" />
                <p className="mt-1 text-[11px] text-muted-foreground">Keep it to 2–4 sentences. Patients read this before booking.</p>
              </CardContent>
            </Card>

            {/* Section 7: Declaration */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <SectionHeader num={7} title="Declaration & Consent" sub="Required under the MoHFW Telemedicine Practice Guidelines, 2020." />
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    I confirm that I am a Registered Medical Practitioner (RMP) and agree to practice
                    telemedicine in accordance with the{" "}
                    <span className="font-medium text-primary">MoHFW Telemedicine Practice Guidelines, 2020</span>.
                    I confirm that all information submitted is accurate and authentic.
                  </span>
                </label>
              </CardContent>
            </Card>

            {error && (
              <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
            )}

            {/* Submit */}
            <Card className="rounded-2xl">
              <CardContent className="p-6 flex items-center justify-between">
                <p className="max-w-xs text-xs text-muted-foreground">
                  Your information is stored securely. We review every application manually.
                </p>
                <Button type="submit" disabled={submitting} className="rounded-full px-6 gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Submitting…" : "Apply to Join"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default ProviderEnrollment;
