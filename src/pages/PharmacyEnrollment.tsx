import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Loader2 } from "lucide-react";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Delhi", "Jammu & Kashmir",
  "Ladakh", "Puducherry",
];

function SectionHeader({ title }: { title: string }) {
  return <h2 className="mb-4 text-sm font-semibold text-foreground">{title}</h2>;
}

const PharmacyEnrollment = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pharmacyName, setPharmacyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [drugLicenseNumber, setDrugLicenseNumber] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [serviceAreas, setServiceAreas] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { error: dbError } = await supabase.from("pharmacy_enrollments").insert({
        pharmacy_name: pharmacyName,
        contact_name: contactName,
        email,
        phone,
        drug_license_number: drugLicenseNumber,
        gst_number: gstNumber || null,
        address_line1: addressLine1,
        address_line2: addressLine2 || null,
        city,
        state,
        pincode,
        service_areas: serviceAreas ? serviceAreas.split(",").map((s) => s.trim()).filter(Boolean) : [],
        notes: notes || null,
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
              Thank you for applying as a CalDoc pharmacy partner. We will review your application and get back to you within 2–3 business days.
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
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Partner Enrollment</p>
            <h1 className="mt-1 font-serif text-3xl text-foreground">Join CalDoc as a Pharmacy</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete this form to apply as a pharmacy partner. Our team will review within 2–3 business days.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Pharmacy Details */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <SectionHeader title="Pharmacy Details" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label>Pharmacy name *</Label>
                    <Input value={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} required placeholder="e.g. MedPlus Pharmacy" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label>Contact person name *</Label>
                    <Input value={contactName} onChange={(e) => setContactName(e.target.value)} required placeholder="e.g. Ravi Kumar" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label>Email address *</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="pharmacy@email.com" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label>Phone / WhatsApp *</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+91 98765 43210" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label>Drug License Number *</Label>
                    <Input value={drugLicenseNumber} onChange={(e) => setDrugLicenseNumber(e.target.value)} required placeholder="e.g. AP/DL/2023/12345" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label>GST Number (optional)</Label>
                    <Input value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} placeholder="e.g. 37AABCT1234Z1Z5" className="mt-1 rounded-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <SectionHeader title="Address" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label>Address line 1 *</Label>
                    <Input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} required placeholder="Street / Building" className="mt-1 rounded-xl" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Address line 2 (optional)</Label>
                    <Input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Area / Landmark" className="mt-1 rounded-xl" />
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
                  <div>
                    <Label>Pincode *</Label>
                    <Input value={pincode} onChange={(e) => setPincode(e.target.value)} required placeholder="e.g. 500001" maxLength={6} className="mt-1 rounded-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Areas */}
            <Card className="rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <SectionHeader title="Service Areas & Notes" />
                <div>
                  <Label>Service areas (comma-separated)</Label>
                  <Textarea value={serviceAreas} onChange={(e) => setServiceAreas(e.target.value)} rows={2} placeholder="e.g. Hyderabad, Secunderabad, Kukatpally" className="mt-1 rounded-xl" />
                  <p className="mt-0.5 text-[10px] text-muted-foreground">Enter the areas or pin codes you can deliver to.</p>
                </div>
                <div>
                  <Label>Additional notes (optional)</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Any other information you'd like to share…" className="mt-1 rounded-xl" />
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
            )}

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

export default PharmacyEnrollment;
