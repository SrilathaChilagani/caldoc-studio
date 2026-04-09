import { useState } from "react";
import { motion } from "framer-motion";
import { User, Calendar, FileText, CreditCard, Video, ArrowRight, LayoutDashboard, FolderOpen, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useAppAuth } from "@/contexts/AppAuthContext";
import { useMyAppointments } from "@/hooks/useAppointments";

type FilterKey = "ALL" | "CONFIRMED" | "PENDING" | "CANCELED" | "NO_SHOW" | "UPCOMING";

const filters: { value: FilterKey; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "UPCOMING", label: "Upcoming" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PENDING", label: "Pending" },
  { value: "CANCELED", label: "Cancelled" },
  { value: "NO_SHOW", label: "No show" },
];

const tabs = [
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "documents", label: "Documents", icon: FolderOpen },
  { id: "profile", label: "Profile", icon: Settings },
];


const statusClasses: Record<string, string> = {
  CONFIRMED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  CANCELED: "bg-destructive/10 text-destructive",
  NO_SHOW: "bg-muted text-muted-foreground",
};

function formatIST(date: Date) {
  return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

const mockDocuments = [
  { id: "doc-1", name: "Blood Test Report", type: "Lab Report", date: "08 Apr 2026", provider: "Dr. Venkat Rao" },
  { id: "doc-2", name: "Prescription - General Checkup", type: "Prescription", date: "08 Apr 2026", provider: "Dr. Rajesh Kumar" },
  { id: "doc-3", name: "ECG Report", type: "Diagnostic", date: "05 Apr 2026", provider: "Dr. Venkat Rao" },
];

const PatientPortal = () => {
  const { user, signOut, profile } = useAppAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appointments");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL");
  const { data: rawAppointments = [], isLoading } = useMyAppointments();

  const appointments = rawAppointments.map((a: any) => ({
    id: a.id,
    providerName: a.doctors?.name || "Unknown Doctor",
    speciality: a.doctors?.specialty || "",
    patientName: a.patient_name,
    status: a.status,
    slotTime: new Date(a.slot_time),
    videoRoom: a.video_room_url,
    hasPrescription: false,
    hasReceipt: false,
  }));

  const filtered = appointments.filter((appt: any) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "UPCOMING") return appt.status === "CONFIRMED" || appt.status === "PENDING";
    return appt.status === activeFilter;
  });

  const summary = [
    { label: "All appointments", value: appointments.length },
    { label: "Confirmed", value: appointments.filter((a: any) => a.status === "CONFIRMED").length },
    { label: "Pending", value: appointments.filter((a: any) => a.status === "PENDING").length },
  ];

  return (
    <Layout>
      <section className="pt-24 pb-10">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
                  {(profile?.display_name || user.email || "P").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Patient portal</p>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">{profile?.display_name || user.email}</h1>
                  <p className="text-sm font-mono text-muted-foreground">{profile?.phone || user.email}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => navigate("/providers")} className="rounded-full">Book appointment</Button>
                <Button variant="outline" className="rounded-full" onClick={() => signOut().then(() => navigate("/login?portal=patient"))}>Sign out</Button>
              </div>
            </div>

            {/* Tab navigation */}
            <Card className="rounded-2xl">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary cards */}
            <div className="grid gap-3 sm:grid-cols-3">
              {summary.map((item) => (
                <Card key={item.label} className="rounded-2xl">
                  <CardContent className="p-4 text-center">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "appointments" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {filters.map((f) => (
                      <button key={f.value} onClick={() => setActiveFilter(f.value)}
                        className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${activeFilter === f.value ? "bg-primary text-primary-foreground shadow-sm" : "bg-card text-foreground ring-1 ring-border hover:bg-muted"}`}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {filtered.length === 0 && <div className="py-10 text-center text-sm text-muted-foreground">No appointments found for this filter.</div>}
                    {filtered.map((appt) => (
                      <div key={appt.id} className="border-b border-border py-5 last:border-0">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-base font-semibold text-foreground">{appt.providerName}</p>
                            <p className="text-xs text-muted-foreground">{appt.speciality} · {formatIST(appt.slotTime)}</p>
                          </div>
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[appt.status] || "bg-muted text-muted-foreground"}`}>
                            {appt.status === "CANCELED" ? "CANCELLED" : appt.status.replace("_", " ")}
                          </span>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {appt.videoRoom && (appt.status === "CONFIRMED" || appt.status === "PENDING") && (
                            <Button size="sm" className="rounded-full gap-2"><Video className="w-3.5 h-3.5" /> Join visit</Button>
                          )}
                          <Button size="sm" variant="outline" className="rounded-full gap-2 text-primary border-primary/30"><Calendar className="w-3.5 h-3.5" /> Book follow-up</Button>
                          {appt.hasPrescription && <Button size="sm" variant="outline" className="rounded-full gap-2"><FileText className="w-3.5 h-3.5" /> Prescription</Button>}
                          {appt.hasReceipt && <Button size="sm" variant="outline" className="rounded-full gap-2"><CreditCard className="w-3.5 h-3.5" /> Receipt</Button>}
                          <Button size="sm" variant="outline" className="rounded-full gap-2">View details <ArrowRight className="w-3.5 h-3.5" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-6 text-xs text-muted-foreground">Showing up to 100 of your most recent appointments.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === "documents" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-foreground">Your documents</h2>
                    <Button variant="outline" className="rounded-full text-xs">Upload document</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <th className="pb-2 pr-4">Name</th><th className="pb-2 pr-4">Type</th><th className="pb-2 pr-4">Date</th><th className="pb-2 pr-4">Provider</th><th className="pb-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockDocuments.map((doc) => (
                          <tr key={doc.id} className="border-b border-border/50 last:border-0">
                            <td className="py-3 pr-4 font-medium text-foreground">{doc.name}</td>
                            <td className="py-3 pr-4 text-xs text-muted-foreground">{doc.type}</td>
                            <td className="py-3 pr-4 text-xs text-muted-foreground">{doc.date}</td>
                            <td className="py-3 pr-4 text-xs text-muted-foreground">{doc.provider}</td>
                            <td className="py-3"><Button size="sm" variant="outline" className="rounded-full text-xs">Download</Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "profile" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-lg font-semibold text-foreground">Profile settings</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Full name", value: profile?.display_name || user.email || "" },
                      { label: "Phone", value: profile?.phone || "Not set" },
                      { label: "Email", value: user.email || "" },
                      { label: "Date of birth", value: "15 Mar 1990" },
                      { label: "Gender", value: "Female" },
                      { label: "Blood group", value: "B+" },
                    ].map((field) => (
                      <div key={field.label} className="rounded-xl border border-border p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{field.label}</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{field.value}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="rounded-full">Edit profile</Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PatientPortal;
