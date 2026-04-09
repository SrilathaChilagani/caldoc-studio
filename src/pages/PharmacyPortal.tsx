import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { LayoutDashboard, Package, Pill, Settings } from "lucide-react";
import { useAppAuth } from "@/contexts/AppAuthContext";

const portalTabs = [
  { id: "queue", label: "Fulfilment Queue", icon: LayoutDashboard },
  { id: "rx", label: "Rx Orders", icon: Pill },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "settings", label: "Settings", icon: Settings },
];

function formatINR(paise: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(paise / 100);
}

const fulfillmentKpis = [
  { label: "Ready", value: 8 },
  { label: "WhatsApp sent", value: 3 },
  { label: "Packed", value: 5 },
  { label: "Shipped", value: 4 },
  { label: "Delivered", value: 42 },
  { label: "Waiting for Rx", value: 6 },
];

const appointmentRows = [
  { id: "appt-p1", createdAt: "Mon, 09 Apr, 08:30 AM", providerName: "Dr. Rajesh Kumar", providerSpeciality: "General Medicine", contactName: "Priya Sharma", contactPhone: "+91 98765 43210", delivery: "Delivery", address: "12 MG Road, Jubilee Hills, Hyderabad, TS 500033", fulfillmentLabel: "Ready", hasPrescription: true },
  { id: "appt-p2", createdAt: "Sun, 08 Apr, 02:15 PM", providerName: "Dr. Sunitha Reddy", providerSpeciality: "Dermatology", contactName: "Ramesh Babu", contactPhone: "+91 87654 32109", delivery: "WhatsApp", address: null, fulfillmentLabel: "Sent", hasPrescription: true },
  { id: "appt-p3", createdAt: "Sat, 07 Apr, 11:00 AM", providerName: "Dr. Venkat Rao", providerSpeciality: "Cardiology", contactName: "Sunitha Devi", contactPhone: "+91 76543 21098", delivery: "Delivery", address: "45 Road No 10, Banjara Hills, Hyderabad, TS 500034", fulfillmentLabel: "Packed", hasPrescription: true },
  { id: "appt-p4", createdAt: "Fri, 06 Apr, 09:45 AM", providerName: "Dr. Lakshmi Devi", providerSpeciality: "Pediatrics", contactName: "Venkat Rao", contactPhone: "+91 65432 10987", delivery: "Delivery", address: "78 Kukatpally Housing Board, Hyderabad, TS 500072", fulfillmentLabel: "Shipped", hasPrescription: false },
];

const rxOrders = [
  { id: "rx-001", createdAt: "09 Apr, 10:15 AM", patientName: "Lakshmi Amma", patientPhone: "+91 94401 23456", items: ["Metformin 500mg × 2", "Atorvastatin 10mg × 1"], address: "22 Gandhi Nagar, Kurnool, AP 518001", trackingNumber: "DTDC-84729103", courierName: "DTDC", amountPaise: 45000, status: "DISPATCHED" },
  { id: "rx-002", createdAt: "08 Apr, 03:30 PM", patientName: "Ramesh Kumar", patientPhone: "+91 93305 67890", items: ["Amoxicillin 500mg × 3"], address: "55 Station Road, Anantapur, AP 515001", trackingNumber: null, courierName: null, amountPaise: 32000, status: "PAID" },
  { id: "rx-003", createdAt: "07 Apr, 09:00 AM", patientName: "Sunitha Devi", patientPhone: "+91 76543 21098", items: ["Pantoprazole 40mg × 1", "Domperidone 10mg × 2"], address: "88 Nehru Street, Warangal, TS 506002", trackingNumber: null, courierName: null, amountPaise: 28000, status: "AWAITING_PAYMENT" },
];

const rxStatusClasses: Record<string, string> = {
  AWAITING_PAYMENT: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  PAID: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  PROCESSING: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  DISPATCHED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400",
  DELIVERED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  CANCELLED: "bg-destructive/10 text-destructive",
};

const rxStatusLabels: Record<string, string> = {
  AWAITING_PAYMENT: "Awaiting payment", PAID: "Paid", PROCESSING: "Processing", DISPATCHED: "Dispatched", DELIVERED: "Delivered", CANCELLED: "Cancelled",
};

const rxKpis = [
  { label: "Total", value: 3, color: "text-foreground" },
  { label: "Awaiting payment", value: 1, color: "text-amber-700 dark:text-amber-400" },
  { label: "Paid", value: 1, color: "text-blue-700 dark:text-blue-400" },
  { label: "Processing", value: 0, color: "text-violet-700 dark:text-violet-400" },
  { label: "Dispatched", value: 1, color: "text-indigo-700 dark:text-indigo-400" },
  { label: "Delivered", value: 0, color: "text-emerald-700 dark:text-emerald-400" },
];

const mockInventory = [
  { name: "Metformin 500mg", stock: 240, reorder: 50, status: "In stock" },
  { name: "Atorvastatin 10mg", stock: 180, reorder: 40, status: "In stock" },
  { name: "Amoxicillin 500mg", stock: 15, reorder: 30, status: "Low stock" },
  { name: "Pantoprazole 40mg", stock: 92, reorder: 25, status: "In stock" },
  { name: "Domperidone 10mg", stock: 8, reorder: 20, status: "Low stock" },
];

const PharmacyPortal = () => {
  const { signOut } = useAppAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("queue");

  return (
    <Layout>
      <section className="pt-24 pb-10">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Pharmacy portal</p>
                <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Pharmacy queue</h1>
                <p className="mt-1 text-sm text-muted-foreground">Track every appointment to pack and dispatch prescriptions.</p>
              </div>
              <Button variant="outline" className="rounded-full" onClick={() => signOut().then(() => navigate("/login?portal=pharmacy"))}>Log out</Button>
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {fulfillmentKpis.map((k) => (
                <Card key={k.label} className="rounded-2xl bg-muted/50">
                  <CardContent className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{k.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">{k.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Queue tab */}
            {activeTab === "queue" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-foreground">Recent appointments</h2>
                    <p className="text-xs text-muted-foreground">Showing the last {appointmentRows.length} bookings.</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <th className="pb-2 pr-4">Created</th><th className="pb-2 pr-4">Provider</th><th className="pb-2 pr-4">Patient</th><th className="pb-2 pr-4">Delivery</th><th className="pb-2 pr-4">Status</th><th className="pb-2">Prescription</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointmentRows.map((appt) => (
                          <tr key={appt.id} className="border-b border-border/50 last:border-0">
                            <td className="py-3 pr-4 text-xs text-muted-foreground"><div className="font-medium text-foreground">{appt.createdAt}</div><div className="font-mono text-[10px]">{appt.id.slice(-8)}</div></td>
                            <td className="py-3 pr-4"><div className="font-semibold text-foreground">{appt.providerName}</div><div className="text-xs text-muted-foreground">{appt.providerSpeciality}</div></td>
                            <td className="py-3 pr-4"><div className="font-semibold text-foreground">{appt.contactName}</div><div className="font-mono text-xs text-muted-foreground">{appt.contactPhone}</div></td>
                            <td className="py-3 pr-4"><Badge variant="secondary" className="rounded-full">{appt.delivery}</Badge>{appt.address ? <p className="mt-1.5 text-xs text-muted-foreground max-w-[180px]">{appt.address}</p> : <p className="mt-1.5 text-xs text-muted-foreground">No address</p>}</td>
                            <td className="py-3 pr-4"><Badge className="rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">{appt.fulfillmentLabel}</Badge><div className="mt-2"><Button size="sm" variant="outline" className="rounded-full text-xs">Next step →</Button></div></td>
                            <td className="py-3">{appt.hasPrescription ? <Button size="sm" variant="outline" className="rounded-full text-xs text-primary border-primary/30">Download Rx</Button> : <span className="text-xs text-muted-foreground">Waiting on doctor</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rx Orders tab */}
            {activeTab === "rx" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Ad-hoc Rx delivery orders</h2>
                      <p className="text-sm text-muted-foreground">Patient-submitted prescription delivery orders with supply chain tracking.</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Showing {rxOrders.length} orders</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {rxKpis.map((k) => (
                      <Card key={k.label} className="rounded-xl bg-muted/50">
                        <CardContent className="p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{k.label}</p>
                          <p className={`mt-0.5 text-xl font-semibold ${k.color}`}>{k.value}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <th className="pb-2 pr-4">Date</th><th className="pb-2 pr-4">Patient</th><th className="pb-2 pr-4">Items</th><th className="pb-2 pr-4">Address</th><th className="pb-2 pr-4">Tracking</th><th className="pb-2 pr-4">Amount</th><th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rxOrders.map((order) => (
                          <tr key={order.id} className="border-b border-border/50 last:border-0 align-top">
                            <td className="py-3 pr-4"><div className="text-xs font-medium text-foreground">{order.createdAt}</div><div className="font-mono text-[10px] text-muted-foreground">{order.id}</div></td>
                            <td className="py-3 pr-4"><div className="font-medium text-foreground">{order.patientName}</div><div className="text-xs text-muted-foreground">{order.patientPhone}</div></td>
                            <td className="py-3 pr-4 max-w-[160px]"><ul className="space-y-0.5 text-xs text-muted-foreground">{order.items.map((item, i) => <li key={i}>• {item}</li>)}</ul></td>
                            <td className="py-3 pr-4 max-w-[180px]"><p className="text-xs text-muted-foreground">{order.address}</p></td>
                            <td className="py-3 pr-4">{order.trackingNumber ? <div>{order.courierName && <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400">{order.courierName}</p>}<p className="font-mono text-xs text-foreground">{order.trackingNumber}</p></div> : <span className="text-xs text-muted-foreground">—</span>}</td>
                            <td className="py-3 pr-4 font-semibold text-foreground">{formatINR(order.amountPaise)}</td>
                            <td className="py-3"><Badge className={`rounded-full text-xs font-semibold uppercase ${rxStatusClasses[order.status] || "bg-muted text-muted-foreground"}`}>{rxStatusLabels[order.status] || order.status}</Badge><div className="mt-2"><Button size="sm" variant="outline" className="rounded-full text-xs">Update</Button></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Inventory tab */}
            {activeTab === "inventory" && (
              <Card className="rounded-3xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-foreground">Inventory overview</h2>
                    <Button variant="outline" className="rounded-full text-xs">Add item</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <th className="pb-2 pr-4">Medicine</th><th className="pb-2 pr-4">Stock</th><th className="pb-2 pr-4">Reorder level</th><th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockInventory.map((item) => (
                          <tr key={item.name} className="border-b border-border/50 last:border-0">
                            <td className="py-3 pr-4 font-medium text-foreground">{item.name}</td>
                            <td className="py-3 pr-4 text-foreground">{item.stock}</td>
                            <td className="py-3 pr-4 text-muted-foreground">{item.reorder}</td>
                            <td className="py-3"><Badge variant={item.status === "Low stock" ? "destructive" : "secondary"} className="rounded-full text-xs">{item.status}</Badge></td>
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
                  <h2 className="text-lg font-semibold text-foreground">Pharmacy settings</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Pharmacy name", value: "CalDoc Pharmacy" },
                      { label: "Default courier", value: "DTDC" },
                      { label: "Contact phone", value: "+91 40 2345 6789" },
                      { label: "License number", value: "AP-PH-2024-001234" },
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

export default PharmacyPortal;
