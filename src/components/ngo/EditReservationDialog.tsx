import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = {
  reservationId: string;
  initialAmountPaise?: number | null;
  initialNotes?: string | null;
};

function paiseToDisplay(paise?: number | null) {
  if (typeof paise !== "number" || Number.isNaN(paise)) return "";
  return (paise / 100).toFixed(2);
}

export function EditReservationDialog({ reservationId, initialAmountPaise, initialNotes }: Props) {
  const [open, setOpen] = useState(false);
  const [amountInput, setAmountInput] = useState(() => paiseToDisplay(initialAmountPaise));
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setTimeout(() => {
      setSaving(false);
      setOpen(false);
    }, 600);
  }

  if (!open) {
    return (
      <Button size="sm" variant="outline" className="rounded-full text-xs flex-1" onClick={() => setOpen(true)}>
        Edit
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-2xl border border-border bg-muted/50 p-3 text-xs">
      <div className="space-y-1">
        <Label htmlFor={`amount-${reservationId}`} className="text-xs">Amount (INR)</Label>
        <Input id={`amount-${reservationId}`} type="number" step="0.01" min="0" value={amountInput} onChange={(e) => setAmountInput(e.target.value)} className="h-8 text-sm" />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`notes-${reservationId}`} className="text-xs">Notes</Label>
        <Textarea id={`notes-${reservationId}`} value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="text-sm" />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" className="rounded-full text-xs" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
        <Button type="button" size="sm" variant="outline" className="rounded-full text-xs" onClick={() => { setOpen(false); setAmountInput(paiseToDisplay(initialAmountPaise)); setNotes(initialNotes ?? ""); }}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
