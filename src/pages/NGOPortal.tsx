import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Calendar, Users, FileText, Heart, MapPin, HandHelping } from "lucide-react";
import { Layout } from "@/components/Layout";
import { AssignPatientDialog } from "@/components/ngo/AssignPatientDialog";
import { EditReservationDialog } from "@/components/ngo/EditReservationDialog";
import { ReleaseSlotButton } from "@/components/ngo/ReleaseSlotButton";
import { ChangePasswordDialog } from "@/components/ngo/ChangePasswordDialog";

function formatCurrency(paise: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(paise / 100);
}

function formatSlot(date: Date | null) {
  if (!date) return "Not scheduled";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata", weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  }).format(date);
}

function formatRangeLabel(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) => d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  return `${fmt(s)} – ${fmt(e)}`;
}

const mockNgo = { name: "Health For All Foundation" };

const kpiCards = [
  { label: "Slots held", value: 12, sub: "pending assignment" },
  { label: "Slots confirmed", value: 28, sub: "patients assigned" },
  { label: "Estimated charges", value: formatCurrency(8400000), sub: "based on held slots" },
  { label: "Confirmed charges", value: formatCurrency(5600000), sub: "actual utilized" },
];

const specialityBreakdown = [
  { speciality: "General Medicine", count: 15 },
  { speciality: "Dermatology", count: 8 },
  { speciality: "Cardiology", count: 6 },
  { speciality: "Pediatrics", count: 5 },
  { speciality: "Orthopedics", count: 4 },
];

const heldReservations = [
  { id: "hr1", friendlyId: "NGO-101", providerName: "Dr. Rajesh Kumar", speciality: "General Medicine", slotTime: new Date("2026-04-12T10:00:00"), amountPaise: 50000, notes: "" },
  { id: "hr2", friendlyId: "NGO-102", providerName: "Dr. Sunitha Reddy", speciality: "Dermatology", slotTime: new Date("2026-04-12T14:30:00"), amountPaise: 80000, notes: "" },
  { id: "hr3", friendlyId: "NGO-103", providerName: "Dr. Venkat Rao", speciality: "Cardiology", slotTime: new Date("2026-04-13T11:00:00"), amountPaise: 100000, notes: "Priority case" },
];

const confirmedAppointments = [
  { id: "ca1", friendlyId: "NGO-051", patientName: "Lakshmi Amma", providerName: "Dr. Rajesh Kumar", speciality: "General Medicine", slotTime: new Date("2026-04-10T10:00:00"), status: "CONFIRMED", feePaise: 50000, hasPrescription: true, hasReceipt: true },
  { id: "ca2", friendlyId: "NGO-052", patientName: "Ramesh Babu", providerName: "Dr. Sunitha Reddy", speciality: "Dermatology", slotTime: new Date("2026-04-10T14:00:00"), status: "CONFIRMED", feePaise: 80000, hasPrescription: false, hasReceipt: true },
  { id: "ca3", friendlyId: "NGO-053", patientName: "Sunitha Devi", providerName: "Dr. Venkat Rao", speciality: "Cardiology", slotTime: new Date("2026-04-11T11:30:00"), status: "CANCELLED", feePaise: 100000, hasPrescription: false, hasReceipt: false },
];

const statusClasses: Record<string, string> = {
  CONFIRMED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  CANCELLED: "bg-destructive/10 text-destructive",
  PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
};

const thCls = "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground";
const tdCls = "px-3 py-3 align-middle";

const NGOPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "campaigns", label: "Campaigns", icon: Calendar },
    { id: "volunteers", label: "Volunteers", icon: Users },
    { id: "reports", label: "Reports", icon: FileText },
  ];

  const impactCards = [
    { icon: Users, label: "Beneficiaries Served", value: "8,420", growth: "+22%" },
    { icon: Heart, label: "Health Camps", value: "56", growth: "+15%" },
    { icon: HandHelping, label: "Volunteers", value: "124", growth: "+8%" },
    { icon: MapPin, label: "Districts Covered", value: "18", growth: "+3" },
  ];

  const [startDate, setStartDate] = useState("2026-04-09");
  const [endDate, setEndDate] = useState("2026-04-16");

  const rangeLabel = formatRangeLabel(startDate, endDate);

  return (
    <Layout>
      <section className="pt-24 pb-10">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">NGO dashboard</p>
                <h1 className="mt-0.5 text-2xl sm:text-3xl font-semibold text-foreground">{mockNgo.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">Track every appointment booked under your programmes.</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Showing reservations between {rangeLabel}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" className="rounded-full text-primary border-primary/40">+ New booking</Button>
                <Button variant="outline" className="rounded-full text-primary border-primary/40">Download invoice</Button>
                <ChangePasswordDialog />
                <Button className="rounded-full">Sign out</Button>
              </div>
            </div>

            {/* KPI cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kpiCards.map((card) => (
                <Card key={card.label} className="rounded-2xl">
                  <CardContent className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">{card.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">
                      {typeof card.value === "number" ? card.value.toLocaleString("en-IN") : card.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Date range filter */}
            <Card className="rounded-2xl">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-muted-foreground" htmlFor="ngo-start-date">From</label>
                    <input id="ngo-start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-muted-foreground" htmlFor="ngo-end-date">To</label>
                    <input id="ngo-end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  </div>
                  <Button className="rounded-full">Update range</Button>
                </div>
              </CardContent>
            </Card>

            {/* Specialty breakdown */}
            <Card className="rounded-2xl">
              <CardContent className="p-5">
                <h2 className="text-base font-semibold text-foreground">Specialty breakdown</h2>
                <p className="text-xs text-muted-foreground">Counts of slots held within the selected range.</p>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-border text-sm">
                    <thead>
                      <tr>
                        <th className={thCls}>Specialty</th>
                        <th className={`${thCls} text-right`}>Reservations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {specialityBreakdown.length === 0 && (
                        <tr><td colSpan={2} className="px-3 py-4 text-center text-sm text-muted-foreground">No reservations within this date range.</td></tr>
                      )}
                      {specialityBreakdown.map((row) => (
                        <tr key={row.speciality}>
                          <td className={tdCls}>{row.speciality}</td>
                          <td className={`${tdCls} text-right font-semibold`}>{row.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Held reservations */}
            <Card className="rounded-2xl">
              <CardContent className="p-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Held reservations</h2>
                    <p className="text-xs text-muted-foreground">Slots you're holding — assign a patient when they arrive, or release unused slots.</p>
                  </div>
                  <Badge variant="secondary" className="rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                    {heldReservations.length} pending
                  </Badge>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-border text-sm">
                    <thead>
                      <tr>
                        <th className={thCls}>Booking ID</th>
                        <th className={thCls}>Provider</th>
                        <th className={thCls}>Specialty</th>
                        <th className={thCls}>Slot time</th>
                        <th className={`${thCls} text-right`}>Est. amount</th>
                        <th className={thCls}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {heldReservations.length === 0 && (
                        <tr><td colSpan={6} className="px-3 py-6 text-center text-sm text-muted-foreground">No held reservations at the moment.</td></tr>
                      )}
                      {heldReservations.map((r) => (
                        <tr key={r.id}>
                          <td className={`${tdCls} font-mono text-xs text-muted-foreground`}>{r.friendlyId}</td>
                          <td className={tdCls}>{r.providerName}</td>
                          <td className={tdCls}>
                            <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">{r.speciality}</Badge>
                          </td>
                          <td className={`${tdCls} whitespace-nowrap text-xs`}>{formatSlot(r.slotTime)}</td>
                          <td className={`${tdCls} text-right font-semibold`}>{formatCurrency(r.amountPaise)}</td>
                          <td className={`${tdCls} space-y-1.5`}>
                            <AssignPatientDialog
                              reservationId={r.id}
                              friendlyId={r.friendlyId}
                              providerName={r.providerName}
                              slotTime={formatSlot(r.slotTime)}
                            />
                            <div className="flex gap-1.5">
                              <EditReservationDialog
                                reservationId={r.id}
                                initialAmountPaise={r.amountPaise}
                                initialNotes={r.notes}
                              />
                              <ReleaseSlotButton reservationId={r.id} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Confirmed appointments */}
            <Card className="rounded-2xl">
              <CardContent className="p-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Confirmed appointments</h2>
                    <p className="text-xs text-muted-foreground">Slots with patients assigned — showing up to 100 bookings.</p>
                  </div>
                  <Badge className="rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    {confirmedAppointments.filter((a) => a.status === "CONFIRMED").length} confirmed
                  </Badge>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-border text-sm">
                    <thead>
                      <tr>
                        <th className={thCls}>Booking ID</th>
                        <th className={thCls}>Patient</th>
                        <th className={thCls}>Provider</th>
                        <th className={thCls}>Speciality</th>
                        <th className={thCls}>Slot</th>
                        <th className={thCls}>Status</th>
                        <th className={`${thCls} text-right`}>Amount</th>
                        <th className={thCls}>Links</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {confirmedAppointments.length === 0 && (
                        <tr><td colSpan={8} className="px-3 py-6 text-center text-sm text-muted-foreground">No confirmed bookings yet. Assign patients to your held slots above.</td></tr>
                      )}
                      {confirmedAppointments.map((appt) => (
                        <tr key={appt.id}>
                          <td className={`${tdCls} font-mono text-xs text-muted-foreground`}>{appt.friendlyId}</td>
                          <td className={tdCls}>
                            <span className="font-medium text-foreground">{appt.patientName}</span>
                          </td>
                          <td className={tdCls}>{appt.providerName}</td>
                          <td className={tdCls}>
                            <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">{appt.speciality}</Badge>
                          </td>
                          <td className={`${tdCls} whitespace-nowrap text-xs`}>{formatSlot(appt.slotTime)}</td>
                          <td className={tdCls}>
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusClasses[appt.status] || "bg-muted text-muted-foreground"}`}>
                              {appt.status}
                            </span>
                          </td>
                          <td className={`${tdCls} text-right font-semibold`}>{formatCurrency(appt.feePaise)}</td>
                          <td className={`${tdCls} space-y-1`}>
                            {appt.hasPrescription && (
                              <Button size="sm" variant="outline" className="rounded-full text-xs text-primary border-primary/30 w-full">Prescription</Button>
                            )}
                            {appt.hasReceipt && (
                              <Button size="sm" variant="outline" className="rounded-full text-xs w-full">Receipt</Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default NGOPortal;
