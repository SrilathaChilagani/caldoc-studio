import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingCart, FileText,
  TrendingUp, AlertTriangle, Truck, Pill
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";

const dashboardStats = [
  { label: "Today's Orders", value: "84", icon: ShoppingCart, trend: "+12%" },
  { label: "Revenue Today", value: "₹1.2L", icon: TrendingUp, trend: "+8%" },
  { label: "Pending Dispatch", value: "23", icon: Truck, trend: "-5%" },
  { label: "Low Stock Items", value: "7", icon: AlertTriangle, trend: "" },
];

const orders = [
  { id: "ORD-4521", patient: "Ravi Kumar", items: 3, total: 450, status: "Processing", date: "2026-04-09" },
  { id: "ORD-4520", patient: "Priya Sharma", items: 1, total: 180, status: "Dispatched", date: "2026-04-09" },
  { id: "ORD-4519", patient: "Suresh Reddy", items: 5, total: 1250, status: "Delivered", date: "2026-04-08" },
  { id: "ORD-4518", patient: "Anitha Devi", items: 2, total: 320, status: "Processing", date: "2026-04-08" },
  { id: "ORD-4517", patient: "Mohan Rao", items: 4, total: 890, status: "Delivered", date: "2026-04-07" },
];

const inventory = [
  { id: 1, name: "Dolo 650mg", category: "Pain Relief", stock: 450, reorder: 100, price: "₹30", status: "In Stock" },
  { id: 2, name: "Crocin Advance", category: "Fever", stock: 280, reorder: 100, price: "₹25", status: "In Stock" },
  { id: 3, name: "Shelcal 500mg", category: "Calcium", stock: 45, reorder: 50, price: "₹180", status: "Low Stock" },
  { id: 4, name: "Pan-D Capsule", category: "Digestive", stock: 12, reorder: 50, price: "₹95", status: "Low Stock" },
  { id: 5, name: "Cetirizine 10mg", category: "Allergy", stock: 320, reorder: 100, price: "₹15", status: "In Stock" },
  { id: 6, name: "Metformin 500mg", category: "Diabetes", stock: 8, reorder: 100, price: "₹45", status: "Critical" },
];

const prescriptions = [
  { id: "RX-891", patient: "Ravi Kumar", doctor: "Dr. Kasthuri Prasad", items: 3, date: "2026-04-09", status: "Pending" },
  { id: "RX-890", patient: "Suresh Reddy", doctor: "Dr. Asha Menon", items: 2, date: "2026-04-08", status: "Fulfilled" },
  { id: "RX-889", patient: "Priya Sharma", doctor: "Dr. Kavya Rao", items: 4, date: "2026-04-08", status: "Pending" },
];

const PharmacyPortal = () => {
  const { toast } = useToast();

  return (
    <Layout>
      <section className="pt-24 pb-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Pharmacy Portal</h1>
              <p className="text-sm text-muted-foreground mt-1">Inventory, orders & prescriptions</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Pill className="w-5 h-5 text-primary" />
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
                <TabsTrigger value="orders" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <ShoppingCart className="w-4 h-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <Package className="w-4 h-4" />
                  Inventory
                </TabsTrigger>
                <TabsTrigger value="prescriptions" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <FileText className="w-4 h-4" />
                  Rx
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
                          {stat.trend && <span className="text-xs text-primary font-medium">{stat.trend}</span>}
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
                      <CardTitle className="text-lg">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {orders.slice(0, 3).map((o) => (
                        <div key={o.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div>
                            <p className="font-medium text-foreground text-sm">{o.id} — {o.patient}</p>
                            <p className="text-xs text-muted-foreground">{o.items} items · ₹{o.total}</p>
                          </div>
                          <Badge variant={o.status === "Processing" ? "outline" : o.status === "Dispatched" ? "default" : "secondary"}>
                            {o.status}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" /> Low Stock Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {inventory.filter(i => i.status !== "In Stock").map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div>
                            <p className="font-medium text-foreground text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.stock} left · Reorder at {item.reorder}</p>
                          </div>
                          <Badge variant={item.status === "Critical" ? "destructive" : "outline"}>
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Orders */}
              <TabsContent value="orders" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Order Management</h2>
                  <p className="text-sm text-muted-foreground mt-1">Track and fulfill medicine orders</p>
                </div>

                <Card className="rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead className="hidden sm:table-cell">Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="font-medium text-sm">{o.id}</TableCell>
                          <TableCell>{o.patient}</TableCell>
                          <TableCell className="hidden sm:table-cell">{o.items}</TableCell>
                          <TableCell>₹{o.total}</TableCell>
                          <TableCell>
                            <Badge variant={o.status === "Processing" ? "outline" : o.status === "Dispatched" ? "default" : "secondary"}>
                              {o.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => toast({ title: "Order Details", description: `Viewing ${o.id}` })}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* Inventory */}
              <TabsContent value="inventory" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Inventory</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage stock levels</p>
                  </div>
                  <Button className="rounded-xl gap-2">
                    <Package className="w-4 h-4" /> Add Stock
                  </Button>
                </div>

                <Card className="rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medicine</TableHead>
                        <TableHead className="hidden sm:table-cell">Category</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="hidden md:table-cell">Price</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground">{item.category}</TableCell>
                          <TableCell>{item.stock}</TableCell>
                          <TableCell className="hidden md:table-cell">{item.price}</TableCell>
                          <TableCell>
                            <Badge variant={item.status === "In Stock" ? "secondary" : item.status === "Critical" ? "destructive" : "outline"}>
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* Prescriptions */}
              <TabsContent value="prescriptions" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Prescriptions</h2>
                  <p className="text-sm text-muted-foreground mt-1">Review and fulfill prescriptions</p>
                </div>

                <div className="grid gap-4">
                  {prescriptions.map((rx) => (
                    <Card key={rx.id} className="rounded-xl hover:shadow-sm transition-shadow">
                      <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{rx.id}</h3>
                            <Badge variant={rx.status === "Pending" ? "outline" : "secondary"}>{rx.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {rx.patient} · Prescribed by {rx.doctor}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {rx.items} items · {new Date(rx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </p>
                        </div>
                        {rx.status === "Pending" && (
                          <Button size="sm" className="rounded-xl" onClick={() => toast({ title: "Fulfilling", description: `Processing ${rx.id}` })}>
                            Fulfill
                          </Button>
                        )}
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

export default PharmacyPortal;
