import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { LayoutDashboard, Users, FileText, Settings, Loader2 } from "lucide-react";
import { useAppAuth } from "@/contexts/AppAuthContext";
import { useLabOrders, useLabAgents } from "@/hooks/useLabs";

const portalTabs = [
  { id: "orders", label: "Lab Orders", icon: LayoutDashboard },
  { id: "agents", label: "Collection Agents", icon: Users },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

function formatINR(paise: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(paise / 100);
}

function formatIST(date: Date) {
  return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).replace(/\u202f/g, " ");
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-muted text-muted-foreground",
  AWAITING_PAYMENT: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  CONFIRMED: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  SAMPLE_COLLECTED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400",
  PROCESSING: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  REPORTS_READY: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400",
  COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  CANCELLED: "bg-destructive/10 text-destructive",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending", AWAITING_PAYMENT: "Awaiting payment", CONFIRMED: "Confirmed", SAMPLE_COLLECTED: "Sample collected", PROCESSING: "Processing", REPORTS_READY: "Reports ready", COMPLETED: "Completed", CANCELLED: "Cancelled",
};

const MODE_LABELS: Record<string, string> = { HOME: "🏠 Home visit", LAB: "🔬 Lab visit", COURIER: "📦 Courier" };

const kpis = [
  { label: "Total", value: 156, color: "text-foreground" },
  { label: "Pending", value: 31, color: "text-amber-700 dark:text-amber-400" },
  { label: "Confirmed", value: 45, color: "text-blue-700 dark:text-blue-400" },
  { label: "Sample collected", value: 22, color: "text-indigo-700 dark:text-indigo-400" },
  { label: "Processing", value: 18, color: "text-violet-700 dark:text-violet-400" },
  { label: "Reports ready", value: 12, color: "text-teal-700 dark:text-teal-400" },
];

const labOrders = [
  { id: "lab-001", createdAt: new Date("2026-04-09T09:00:00"), tests: [{ name: "Complete Blood Count", qty: 1 }, { name: "Thyroid Profile", qty: 1 }], patientName: "Priya Sharma", patientPhone: "+91 98765 43210", patientEmail: "priya@email.com", deliveryMode: "HOME", address: "12 MG Road, Jubilee Hills, Hyderabad, TS 500033", collectionAgentName: "Ravi Kumar", collectionAgentPhone: "+91 90001 23456", providerName: "Dr. Rajesh Kumar", providerSpeciality: "General Medicine", amountPaise: 180000, status: "CONFIRMED", notes: "Fasting sample required" },
  { id: "lab-002", createdAt: new Date("2026-04-08T14:30:00"), tests: [{ name: "Lipid Profile", qty: 1 }, { name: "HbA1c", qty: 1 }, { name: "Liver Function", qty: 1 }], patientName: "Ramesh Babu", patientPhone: "+91 87654 32109", patientEmail: null, deliveryMode: "LAB", address: null, collectionAgentName: null, collectionAgentPhone: null, providerName: "Dr. Venkat Rao", providerSpeciality: "Cardiology", amountPaise: 250000, status: "SAMPLE_COLLECTED", notes: null },
  { id: "lab-003", createdAt: new Date("2026-04-07T11:00:00"), tests: [{ name: "Vitamin D", qty: 1 }, { name: "Vitamin B12", qty: 1 }], patientName: "Sunitha Devi", patientPhone: "+91 76543 21098", patientEmail: "sunitha@email.com", deliveryMode: "HOME", address: "45 Road No 10, Banjara Hills, Hyderabad, TS 500034", collectionAgentName: "Suresh M", collectionAgentPhone: "+91 90002 34567", providerName: "Dr. Sunitha Reddy", providerSpeciality: "Dermatology", amountPaise: 120000, status: "PROCESSING", notes: null },
  { id: "lab-004", createdAt: new Date("2026-04-06T16:00:00"), tests: [{ name: "Urine Analysis", qty: 1 }], patientName: "Venkat Rao", patientPhone: "+91 65432 10987", patientEmail: null, deliveryMode: "COURIER", address: "78 Kukatpally, Hyderabad, TS 500072", collectionAgentName: null, collectionAgentPhone: null, providerName: "Dr. Lakshmi Devi", providerSpeciality: "Pediatrics", amountPaise: 45000, status: "AWAITING_PAYMENT", notes: "Sample kit to be couriered" },
];

const mockAgents = [
  { name: "Ravi Kumar", phone: "+91 90001 23456", area: "Jubilee Hills, Banjara Hills", activeOrders: 3, status: "Available" },
  { name: "Suresh M", phone: "+91 90002 34567", area: "Kukatpally, KPHB", activeOrders: 2, status: "On route" },
  { name: "Pradeep S", phone: "+91 90003 45678", area: "Secunderabad, Begumpet", activeOrders: 0, status: "Available" },
];

const LabsPortal = () => {
  const { signOut } = useAppAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const { data: dbLabOrders = [] } = useLabOrders();
  const { data: dbAgents = [] } = useLabAgents();

  return (
    <Layout>
      <section className="pt-24 pb-10">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Labs portal</p>
                <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Labs queue</h1>
                <p className="mt-1 text-sm text-muted-foreground">Track lab orders, assign collection agents, and manage results.</p>
              </div>
              <Button variant="outline" className="rounded-full" onClick={() => signOut().then(() => navigate("/login?portal=labs"))}>Log out</Button>
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

            {/* KPI cards */}
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {kpis.map((k) => (
                <Card key={k.label} className="rounded-2xl bg-muted/50">
                  <CardContent className="p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{k.label}</p>
                    <p className={`mt-1 text-2xl font-semibold ${k.color}`}>{k.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Orders tab */}
            {activeTab === "orders" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-foreground">Lab orders</h2>
                    <p className="text-xs text-muted-foreground">Showing {labOrders.length} orders</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <th className="pb-2 pr-4">Date</th><th className="pb-2 pr-4">Tests</th><th className="pb-2 pr-4">Patient</th><th className="pb-2 pr-4">Mode & Address</th><th className="pb-2 pr-4">Agent</th><th className="pb-2 pr-4">Doctor</th><th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labOrders.map((order) => (
                          <tr key={order.id} className="border-b border-border/50 last:border-0 align-top">
                            <td className="py-3 pr-4"><div className="text-xs font-medium text-foreground">{formatIST(order.createdAt)}</div><div className="font-mono text-[10px] text-muted-foreground">{order.id}</div>{order.notes && <p className="mt-0.5 text-[10px] text-muted-foreground italic">{order.notes}</p>}</td>
                            <td className="py-3 pr-4 max-w-[160px]"><ul className="space-y-0.5">{order.tests.map((t, idx) => <li key={idx} className="text-xs text-foreground">• {t.name}{t.qty > 1 ? ` ×${t.qty}` : ""}</li>)}</ul><p className="mt-1 text-xs font-semibold text-foreground">{formatINR(order.amountPaise)}</p></td>
                            <td className="py-3 pr-4"><div className="font-medium text-foreground">{order.patientName}</div><div className="font-mono text-xs text-muted-foreground">{order.patientPhone}</div>{order.patientEmail && <div className="text-[10px] text-muted-foreground">{order.patientEmail}</div>}</td>
                            <td className="py-3 pr-4 max-w-[160px]"><Badge variant="secondary" className="rounded-full text-[11px]">{MODE_LABELS[order.deliveryMode] ?? order.deliveryMode}</Badge>{order.address && <p className="mt-1.5 text-[11px] text-muted-foreground">{order.address}</p>}</td>
                            <td className="py-3 pr-4">{order.collectionAgentName ? <div><p className="text-xs font-medium text-indigo-700 dark:text-indigo-400">{order.collectionAgentName}</p>{order.collectionAgentPhone && <p className="font-mono text-xs text-indigo-600 dark:text-indigo-400">{order.collectionAgentPhone}</p>}</div> : <span className="text-xs text-muted-foreground">Not assigned</span>}</td>
                            <td className="py-3 pr-4"><div className="font-medium text-foreground">{order.providerName}</div><div className="text-xs text-muted-foreground">{order.providerSpeciality}</div></td>
                            <td className="py-3"><div className="space-y-2"><Badge className={`rounded-full text-xs font-semibold uppercase ${STATUS_COLORS[order.status] ?? "bg-muted text-muted-foreground"}`}>{STATUS_LABELS[order.status] ?? order.status}</Badge><Button size="sm" variant="outline" className="rounded-full text-xs block">Update status</Button>{["PROCESSING", "SAMPLE_COLLECTED"].includes(order.status) && <Button size="sm" variant="outline" className="rounded-full text-xs block text-primary border-primary/30">Upload results</Button>}<Button size="sm" variant="ghost" className="rounded-full text-xs block text-primary">Full timeline →</Button></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Agents tab */}
            {activeTab === "agents" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-foreground">Collection agents</h2>
                    <Button variant="outline" className="rounded-full text-xs">Add agent</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <th className="pb-2 pr-4">Name</th><th className="pb-2 pr-4">Phone</th><th className="pb-2 pr-4">Coverage area</th><th className="pb-2 pr-4">Active orders</th><th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockAgents.map((agent) => (
                          <tr key={agent.name} className="border-b border-border/50 last:border-0">
                            <td className="py-3 pr-4 font-medium text-foreground">{agent.name}</td>
                            <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{agent.phone}</td>
                            <td className="py-3 pr-4 text-xs text-muted-foreground">{agent.area}</td>
                            <td className="py-3 pr-4 text-foreground">{agent.activeOrders}</td>
                            <td className="py-3"><Badge variant={agent.status === "Available" ? "secondary" : "default"} className="rounded-full text-xs">{agent.status}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reports tab */}
            {activeTab === "reports" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Lab reports</h2>
                  <p className="text-sm text-muted-foreground">Download and manage completed test reports.</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Reports generated", value: "128", period: "This month" },
                      { label: "Avg turnaround", value: "18 hrs", period: "Sample → Report" },
                      { label: "Pending uploads", value: "4", period: "Awaiting lab staff" },
                    ].map((stat) => (
                      <Card key={stat.label} className="rounded-2xl">
                        <CardContent className="p-4 text-center">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                          <p className="mt-1 text-2xl font-semibold text-foreground">{stat.value}</p>
                          <p className="text-[11px] text-muted-foreground">{stat.period}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Settings tab */}
            {activeTab === "settings" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-lg font-semibold text-foreground">Lab settings</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Lab name", value: "CalDoc Diagnostics" },
                      { label: "NABL accreditation", value: "NABL-MC-4567" },
                      { label: "Contact phone", value: "+91 40 6789 0123" },
                      { label: "Operating hours", value: "7:00 AM – 9:00 PM IST" },
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

export default LabsPortal;
