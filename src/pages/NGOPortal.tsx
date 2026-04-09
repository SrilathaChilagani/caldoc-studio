import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, Heart, Calendar,
  TrendingUp, MapPin, FileText, HandHeart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";

const campaigns = [
  { id: 1, name: "Rural Health Camp - Anantapur", date: "2026-04-20", beneficiaries: 350, status: "Upcoming", location: "Anantapur, AP" },
  { id: 2, name: "Free Eye Checkup Drive", date: "2026-04-12", beneficiaries: 200, status: "Active", location: "Kurnool, AP" },
  { id: 3, name: "Diabetes Screening Camp", date: "2026-03-25", beneficiaries: 480, status: "Completed", location: "Hyderabad, TS" },
  { id: 4, name: "Maternal Health Awareness", date: "2026-03-10", beneficiaries: 150, status: "Completed", location: "Warangal, TS" },
];

const volunteers = [
  { id: 1, name: "Dr. Ramesh Babu", role: "Medical Lead", camps: 12, hours: 96 },
  { id: 2, name: "Sunitha Reddy", role: "Coordinator", camps: 8, hours: 64 },
  { id: 3, name: "Venkat Rao", role: "Logistics", camps: 15, hours: 120 },
  { id: 4, name: "Lakshmi Devi", role: "Nurse", camps: 10, hours: 80 },
];

const impactStats = [
  { label: "Beneficiaries Served", value: "8,420", icon: Users, trend: "+22%" },
  { label: "Health Camps", value: "56", icon: Heart, trend: "+15%" },
  { label: "Volunteers", value: "124", icon: HandHeart, trend: "+8%" },
  { label: "Districts Covered", value: "18", icon: MapPin, trend: "+3" },
];

const NGOPortal = () => {
  const { toast } = useToast();

  return (
    <Layout>
      {/* Portal Header */}
      <section className="pt-24 pb-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">NGO Portal</h1>
              <p className="text-sm text-muted-foreground mt-1">Community health impact management</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <HandHeart className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-1 bg-muted p-1 rounded-xl">
                <TabsTrigger value="dashboard" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="campaigns" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <Calendar className="w-4 h-4" />
                  Campaigns
                </TabsTrigger>
                <TabsTrigger value="volunteers" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <Users className="w-4 h-4" />
                  Volunteers
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <FileText className="w-4 h-4" />
                  Reports
                </TabsTrigger>
              </TabsList>

              {/* Dashboard */}
              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {impactStats.map((stat) => (
                    <Card key={stat.label} className="rounded-xl">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <stat.icon className="w-5 h-5 text-primary" />
                          <span className="text-xs text-primary font-medium">{stat.trend}</span>
                        </div>
                        <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="rounded-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Upcoming Campaigns</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {campaigns.filter(c => c.status !== "Completed").map((c) => (
                      <div key={c.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium text-foreground text-sm">{c.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {c.location}
                          </p>
                        </div>
                        <Badge variant={c.status === "Active" ? "default" : "outline"}>{c.status}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Campaigns */}
              <TabsContent value="campaigns" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Health Campaigns</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage community health drives</p>
                  </div>
                  <Button className="rounded-xl gap-2">
                    <Calendar className="w-4 h-4" /> New Campaign
                  </Button>
                </div>

                <div className="grid gap-4">
                  {campaigns.map((c) => (
                    <Card key={c.id} className="rounded-xl hover:shadow-sm transition-shadow">
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{c.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="w-3.5 h-3.5" /> {c.location}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(c.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · {c.beneficiaries} beneficiaries
                            </p>
                          </div>
                          <Badge variant={c.status === "Active" ? "default" : c.status === "Upcoming" ? "outline" : "secondary"}>
                            {c.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Volunteers */}
              <TabsContent value="volunteers" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Volunteers</h2>
                    <p className="text-sm text-muted-foreground mt-1">Track volunteer contributions</p>
                  </div>
                  <Button className="rounded-xl gap-2">
                    <Users className="w-4 h-4" /> Add Volunteer
                  </Button>
                </div>

                <Card className="rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="hidden sm:table-cell">Camps</TableHead>
                        <TableHead className="hidden sm:table-cell">Hours</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {volunteers.map((v) => (
                        <TableRow key={v.id}>
                          <TableCell className="font-medium">{v.name}</TableCell>
                          <TableCell className="text-muted-foreground">{v.role}</TableCell>
                          <TableCell className="hidden sm:table-cell">{v.camps}</TableCell>
                          <TableCell className="hidden sm:table-cell">{v.hours}h</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => toast({ title: "Profile", description: `Viewing ${v.name}` })}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* Reports */}
              <TabsContent value="reports" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Impact Reports</h2>
                  <p className="text-sm text-muted-foreground mt-1">Generate and download reports</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: "Monthly Impact Report", desc: "Summary of all activities this month", period: "April 2026" },
                    { title: "Beneficiary Report", desc: "Detailed breakdown by demographics", period: "Q1 2026" },
                    { title: "Volunteer Hours Report", desc: "Total contributions and distributions", period: "Q1 2026" },
                    { title: "Financial Summary", desc: "Expenditure and fund utilisation", period: "FY 2025-26" },
                  ].map((report) => (
                    <Card key={report.title} className="rounded-xl hover:shadow-sm transition-shadow cursor-pointer" onClick={() => toast({ title: "Download", description: `Generating ${report.title}` })}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-foreground">{report.title}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">{report.desc}</p>
                          </div>
                          <Badge variant="secondary">{report.period}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default NGOPortal;
