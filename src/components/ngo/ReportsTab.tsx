import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Users, Heart, MapPin, Calendar } from "lucide-react";

const monthlySummary = [
  { month: "Jan 2026", beneficiaries: 620, camps: 4, volunteers: 45, spending: 182000 },
  { month: "Feb 2026", beneficiaries: 780, camps: 6, volunteers: 52, spending: 245000 },
  { month: "Mar 2026", beneficiaries: 1040, camps: 8, volunteers: 68, spending: 312000 },
  { month: "Apr 2026", beneficiaries: 890, camps: 5, volunteers: 58, spending: 278000 },
];

function formatCurrency(paise: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(paise / 100);
}

const districtReach = [
  { district: "Anantapur", beneficiaries: 1850, camps: 8 },
  { district: "Guntur", beneficiaries: 1420, camps: 6 },
  { district: "Vizag", beneficiaries: 1180, camps: 5 },
  { district: "Hyderabad", beneficiaries: 980, camps: 4 },
  { district: "Nellore", beneficiaries: 760, camps: 3 },
  { district: "Kurnool", beneficiaries: 650, camps: 3 },
];

const thCls = "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground";
const tdCls = "px-3 py-3 align-middle";

export function ReportsTab({ ngoId }: { ngoId: string }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Reports</h2>
          <p className="text-sm text-muted-foreground">Monthly performance and impact summaries.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full gap-1">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" className="rounded-full gap-1">
            <Download className="w-3.5 h-3.5" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Monthly summary */}
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Monthly summary
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Aggregated performance across all campaigns.</p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead>
                <tr>
                  <th className={thCls}><Calendar className="w-3.5 h-3.5 inline mr-1" />Month</th>
                  <th className={`${thCls} text-right`}><Users className="w-3.5 h-3.5 inline mr-1" />Beneficiaries</th>
                  <th className={`${thCls} text-right`}><Heart className="w-3.5 h-3.5 inline mr-1" />Camps</th>
                  <th className={`${thCls} text-right`}>Volunteers</th>
                  <th className={`${thCls} text-right`}>Spending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {monthlySummary.map((row) => (
                  <tr key={row.month}>
                    <td className={`${tdCls} font-medium`}>{row.month}</td>
                    <td className={`${tdCls} text-right font-semibold`}>{row.beneficiaries.toLocaleString("en-IN")}</td>
                    <td className={`${tdCls} text-right`}>{row.camps}</td>
                    <td className={`${tdCls} text-right`}>{row.volunteers}</td>
                    <td className={`${tdCls} text-right font-semibold`}>{formatCurrency(row.spending)}</td>
                  </tr>
                ))}
                <tr className="bg-muted/50 font-semibold">
                  <td className={tdCls}>Total</td>
                  <td className={`${tdCls} text-right`}>{monthlySummary.reduce((s, r) => s + r.beneficiaries, 0).toLocaleString("en-IN")}</td>
                  <td className={`${tdCls} text-right`}>{monthlySummary.reduce((s, r) => s + r.camps, 0)}</td>
                  <td className={`${tdCls} text-right`}>{monthlySummary.reduce((s, r) => s + r.volunteers, 0)}</td>
                  <td className={`${tdCls} text-right`}>{formatCurrency(monthlySummary.reduce((s, r) => s + r.spending, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* District reach */}
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> District-wise reach
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Beneficiaries and camps by district.</p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead>
                <tr>
                  <th className={thCls}>District</th>
                  <th className={`${thCls} text-right`}>Beneficiaries</th>
                  <th className={`${thCls} text-right`}>Camps</th>
                  <th className={thCls}>Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {districtReach.map((row) => {
                  const max = Math.max(...districtReach.map((d) => d.beneficiaries));
                  const pct = Math.round((row.beneficiaries / max) * 100);
                  return (
                    <tr key={row.district}>
                      <td className={`${tdCls} font-medium`}>{row.district}</td>
                      <td className={`${tdCls} text-right font-semibold`}>{row.beneficiaries.toLocaleString("en-IN")}</td>
                      <td className={`${tdCls} text-right`}>{row.camps}</td>
                      <td className={tdCls}>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
