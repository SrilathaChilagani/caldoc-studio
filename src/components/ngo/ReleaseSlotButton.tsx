import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = { reservationId: string };

export function ReleaseSlotButton({ reservationId }: Props) {
  const [releasing, setReleasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleRelease() {
    setError(null);
    setReleasing(true);
    // Mock release
    setTimeout(() => {
      setReleasing(false);
    }, 600);
  }

  return (
    <div className="space-y-1">
      <Button size="sm" variant="outline" className="rounded-full text-xs flex-1 text-destructive border-destructive/30" onClick={handleRelease} disabled={releasing}>
        {releasing ? "Releasing…" : "Release"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
