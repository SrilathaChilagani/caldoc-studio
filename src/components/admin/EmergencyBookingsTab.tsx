import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, AlertTriangle, UserCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Booking = {
  id: string;
  booking_id: string;
  patient_name: string;
  patient_phone: string;
  symptoms: string | null;
  consultation_type: string;
  status: string;
  assigned_doctor_name: string | null;
  created_at: string;
};

function formatIST(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  assigned: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export function EmergencyBookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignDialog, setAssignDialog] = useState<Booking | null>(null);
  const [doctorName, setDoctorName] = useState("");
  const [assigning, setAssigning] = useState(false);

  async function fetchBookings() {
    setLoading(true);
    const { data, error } = await supabase
      .from("emergency_bookings")
      .select("id, booking_id, patient_name, patient_phone, symptoms, consultation_type, status, assigned_doctor_name, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      toast.error("Failed to load emergency bookings");
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function handleAssign() {
    if (!assignDialog || !doctorName.trim()) return;
    setAssigning(true);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-emergency-patient`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            booking_id: assignDialog.id,
            doctor_name: doctorName.trim(),
          }),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Assignment failed");
      toast.success("Doctor assigned & patient notified");
      setAssignDialog(null);
      setDoctorName("");
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAssigning(false);
    }
  }

  return (
    <>
      <Card className="rounded-3xl">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Emergency bookings
              </h2>
              <p className="text-xs text-muted-foreground">
                {bookings.filter((b) => b.status === "pending").length} pending assignment
              </p>
            </div>
            <Button size="sm" variant="outline" className="rounded-full text-xs" onClick={fetchBookings} disabled={loading}>
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Refresh"}
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No emergency bookings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {["ID", "Patient", "Symptoms", "Type", "Status", "Doctor", "Created", "Actions"].map((h) => (
                      <th key={h} className="pb-2 pr-4 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-border/50 last:border-0">
                      <td className="py-2.5 pr-4 font-mono text-xs font-semibold text-muted-foreground">{b.booking_id}</td>
                      <td className="py-2.5 pr-4">
                        <div className="font-medium text-foreground">{b.patient_name}</div>
                        <div className="text-xs text-muted-foreground">{b.patient_phone}</div>
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-muted-foreground max-w-[150px] truncate">{b.symptoms || "—"}</td>
                      <td className="py-2.5 pr-4 text-xs text-muted-foreground">{b.consultation_type}</td>
                      <td className="py-2.5 pr-4">
                        <Badge className={`rounded-full text-xs uppercase ${statusColors[b.status] || ""}`}>
                          {b.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-foreground">{b.assigned_doctor_name || "—"}</td>
                      <td className="py-2.5 pr-4 text-xs text-muted-foreground">{formatIST(b.created_at)}</td>
                      <td className="py-2.5">
                        {b.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full text-xs gap-1"
                            onClick={() => { setAssignDialog(b); setDoctorName(""); }}
                          >
                            <UserCheck className="w-3 h-3" /> Assign
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!assignDialog} onOpenChange={(open) => !open && setAssignDialog(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Assign doctor to {assignDialog?.patient_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Booking <span className="font-mono font-semibold">{assignDialog?.booking_id}</span> · {assignDialog?.symptoms || "No symptoms listed"}
            </p>
            <Input
              placeholder="Doctor name (e.g. Dr. Rajesh Kumar)"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setAssignDialog(null)}>Cancel</Button>
            <Button className="rounded-full" disabled={!doctorName.trim() || assigning} onClick={handleAssign}>
              {assigning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Assign & notify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
