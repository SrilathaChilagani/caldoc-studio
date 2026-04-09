import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NgoAuthProvider } from "@/contexts/NgoAuthContext";
import { AppAuthProvider } from "@/contexts/AppAuthContext";
import Index from "./pages/Index";
import Providers from "./pages/Providers";
import BookDoctor from "./pages/BookDoctor";
import BookingConfirmation from "./pages/BookingConfirmation";
import EmergencyBooking from "./pages/EmergencyBooking";
import Pharmacy from "./pages/Pharmacy";
import Labs from "./pages/Labs";
import AppDownload from "./pages/AppDownload";
import Schedule from "./pages/Schedule";
import PatientPortal from "./pages/PatientPortal";
import ProviderPortal from "./pages/ProviderPortal";
import AdminPortal from "./pages/AdminPortal";
import NGOPortal from "./pages/NGOPortal";
import NgoLogin from "./pages/NgoLogin";
import PortalLogin from "./pages/PortalLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PharmacyPortal from "./pages/PharmacyPortal";
import LabsPortal from "./pages/LabsPortal";
import NotFound from "./pages/NotFound";
import { RoleGuard } from "./components/RoleGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppAuthProvider>
          <NgoAuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/providers" element={<Providers />} />
              <Route path="/book/:doctorSlug" element={<BookDoctor />} />
              <Route path="/booking-confirmed" element={<BookingConfirmation />} />
              <Route path="/emergency-booking" element={<EmergencyBooking />} />
              <Route path="/pharmacy" element={<Pharmacy />} />
              <Route path="/labs" element={<Labs />} />
              <Route path="/app" element={<AppDownload />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/login" element={<PortalLogin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/patient-portal" element={<RoleGuard requiredRole="patient" portalKey="patient"><PatientPortal /></RoleGuard>} />
              <Route path="/provider-portal" element={<RoleGuard requiredRole="provider" portalKey="provider"><ProviderPortal /></RoleGuard>} />
              <Route path="/admin-portal" element={<RoleGuard requiredRole="admin" portalKey="admin"><AdminPortal /></RoleGuard>} />
              <Route path="/ngo-login" element={<NgoLogin />} />
              <Route path="/ngo-portal" element={<NGOPortal />} />
              <Route path="/pharmacy-portal" element={<RoleGuard requiredRole="pharmacy" portalKey="pharmacy"><PharmacyPortal /></RoleGuard>} />
              <Route path="/labs-portal" element={<RoleGuard requiredRole="labs" portalKey="labs"><LabsPortal /></RoleGuard>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NgoAuthProvider>
        </AppAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
