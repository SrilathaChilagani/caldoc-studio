import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, Building2, BarChart3,
  TrendingUp, Activity, Shield, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";

const platformStats = [
  { label: "Total Users", value: "12,450", icon: Users, trend: "+8.2%" },
  { label: "Active Providers", value: "342", icon: Activity, trend: "+12%" },
  { label: "Appointments Today", value: "1,247", icon: BarChart3, trend: "+5.1%" },
  { label: "Revenue (MTD)", value: "₹48.5L", icon: TrendingUp, trend: "+15.3%" },
];

const recentProviders = [
  { id: 1, name: "Dr. Meena Krishnan", specialty: "Dermatology", status: "Active", patients: 89, joined: "2026-03-01" },
  { id: 2, name: "Dr. Arun Verma", specialty: "Orthopedics", status: "Pending", patients: 0, joined: "2026-04-05" },
  { id: 3, name: "Dr. Lakshmi Nair", specialty: "Pediatrics", status: "Active", patients: 156, joined: "2026-01-15" },
  { id: 4, name: "Dr. Sanjay Gupta", specialty: "Cardiology", status: "Active", patients: 234, joined: "2025-11-20" },
  { id: 5, name: "Dr. Fatima Sheikh", specialty: "Psychiatry", status: "Suspended", patients: 45, joined: "2025-09-10" },
];

const recentUsers = [
  { id: 1, name: "Ravi Kumar", email: "ravi@email.com", appointments: 4, joined: "2026-03-10" },
  { id: 2, name: "Priya Sharma", email: "priya@email.com", appointments: 2, joined: "2026-03-22" },
  { id: 3, name: "Suresh Reddy", email: "suresh@email.com", appointments: 8, joined: "2026-01-05" },
  { id: 4, name: "Anitha Devi", email: "anitha@email.com", appointments: 6, joined: "2026-02-14" },
];

const AdminPortal = () => {
  const { toast } = useToast();

  return (
    <Layout>
      {/* Portal Header */}
      <section className="pt-24 pb-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Admin Portal</h1>
              <p className="text-sm text-muted-foreground mt-1">Platform management & analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
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
                <TabsTrigger value="providers" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <Building2 className="w-4 h-4" />
                  Providers
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <Users className="w-4 h-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Dashboard */}
              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {platformStats.map((stat) => (
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
                      <CardTitle className="text-lg">Recent Provider Signups</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {recentProviders.slice(0, 3).map((p) => (
                        <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div>
                            <p className="font-medium text-foreground text-sm">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.specialty}</p>
                          </div>
                          <Badge variant={p.status === "Active" ? "default" : p.status === "Pending" ? "outline" : "destructive"}>
                            {p.status}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Recent Patient Registrations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {recentUsers.map((u) => (
                        <div key={u.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div>
                            <p className="font-medium text-foreground text-sm">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{u.appointments} appts</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Providers */}
              <TabsContent value="providers" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Provider Management</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage doctors and healthcare providers</p>
                  </div>
                  <Button className="rounded-xl gap-2">
                    <Users className="w-4 h-4" /> Add Provider
                  </Button>
                </div>

                <Card className="rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Provider</TableHead>
                        <TableHead className="hidden sm:table-cell">Specialty</TableHead>
                        <TableHead className="hidden md:table-cell">Patients</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentProviders.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground">{p.specialty}</TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">{p.patients}</TableCell>
                          <TableCell>
                            <Badge variant={p.status === "Active" ? "default" : p.status === "Pending" ? "outline" : "destructive"}>
                              {p.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => toast({ title: "Manage", description: `Managing ${p.name}` })}>
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* Users */}
              <TabsContent value="users" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">User Management</h2>
                  <p className="text-sm text-muted-foreground mt-1">Manage patient accounts and access</p>
                </div>

                <Card className="rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead>Appointments</TableHead>
                        <TableHead className="hidden md:table-cell">Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground">{u.email}</TableCell>
                          <TableCell>{u.appointments}</TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {new Date(u.joined).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => toast({ title: "View", description: `Viewing ${u.name}` })}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* Settings */}
              <TabsContent value="settings" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Platform Settings</h2>
                  <p className="text-sm text-muted-foreground mt-1">Configure system-wide settings</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: "Payment Gateway", desc: "Configure UPI, cards, and wallet settings", icon: BarChart3 },
                    { title: "Notifications", desc: "WhatsApp, SMS, and email templates", icon: Activity },
                    { title: "Security", desc: "Access controls and audit logs", icon: Shield },
                    { title: "Integrations", desc: "Third-party service connections", icon: Settings },
                  ].map((item) => (
                    <Card key={item.title} className="rounded-xl hover:shadow-sm transition-shadow cursor-pointer" onClick={() => toast({ title: item.title, description: "Settings panel coming soon" })}>
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
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

export default AdminPortal;
