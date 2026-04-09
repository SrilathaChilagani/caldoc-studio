import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  reservationId: string;
  friendlyId: string;
  providerName: string;
  slotTime: string;
};

export function AssignPatientDialog({ friendlyId, providerName, slotTime }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ patientName: "", patientPhone: "", patientEmail: "", visitMode: "VIDEO" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.patientName.trim() || !form.patientPhone.trim()) {
      setError("Patient name and phone are required.");
      return;
    }
    setLoading(true);
    setError(null);
    // Mock: simulate API call
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      setForm({ patientName: "", patientPhone: "", patientEmail: "", visitMode: "VIDEO" });
    }, 800);
  }

  return (
    <>
      <Button size="sm" className="rounded-full text-xs w-full" onClick={() => { setOpen(true); setError(null); }}>
        Assign patient
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{friendlyId}</p>
            <DialogTitle>Assign patient to slot</DialogTitle>
            <DialogDescription>{providerName} · {slotTime}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>Patient full name *</Label>
                <Input value={form.patientName} onChange={(e) => set("patientName", e.target.value)} placeholder="Ravi Kumar" required />
              </div>
              <div className="space-y-1.5">
                <Label>Mobile number *</Label>
                <Input value={form.patientPhone} onChange={(e) => set("patientPhone", e.target.value)} placeholder="+91 98765 43210" required />
              </div>
              <div className="space-y-1.5">
                <Label>Email (optional)</Label>
                <Input value={form.patientEmail} onChange={(e) => set("patientEmail", e.target.value)} placeholder="ravi@email.com" type="email" />
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Consultation mode</p>
              <div className="grid grid-cols-2 gap-2">
                {(["VIDEO", "AUDIO"] as const).map((mode) => (
                  <label
                    key={mode}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                      form.visitMode === mode
                        ? "border-primary bg-primary/5 font-medium text-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <input type="radio" name="visitMode" value={mode} checked={form.visitMode === mode} onChange={() => set("visitMode", mode)} className="accent-primary" />
                    {mode === "VIDEO" ? "Video call" : "Audio only"}
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" className="rounded-full" disabled={loading}>
                {loading ? "Confirming…" : "Confirm patient"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
