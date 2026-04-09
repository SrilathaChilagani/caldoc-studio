import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard, Calendar, Users, FileText, Heart, MapPin, HandHelping } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ChangePasswordDialog } from "@/components/ngo/ChangePasswordDialog";
import { DashboardTab } from "@/components/ngo/DashboardTab";
import { CampaignsTab } from "@/components/ngo/CampaignsTab";
import { VolunteersTab } from "@/components/ngo/VolunteersTab";
import { ReportsTab } from "@/components/ngo/ReportsTab";
import { useNgoAuth } from "@/contexts/NgoAuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function formatRangeLabel(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) => d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  return `${fmt(s)} – ${fmt(e)}`;
}

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "campaigns", label: "Campaigns", icon: Calendar },
  { id: "volunteers", label: "Volunteers", icon: Users },
  { id: "reports", label: "Reports", icon: FileText },
];

const NGOPortal = () => {
  const { user, ngoId, ngoName, loading, signOut } = useNgoAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [startDate, setStartDate] = useState("2026-04-09");
  const [endDate, setEndDate] = useState("2026-04-16");

  // Impact stats
  const { data: impactStats } = useQuery({
    queryKey: ["ngo-impact", ngoId],
    enabled: !!ngoId,
    queryFn: async () => {
      const [campaignsRes, volunteersRes] = await Promise.all([
        supabase.from("campaigns").select("beneficiaries_served, districts, status").eq("ngo_id", ngoId!),
        supabase.from("volunteers").select("id").eq("ngo_id", ngoId!),
      ]);
      const campaigns = campaignsRes.data || [];
      const allDistricts = new Set(campaigns.flatMap((c) => c.districts || []));
      const activeCamps = campaigns.filter((c) => c.status === "ACTIVE" || c.status === "COMPLETED").length;
      const totalBeneficiaries = campaigns.reduce((s, c) => s + (c.beneficiaries_served || 0), 0);
      return {
        beneficiaries: totalBeneficiaries,
        camps: activeCamps,
        volunteers: volunteersRes.data?.length || 0,
        districts: allDistricts.size,
      };
    },
  });

  const impactCards = [
    { icon: Users, label: "Beneficiaries Served", value: impactStats?.beneficiaries?.toLocaleString("en-IN") || "0", growth: "" },
    { icon: Heart, label: "Health Camps", value: String(impactStats?.camps || 0), growth: "" },
    { icon: HandHelping, label: "Volunteers", value: String(impactStats?.volunteers || 0), growth: "" },
    { icon: MapPin, label: "Districts Covered", value: String(impactStats?.districts || 0), growth: "" },
  ];

  if (loading) {
    return (
      <Layout>
        <section className="pt-24 pb-10 flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading…</p>
        </section>
      </Layout>
    );
  }

  if (!user || !ngoId) {
    navigate("/ngo-login");
    return null;
  }

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
                <h1 className="mt-0.5 text-2xl sm:text-3xl font-semibold text-foreground">{ngoName || "Your NGO"}</h1>
                <p className="mt-1 text-sm text-muted-foreground">Community health impact management</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Showing reservations between {rangeLabel}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" className="rounded-full text-primary border-primary/40">+ New booking</Button>
                <Button variant="outline" className="rounded-full text-primary border-primary/40">Download invoice</Button>
                <ChangePasswordDialog />
                <Button className="rounded-full" onClick={signOut}>Sign out</Button>
              </div>
            </div>

            {/* Tab navigation */}
            <Card className="rounded-2xl">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {tabs.map((tab) => (
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

            {/* Community impact cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {impactCards.map((card) => (
                <Card key={card.label} className="rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <card.icon className="w-5 h-5 text-primary" />
                      {card.growth && <span className="text-xs font-semibold text-primary">{card.growth}</span>}
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-foreground">{card.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{card.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "dashboard" && (
              <DashboardTab ngoId={ngoId} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
            )}
            {activeTab === "campaigns" && <CampaignsTab ngoId={ngoId} />}
            {activeTab === "volunteers" && <VolunteersTab ngoId={ngoId} />}
            {activeTab === "reports" && <ReportsTab ngoId={ngoId} />}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default NGOPortal;
