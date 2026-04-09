import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Plus } from "lucide-react";

const campaigns = [
  { id: "c1", name: "Rural Eye Care Drive", status: "ACTIVE", startDate: "2026-03-01", endDate: "2026-04-30", districts: ["Anantapur", "Kurnool"], beneficiaries: 1240, target: 2000, volunteers: 18 },
  { id: "c2", name: "Maternal Health Awareness", status: "ACTIVE", startDate: "2026-02-15", endDate: "2026-05-15", districts: ["Guntur", "Prakasam"], beneficiaries: 860, target: 1500, volunteers: 12 },
  { id: "c3", name: "Diabetes Screening Camp", status: "UPCOMING", startDate: "2026-05-01", endDate: "2026-06-30", districts: ["Vizag", "Srikakulam"], beneficiaries: 0, target: 3000, volunteers: 0 },
  { id: "c4", name: "Child Nutrition Programme", status: "COMPLETED", startDate: "2025-10-01", endDate: "2026-01-31", districts: ["Nellore", "Chittoor", "Kadapa"], beneficiaries: 2450, target: 2000, volunteers: 22 },
  { id: "c5", name: "Mental Health First Aid", status: "ACTIVE", startDate: "2026-01-10", endDate: "2026-07-10", districts: ["Hyderabad", "Rangareddy"], beneficiaries: 520, target: 1000, volunteers: 8 },
];

const statusClasses: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  UPCOMING: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  COMPLETED: "bg-primary/10 text-primary",
};

export function CampaignsTab() {
  const [filter, setFilter] = useState("ALL");
  const filtered = filter === "ALL" ? campaigns : campaigns.filter((c) => c.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Campaigns</h2>
          <p className="text-sm text-muted-foreground">Health programmes and outreach campaigns.</p>
        </div>
        <div className="flex items-center gap-2">
          {["ALL", "ACTIVE", "UPCOMING", "COMPLETED"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
          <Button size="sm" className="rounded-full gap-1">
            <Plus className="w-3.5 h-3.5" /> New campaign
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((campaign) => {
          const progress = campaign.target > 0 ? Math.round((campaign.beneficiaries / campaign.target) * 100) : 0;
          return (
            <Card key={campaign.id} className="rounded-2xl">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusClasses[campaign.status] || "bg-muted text-muted-foreground"}`}>
                    {campaign.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{campaign.startDate} → {campaign.endDate}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{campaign.districts.join(", ")}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{campaign.volunteers} volunteers</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Beneficiaries</span>
                    <span className="font-semibold text-foreground">{campaign.beneficiaries.toLocaleString("en-IN")} / {campaign.target.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{progress}% of target</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
