import { useState } from "react";
import { motion } from "framer-motion";
import { User, Calendar, FileText, CreditCard, Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";

type FilterKey = "ALL" | "CONFIRMED" | "PENDING" | "CANCELED" | "NO_SHOW" | "UPCOMING";

const filters: { value: FilterKey; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "UPCOMING", label: "Upcoming" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PENDING", label: "Pending" },
  { value: "CANCELED", label: "Cancelled" },
  { value: "NO_SHOW", label: "No show" },
];

const mockPatient = { name: "Priya Sharma", phone: "+91 98765 43210" };

const mockAppointments = [
  { id: "appt-001", providerName: "Dr. Rajesh Kumar", speciality: "General Physician", patientName: "Priya Sharma", status: "CONFIRMED" as const, slotTime: new Date("2026-04-12T10:00:00"), videoRoom: "https://meet.caldoc.in/room-001", hasPrescription: true, hasReceipt: true },
  { id: "appt-002", providerName: "Dr. Sunitha Reddy", speciality: "Dermatology", patientName: "Priya Sharma", status: "PENDING" as const, slotTime: new Date("2026-04-15T14:30:00"), videoRoom: null, hasPrescription: false, hasReceipt: false },
  { id: "appt-003", providerName: "Dr. Venkat Rao", speciality: "Cardiology", patientName: "Priya Sharma", status: "CONFIRMED" as const, slotTime: new Date("2026-04-08T11:00:00"), videoRoom: "https://meet.caldoc.in/room-003", hasPrescription: true, hasReceipt: true },
  { id: "appt-004", providerName: "Dr. Lakshmi Devi", speciality: "Pediatrics", patientName: "Priya Sharma", status: "CANCELED" as const, slotTime: new Date("2026-03-28T09:00:00"), videoRoom: null, hasPrescription: false, hasReceipt: true },
  { id: "appt-005", providerName: "Dr. Arun Prasad", speciality: "Orthopedics", patientName: "Priya Sharma", status: "NO_SHOW" as const, slotTime: new Date("2026-03-20T16:00:00"), videoRoom: null, hasPrescription: false, hasReceipt: false },
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

const PatientPortal = () => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL");
  const navigate = useNavigate();

  const filtered = mockAppointments.filter((appt) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "UPCOMING") return appt.status === "CONFIRMED" || appt.status === "PENDING";
    return appt.status === activeFilter;
  });

  const summary = [
    { label: "All appointments", value: mockAppointments.length },
    { label: "Confirmed", value: mockAppointments.filter((a) => a.status === "CONFIRMED").length },
    { label: "Pending", value: mockAppointments.filter((a) => a.status === "PENDING").length },
  ];

  return (
    <Layout>
      <section className="pt-24 pb-10 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="pb-6 border-b border-border md:pb-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
                    {mockPatient.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">Patient portal</p>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">{mockPatient.name}</h1>
                    <p className="text-sm font-mono text-muted-foreground">{mockPatient.phone}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button onClick={() => navigate("/providers")} className="rounded-full">Book appointment</Button>
                  <Button variant="outline" className="rounded-full"><User className="w-4 h-4 mr-2" /> Profile</Button>
                  <Button variant="outline" className="rounded-full">Sign out</Button>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Review upcoming visits, download receipts, and share documents with your doctor before the call.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {summary.map((item) => (
                  <Card key={item.label} className="rounded-2xl">
                    <CardContent className="p-4 text-center">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-2xl font-semibold text-foreground">{item.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {filters.map((f) => (
                <button key={f.value} onClick={() => setActiveFilter(f.value)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${activeFilter === f.value ? "bg-primary text-primary-foreground shadow-sm" : "bg-card text-foreground ring-1 ring-border hover:bg-muted"}`}>
                  {f.label}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {filtered.length === 0 && <div className="py-10 text-center text-sm text-muted-foreground">No appointments found for this filter.</div>}
              {filtered.map((appt) => (
                <div key={appt.id} className="border-b border-border py-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-base font-semibold text-foreground">{appt.providerName}</p>
                      <p className="text-xs text-muted-foreground">{appt.speciality} · {formatIST(appt.slotTime)}</p>
                      <p className="text-xs text-muted-foreground">Patient: {appt.patientName}</p>
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
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PatientPortal;
