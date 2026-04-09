import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const volunteers = [
  { id: "v1", name: "Priya Sharma", phone: "+91 98765 43210", email: "priya@email.com", district: "Anantapur", role: "Field Coordinator", campaigns: 4, status: "ACTIVE" },
  { id: "v2", name: "Ravi Teja", phone: "+91 87654 32109", email: "ravi.t@email.com", district: "Guntur", role: "Health Worker", campaigns: 3, status: "ACTIVE" },
  { id: "v3", name: "Anitha Kumari", phone: "+91 76543 21098", email: "anitha.k@email.com", district: "Vizag", role: "Community Nurse", campaigns: 5, status: "ACTIVE" },
  { id: "v4", name: "Suresh Reddy", phone: "+91 65432 10987", email: "suresh.r@email.com", district: "Hyderabad", role: "Data Entry", campaigns: 2, status: "INACTIVE" },
  { id: "v5", name: "Lakshmi Devi", phone: "+91 54321 09876", email: "lakshmi.d@email.com", district: "Nellore", role: "Field Coordinator", campaigns: 6, status: "ACTIVE" },
  { id: "v6", name: "Venkat Rao", phone: "+91 43210 98765", email: "venkat.r@email.com", district: "Kurnool", role: "Health Worker", campaigns: 1, status: "ACTIVE" },
];

const thCls = "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground";
const tdCls = "px-3 py-3 align-middle";

export function VolunteersTab({ ngoId }: { ngoId: string }) {
  const [search, setSearch] = useState("");
  const filtered = volunteers.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) || v.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Volunteers</h2>
          <p className="text-sm text-muted-foreground">Manage your volunteer network across districts.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or district…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-full w-56"
            />
          </div>
          <Button size="sm" className="rounded-full gap-1">
            <Plus className="w-3.5 h-3.5" /> Add volunteer
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead>
                <tr>
                  <th className={thCls}>Name</th>
                  <th className={thCls}>Role</th>
                  <th className={thCls}>District</th>
                  <th className={thCls}>Contact</th>
                  <th className={`${thCls} text-center`}>Campaigns</th>
                  <th className={thCls}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-3 py-6 text-center text-sm text-muted-foreground">No volunteers found.</td></tr>
                )}
                {filtered.map((vol) => (
                  <tr key={vol.id}>
                    <td className={tdCls}>
                      <span className="font-medium text-foreground">{vol.name}</span>
                    </td>
                    <td className={tdCls}>
                      <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">{vol.role}</Badge>
                    </td>
                    <td className={tdCls}>
                      <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="w-3.5 h-3.5" />{vol.district}</span>
                    </td>
                    <td className={`${tdCls} space-y-0.5`}>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="w-3 h-3" />{vol.phone}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="w-3 h-3" />{vol.email}</p>
                    </td>
                    <td className={`${tdCls} text-center font-semibold`}>{vol.campaigns}</td>
                    <td className={tdCls}>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        vol.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {vol.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
