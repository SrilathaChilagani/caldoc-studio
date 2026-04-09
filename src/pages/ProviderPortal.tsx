import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Video, ExternalLink, LayoutDashboard, Calendar, IndianRupee, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { useAppAuth } from "@/contexts/AppAuthContext";

type StatusFilter = "ALL" | "CONFIRMED" | "PENDING" | "CANCELLED" | "NO_SHOW" | "RESCHEDULED";
type TimeFilter = "ALLTIME" | "LAST24" | "FUTURE";

const portalTabs = [
  { id: "appointments", label: "Appointments", icon: LayoutDashboard },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "earnings", label: "Earnings", icon: IndianRupee },
  { id: "settings", label: "Settings", icon: Settings },
];

const timeframeTabs: { value: TimeFilter; label: string }[] = [
  { value: "ALLTIME", label: "All time" },
  { value: "LAST24", label: "Last 24h" },
  { value: "FUTURE", label: "Future" },
];

const mockAppointments = [
  { id: "a1", createdAt: new Date("2026-04-09T08:30:00"), speciality: "General Medicine", patientName: "Priya Sharma", patientPhone: "+91 98765 43210", status: "CONFIRMED", slotTime: new Date("2026-04-12T10:00:00"), videoRoom: "https://meet.caldoc.in/r1", waStatus: "DELIVERED" },
  { id: "a2", createdAt: new Date("2026-04-09T09:15:00"), speciality: "General Medicine", patientName: "Ramesh Babu", patientPhone: "+91 87654 32109", status: "PENDING", slotTime: new Date("2026-04-12T11:00:00"), videoRoom: null, waStatus: "SENT" },
  { id: "a3", createdAt: new Date("2026-04-08T14:00:00"), speciality: "General Medicine", patientName: "Sunitha Devi", patientPhone: "+91 76543 21098", status: "CONFIRMED", slotTime: new Date("2026-04-10T15:00:00"), videoRoom: "https://meet.caldoc.in/r3", waStatus: "READ" },
  { id: "a4", createdAt: new Date("2026-04-07T10:00:00"), speciality: "General Medicine", patientName: "Venkat Rao", patientPhone: "+91 65432 10987", status: "CANCELLED", slotTime: new Date("2026-04-09T09:00:00"), videoRoom: null, waStatus: "—" },
  { id: "a5", createdAt: new Date("2026-04-06T16:00:00"), speciality: "General Medicine", patientName: "Lakshmi K", patientPhone: "+91 54321 09876", status: "NO_SHOW", slotTime: new Date("2026-04-07T14:00:00"), videoRoom: null, waStatus: "FAILED" },
];

const statusClasses: Record<string, string> = {
  CONFIRMED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  CANCELLED: "bg-muted text-muted-foreground",
  NO_SHOW: "bg-muted text-muted-foreground",
  RESCHEDULED: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
};

const slotFormatter = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true });
const createdFormatter = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true });

const mockSchedule = [
  { day: "Mon, 12 Apr", slots: ["10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"] },
  { day: "Tue, 13 Apr", slots: ["09:00 AM", "10:00 AM", "11:00 AM"] },
  { day: "Wed, 14 Apr", slots: ["02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"] },
];

const mockEarnings = [
  { month: "April 2026", consultations: 18, amount: "₹27,000", status: "In progress" },
  { month: "March 2026", consultations: 42, amount: "₹63,000", status: "Paid" },
  { month: "February 2026", consultations: 38, amount: "₹57,000", status: "Paid" },
];

const ProviderPortal = () => {
  const { user, loading, signOut, profile } = useAppAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appointments");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("ALLTIME");

  useEffect(() => {
    if (!loading && !user) navigate("/login?portal=provider");
  }, [loading, user, navigate]);

  if (loading) return <Layout><div className="pt-24 text-center text-muted-foreground">Loading…</div></Layout>;
  if (!user) return null;

  const now = new Date();
  const filtered = mockAppointments.filter((appt) => {
    if (statusFilter !== "ALL" && appt.status !== statusFilter) return false;
    if (timeFilter === "LAST24" && appt.createdAt < new Date(now.getTime() - 86400000)) return false;
    if (timeFilter === "FUTURE" && appt.slotTime < now) return false;
    return true;
  });

  const countByStatus = (s: string) => mockAppointments.filter((a) => a.status === s).length;
  const summary = [
    { key: "ALL", label: "All appointments", value: mockAppointments.length },
    { key: "CONFIRMED", label: "Confirmed", value: countByStatus("CONFIRMED") },
    { key: "PENDING", label: "Pending", value: countByStatus("PENDING") },
    { key: "CANCELLED", label: "Cancelled", value: countByStatus("CANCELLED") },
    { key: "NO_SHOW", label: "No-show", value: countByStatus("NO_SHOW") },
  ];

  const upcomingAppt = mockAppointments
    .filter((a) => a.slotTime >= now && (a.status === "CONFIRMED" || a.status === "PENDING"))
    .sort((a, b) => a.slotTime.getTime() - b.slotTime.getTime())[0];

  return (
    <Layout>
      <section className="pt-24 pb-10">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-2xl font-semibold text-primary-foreground">{(profile?.display_name || user.email || "P").charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Provider portal</p>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">{profile?.display_name || user.email}</h1>
                  <p className="text-sm text-muted-foreground">Manage teleconsultations, confirm bookings, and share prescriptions.</p>
                </div>
              </div>
              <Button variant="outline" className="rounded-full" onClick={() => signOut().then(() => navigate("/login?portal=provider"))}>Sign out</Button>
            </div>

            {/* Tab navigation */}
            <Card className="rounded-2xl">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {portalTabs.map((tab) => (
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

            {/* Next consult banner */}
            {upcomingAppt && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Next consult</p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-foreground">
                  <span className="text-base font-semibold">{upcomingAppt.patientName} · {upcomingAppt.speciality}</span>
                  <span className="text-muted-foreground">{slotFormatter.format(upcomingAppt.slotTime)}</span>
                  <Button size="sm" variant="outline" className="rounded-full text-xs text-primary border-primary/30">Open details</Button>
                </div>
              </div>
            )}

            {/* Summary cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {summary.map((item) => (
                <button key={item.key} onClick={() => { setActiveTab("appointments"); setStatusFilter(item.key as StatusFilter); }}
                  className={`rounded-2xl border p-4 text-center shadow-sm transition ${statusFilter === item.key && activeTab === "appointments" ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border bg-card hover:border-primary/40"}`}>
                  <span className={`block text-xs uppercase tracking-wide ${statusFilter === item.key && activeTab === "appointments" ? "text-primary" : "text-muted-foreground"}`}>{item.label}</span>
                  <span className="mt-1 block text-2xl font-semibold text-foreground">{item.value}</span>
                </button>
              ))}
            </div>

            {/* Appointments tab */}
            {activeTab === "appointments" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-6">
                    {timeframeTabs.map((tab) => (
                      <button key={tab.value} onClick={() => setTimeFilter(tab.value)}
                        className={`rounded-full px-3 py-1 transition-colors ${timeFilter === tab.value ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <th className="px-4 py-3">Created</th><th className="px-4 py-3">Appointment</th><th className="px-4 py-3">Patient</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">WhatsApp</th><th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.length === 0 && (
                          <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No appointments match the selected filters.</td></tr>
                        )}
                        {filtered.map((appt) => (
                          <tr key={appt.id} className="border-t border-border">
                            <td className="px-4 py-3 text-xs text-muted-foreground">{createdFormatter.format(appt.createdAt)}</td>
                            <td className="px-4 py-3"><div className="font-medium text-foreground">{appt.speciality}</div><div className="font-mono text-xs text-muted-foreground">{appt.id}</div></td>
                            <td className="px-4 py-3"><div className="font-medium text-foreground">{appt.patientName}</div><div className="text-xs text-muted-foreground">{appt.patientPhone}</div></td>
                            <td className="px-4 py-3"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[appt.status] || "bg-muted text-muted-foreground"}`}>{appt.status}</span></td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">{appt.waStatus}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col gap-2">
                                {appt.status === "CONFIRMED" && appt.videoRoom ? (
                                  <Button size="sm" className="rounded-full gap-1.5 text-xs"><Video className="w-3 h-3" /> Join visit</Button>
                                ) : appt.status === "CONFIRMED" ? (
                                  <Button size="sm" variant="secondary" className="rounded-full text-xs">Visit room</Button>
                                ) : (
                                  <span className="text-xs text-muted-foreground">Awaiting confirmation</span>
                                )}
                                <Button size="sm" variant="outline" className="rounded-full text-xs gap-1.5">Open details <ExternalLink className="w-3 h-3" /></Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">Showing up to 100 recent appointments.</p>
                </CardContent>
              </Card>
            )}

            {/* Schedule tab */}
            {activeTab === "schedule" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-foreground">Upcoming availability</h2>
                    <Button variant="outline" className="rounded-full text-xs">Edit schedule</Button>
                  </div>
                  <div className="space-y-4">
                    {mockSchedule.map((day) => (
                      <div key={day.day} className="rounded-xl border border-border p-4">
                        <p className="text-sm font-semibold text-foreground">{day.day}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {day.slots.map((slot) => (
                            <span key={slot} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{slot}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Earnings tab */}
            {activeTab === "earnings" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Earnings summary</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <th className="pb-2 pr-4">Month</th><th className="pb-2 pr-4">Consultations</th><th className="pb-2 pr-4">Amount</th><th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockEarnings.map((e) => (
                          <tr key={e.month} className="border-b border-border/50 last:border-0">
                            <td className="py-3 pr-4 font-medium text-foreground">{e.month}</td>
                            <td className="py-3 pr-4 text-muted-foreground">{e.consultations}</td>
                            <td className="py-3 pr-4 font-semibold text-foreground">{e.amount}</td>
                            <td className="py-3"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${e.status === "Paid" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"}`}>{e.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Settings tab */}
            {activeTab === "settings" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-lg font-semibold text-foreground">Account settings</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Display name", value: "Dr. Rajesh Kumar" },
                      { label: "Speciality", value: "General Medicine" },
                      { label: "Phone", value: "+91 98765 00001" },
                      { label: "Consultation fee", value: "₹1,500" },
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

export default ProviderPortal;
