import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { LayoutDashboard, Grid3X3, HeartHandshake, Phone, Settings, Users } from "lucide-react";
import { UserRolesTab } from "@/components/admin/UserRolesTab";
import { useAppAuth } from "@/contexts/AppAuthContext";

const portalTabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "sections", label: "Sections", icon: Grid3X3 },
  { id: "users", label: "Users", icon: Users },
  { id: "ngo", label: "NGO Bookings", icon: HeartHandshake },
  { id: "queue", label: "Telephonic Queue", icon: Phone },
  { id: "settings", label: "Settings", icon: Settings },
];

const portalCards = [
  { label: "Teleconsultations", desc: "Manage & reassign appointments", href: "/admin-portal", bar: "bg-primary" },
  { label: "Rx Delivery", desc: "Track and fulfil prescription orders", href: "/pharmacy-portal", bar: "bg-emerald-600" },
  { label: "Labs", desc: "Lab orders and status updates", href: "/labs-portal", bar: "bg-violet-600" },
  { label: "NGO Bookings", desc: "Confirm or release NGO reservations", href: "/ngo-portal", bar: "bg-amber-600" },
  { label: "Providers", desc: "Onboard, off-board, manage doctors", href: "/providers", bar: "bg-foreground/70" },
  { label: "Enrollments", desc: "Review & approve provider applications", href: "/admin-portal", bar: "bg-orange-500" },
  { label: "Pharmacy Team", desc: "Add or remove pharmacy users", href: "/pharmacy-portal", bar: "bg-teal-600" },
  { label: "Lab Team", desc: "Add or remove lab users", href: "/labs-portal", bar: "bg-rose-600" },
  { label: "Schedule Slots", desc: "Generate availability for providers", href: "/schedule", bar: "bg-indigo-600" },
  { label: "WhatsApp", desc: "Diagnostics, message log & test sends", href: "/admin-portal", bar: "bg-green-600" },
  { label: "Check-in Form", desc: "Preview the patient pre-visit form", href: "/admin-portal", bar: "bg-cyan-600" },
  { label: "Patients", desc: "Search and review registered patients", href: "/patient-portal", bar: "bg-pink-600" },
  { label: "Audit log", desc: "System-wide action trail", href: "/admin-portal", bar: "bg-muted-foreground" },
];

const kpis = [
  { label: "Revenue captured", value: "₹4,85,000", sub: "across all portals" },
  { label: "Appointments", value: "342", sub: "218 confirmed · 67 pending" },
  { label: "Cancelled", value: "57", sub: "appointments" },
  { label: "Active providers", value: "24", sub: "on marketplace" },
  { label: "Rx orders", value: "89", sub: "52 paid · 18 awaiting" },
  { label: "Lab orders", value: "156", sub: "98 confirmed · 31 pending" },
];

const ngoReservations = [
  { id: "NGO-001", friendlyId: "NGO-001", ngoName: "Health For All Foundation", providerName: "Dr. Rajesh Kumar", speciality: "General Medicine", slotTime: new Date("2026-04-12T10:00:00"), status: "HELD" },
  { id: "NGO-002", friendlyId: "NGO-002", ngoName: "Rural Care Trust", providerName: "Dr. Sunitha Reddy", speciality: "Dermatology", slotTime: new Date("2026-04-13T14:00:00"), status: "CONFIRMED" },
  { id: "NGO-003", friendlyId: "NGO-003", ngoName: "Health For All Foundation", providerName: "Dr. Venkat Rao", speciality: "Cardiology", slotTime: new Date("2026-04-14T11:30:00"), status: "HELD" },
];

const offlineRequests = [
  { id: "req-1", createdAt: new Date("2026-04-09T08:45:00"), name: "Lakshmi Amma", phone: "+91 94401 23456", speciality: "General Medicine", status: "NEW" },
  { id: "req-2", createdAt: new Date("2026-04-08T17:20:00"), name: "Ramesh Kumar", phone: "+91 93305 67890", speciality: "Orthopedics", status: "IN_PROGRESS" },
];

function formatIST(date: Date) {
  return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

const AdminPortal = () => {
  const { signOut } = useAppAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Layout>
      <section className="pt-24 pb-10">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Admin portal</p>
                <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Dashboard</h1>
                <p className="mt-1 text-sm text-muted-foreground">Unified operations view — teleconsultations, pharmacy, labs, NGO, and providers.</p>
              </div>
              <Button variant="outline" className="rounded-full" onClick={() => signOut().then(() => navigate("/login?portal=admin"))}>Sign out</Button>
            </div>

            {/* Tab navigation */}
            <Card className="rounded-2xl">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
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

            {/* KPI cards (always visible) */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
              {kpis.map((k) => (
                <Card key={k.label} className="rounded-2xl">
                  <CardContent className="p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{k.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">{k.value}</p>
                    <p className="text-[11px] text-muted-foreground">{k.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Dashboard tab */}
            {activeTab === "dashboard" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground">Quick overview</h2>
                  <p className="text-sm text-muted-foreground mb-4">Recent activity across all portals.</p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {portalCards.slice(0, 6).map((card) => (
                      <Link key={card.label} to={card.href} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                        <div className={`mb-3 h-1.5 w-8 rounded-full ${card.bar}`} />
                        <p className="font-semibold text-foreground">{card.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{card.desc}</p>
                        <span className="absolute right-4 top-4 text-muted-foreground/30 transition-colors group-hover:text-primary">→</span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sections tab */}
            {activeTab === "sections" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground">Portal sections</h2>
                  <p className="text-sm text-muted-foreground mb-4">Jump to any operational area.</p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {portalCards.map((card) => (
                      <Link key={card.label} to={card.href} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                        <div className={`mb-3 h-1.5 w-8 rounded-full ${card.bar}`} />
                        <p className="font-semibold text-foreground">{card.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{card.desc}</p>
                        <span className="absolute right-4 top-4 text-muted-foreground/30 transition-colors group-hover:text-primary">→</span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Users tab */}
            {activeTab === "users" && <UserRolesTab />}

            {/* NGO Bookings tab */}
            {activeTab === "ngo" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Recent NGO bookings</h2>
                      <p className="text-xs text-muted-foreground">Latest 10 · <Link to="/ngo-portal" className="text-primary hover:underline">View all</Link></p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {["ID", "NGO", "Doctor", "Slot", "Status", "Actions"].map((h) => <th key={h} className="pb-2 pr-4 font-semibold">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {ngoReservations.map((r) => (
                          <tr key={r.id} className="border-b border-border/50 last:border-0">
                            <td className="py-2.5 pr-4 font-mono text-xs font-semibold text-muted-foreground">{r.friendlyId}</td>
                            <td className="py-2.5 pr-4 font-medium text-foreground">{r.ngoName}</td>
                            <td className="py-2.5 pr-4"><div className="font-medium text-foreground">{r.providerName}</div><div className="text-xs text-muted-foreground">{r.speciality}</div></td>
                            <td className="py-2.5 pr-4 text-xs text-muted-foreground">{formatIST(r.slotTime)}</td>
                            <td className="py-2.5 pr-4"><Badge variant={r.status === "CONFIRMED" ? "default" : "secondary"} className="rounded-full text-xs uppercase">{r.status}</Badge></td>
                            <td className="py-2.5"><Button size="sm" variant="outline" className="rounded-full text-xs">Manage</Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Telephonic Queue tab */}
            {activeTab === "queue" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Telephonic queue</h2>
                    <p className="text-xs text-muted-foreground">Unresolved offline requests from low-bandwidth patients.</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {["Created", "Patient", "Speciality", "Status", "Actions"].map((h) => <th key={h} className="pb-2 pr-4 font-semibold">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {offlineRequests.map((req) => (
                          <tr key={req.id} className="border-b border-border/50 last:border-0">
                            <td className="py-2.5 pr-4 text-xs text-muted-foreground">{formatIST(req.createdAt)}</td>
                            <td className="py-2.5 pr-4"><div className="font-semibold text-foreground">{req.name}</div><div className="text-xs text-muted-foreground">{req.phone}</div></td>
                            <td className="py-2.5 pr-4 text-xs text-muted-foreground">{req.speciality}</td>
                            <td className="py-2.5 pr-4"><Badge variant="secondary" className="rounded-full text-xs uppercase">{req.status.replace("_", " ")}</Badge></td>
                            <td className="py-2.5"><Button size="sm" variant="outline" className="rounded-full text-xs">Resolve</Button></td>
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
                  <h2 className="text-lg font-semibold text-foreground">Admin settings</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Platform name", value: "CalDoc" },
                      { label: "Default currency", value: "INR (₹)" },
                      { label: "Timezone", value: "Asia/Kolkata (IST)" },
                      { label: "Auto-confirm bookings", value: "Disabled" },
                    ].map((field) => (
                      <div key={field.label} className="rounded-xl border border-border p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{field.label}</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{field.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminPortal;
