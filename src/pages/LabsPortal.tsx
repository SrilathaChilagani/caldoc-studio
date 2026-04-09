import { motion } from "framer-motion";
import {
  LayoutDashboard, TestTubes, FileText, Truck,
  TrendingUp, Clock, CheckCircle, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";

const dashboardStats = [
  { label: "Tests Today", value: "156", icon: TestTubes, trend: "+10%" },
  { label: "Reports Ready", value: "89", icon: CheckCircle, trend: "+15%" },
  { label: "Pending Results", value: "42", icon: Clock, trend: "-3%" },
  { label: "Home Collections", value: "28", icon: Truck, trend: "+22%" },
];

const testOrders = [
  { id: "LAB-3201", patient: "Ravi Kumar", tests: ["CBC", "Blood Sugar"], collected: true, status: "Processing", date: "2026-04-09" },
  { id: "LAB-3200", patient: "Priya Sharma", tests: ["Thyroid Panel"], collected: true, status: "Report Ready", date: "2026-04-09" },
  { id: "LAB-3199", patient: "Suresh Reddy", tests: ["HbA1c", "Lipid Profile", "Liver Panel"], collected: false, status: "Collection Scheduled", date: "2026-04-09" },
  { id: "LAB-3198", patient: "Anitha Devi", tests: ["Vitamin D", "B12"], collected: true, status: "Report Ready", date: "2026-04-08" },
  { id: "LAB-3197", patient: "Mohan Rao", tests: ["ECG", "2D Echo"], collected: true, status: "Report Ready", date: "2026-04-08" },
];

const homeCollections = [
  { id: "HC-401", patient: "Suresh Reddy", address: "Jubilee Hills, Hyderabad", time: "9:00 AM", collector: "Venkat", status: "Scheduled" },
  { id: "HC-400", patient: "Lakshmi Devi", address: "Banjara Hills, Hyderabad", time: "10:30 AM", collector: "Pradeep", status: "In Transit" },
  { id: "HC-399", patient: "Rajesh Nair", address: "Gachibowli, Hyderabad", time: "11:00 AM", collector: "Venkat", status: "Completed" },
];

const reports = [
  { id: "RPT-5601", patient: "Priya Sharma", test: "Thyroid Panel", doctor: "Dr. Asha Menon", date: "2026-04-09", status: "Verified" },
  { id: "RPT-5600", patient: "Anitha Devi", test: "Vitamin D + B12", doctor: "Dr. Kasthuri Prasad", date: "2026-04-08", status: "Verified" },
  { id: "RPT-5599", patient: "Mohan Rao", test: "ECG + 2D Echo", doctor: "Dr. Kavya Rao", date: "2026-04-08", status: "Pending Review" },
  { id: "RPT-5598", patient: "Ravi Kumar", test: "Complete Blood Count", doctor: "Dr. Kasthuri Prasad", date: "2026-04-07", status: "Verified" },
];

const LabsPortal = () => {
  const { toast } = useToast();

  return (
    <Layout>
      <section className="pt-24 pb-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Labs Portal</h1>
              <p className="text-sm text-muted-foreground mt-1">Test management, reports & collections</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TestTubes className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-1 bg-muted p-1 rounded-xl">
                <TabsTrigger value="dashboard" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="tests" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <TestTubes className="w-4 h-4" />
                  Tests
                </TabsTrigger>
                <TabsTrigger value="collections" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <Truck className="w-4 h-4" />
                  Collections
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <FileText className="w-4 h-4" />
                  Reports
                </TabsTrigger>
              </TabsList>

              {/* Dashboard */}
              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {dashboardStats.map((stat) => (
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

                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Pending Tests</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {testOrders.filter(t => t.status !== "Report Ready").map((t) => (
                        <div key={t.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div>
                            <p className="font-medium text-foreground text-sm">{t.patient}</p>
                            <p className="text-xs text-muted-foreground">{t.tests.join(", ")}</p>
                          </div>
                          <Badge variant={t.status === "Processing" ? "default" : "outline"}>{t.status}</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Today's Collections</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {homeCollections.map((hc) => (
                        <div key={hc.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div>
                            <p className="font-medium text-foreground text-sm">{hc.patient}</p>
                            <p className="text-xs text-muted-foreground">{hc.time} · {hc.collector}</p>
                          </div>
                          <Badge variant={hc.status === "Completed" ? "secondary" : hc.status === "In Transit" ? "default" : "outline"}>
                            {hc.status}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tests */}
              <TabsContent value="tests" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Test Orders</h2>
                    <p className="text-sm text-muted-foreground mt-1">Track sample collection and processing</p>
                  </div>
                  <Button className="rounded-xl gap-2">
                    <TestTubes className="w-4 h-4" /> New Test
                  </Button>
                </div>

                <Card className="rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead className="hidden sm:table-cell">Tests</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testOrders.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium text-sm">{t.id}</TableCell>
                          <TableCell>{t.patient}</TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{t.tests.join(", ")}</TableCell>
                          <TableCell>
                            <Badge variant={t.status === "Report Ready" ? "secondary" : t.status === "Processing" ? "default" : "outline"}>
                              {t.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => toast({ title: "Details", description: `Viewing ${t.id}` })}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* Collections */}
              <TabsContent value="collections" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Home Collections</h2>
                  <p className="text-sm text-muted-foreground mt-1">Manage sample collection schedules</p>
                </div>

                <div className="grid gap-4">
                  {homeCollections.map((hc) => (
                    <Card key={hc.id} className="rounded-xl hover:shadow-sm transition-shadow">
                      <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{hc.patient}</h3>
                            <Badge variant={hc.status === "Completed" ? "secondary" : hc.status === "In Transit" ? "default" : "outline"}>
                              {hc.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{hc.address}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{hc.time} · Collector: {hc.collector}</p>
                        </div>
                        {hc.status === "Scheduled" && (
                          <Button size="sm" className="rounded-xl" onClick={() => toast({ title: "Dispatch", description: `Dispatching collector for ${hc.patient}` })}>
                            Dispatch
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Reports */}
              <TabsContent value="reports" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Test Reports</h2>
                  <p className="text-sm text-muted-foreground mt-1">Review and verify test reports</p>
                </div>

                <Card className="rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report ID</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead className="hidden sm:table-cell">Test</TableHead>
                        <TableHead className="hidden md:table-cell">Doctor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium text-sm">{r.id}</TableCell>
                          <TableCell>{r.patient}</TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground">{r.test}</TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">{r.doctor}</TableCell>
                          <TableCell>
                            <Badge variant={r.status === "Verified" ? "secondary" : "outline"}>
                              {r.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => toast({ title: "Report", description: `Viewing ${r.id}` })}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default LabsPortal;
