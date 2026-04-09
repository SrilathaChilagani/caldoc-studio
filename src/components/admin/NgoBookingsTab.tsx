import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Reservation = {
  id: string;
  friendly_id: string;
  provider_name: string;
  speciality: string | null;
  slot_time: string | null;
  status: string;
  patient_name: string | null;
  ngo_id: string;
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

export function NgoBookingsTab() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchReservations() {
    setLoading(true);
    // Admin can see all NGO reservations — RLS allows via has_role or we query via edge function
    // For now, query directly (admin RLS policy may need to be added if not present)
    const { data, error } = await supabase
      .from("ngo_reservations")
      .select("id, friendly_id, provider_name, speciality, slot_time, status, patient_name, ngo_id")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      toast.error("Failed to load NGO bookings");
      setReservations([]);
    } else {
      setReservations(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <Card className="rounded-3xl">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">NGO bookings</h2>
            <p className="text-xs text-muted-foreground">
              Latest 20 ·{" "}
              <Link to="/ngo-portal" className="text-primary hover:underline">
                View all
              </Link>
            </p>
          </div>
          <Button size="sm" variant="outline" className="rounded-full text-xs" onClick={fetchReservations} disabled={loading}>
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Refresh"}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : reservations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No NGO bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {["ID", "Patient", "Doctor", "Slot", "Status"].map((h) => (
                    <th key={h} className="pb-2 pr-4 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5 pr-4 font-mono text-xs font-semibold text-muted-foreground">{r.friendly_id}</td>
                    <td className="py-2.5 pr-4 font-medium text-foreground">{r.patient_name || "—"}</td>
                    <td className="py-2.5 pr-4">
                      <div className="font-medium text-foreground">{r.provider_name}</div>
                      <div className="text-xs text-muted-foreground">{r.speciality || ""}</div>
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                      {r.slot_time ? formatIST(r.slot_time) : "—"}
                    </td>
                    <td className="py-2.5 pr-4">
                      <Badge
                        variant={r.status === "CONFIRMED" ? "default" : "secondary"}
                        className="rounded-full text-xs uppercase"
                      >
                        {r.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
