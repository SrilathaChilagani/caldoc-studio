import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NgoAuthProvider } from "@/contexts/NgoAuthContext";
import Index from "./pages/Index";
import Providers from "./pages/Providers";
import BookDoctor from "./pages/BookDoctor";
import BookingConfirmation from "./pages/BookingConfirmation";
import Pharmacy from "./pages/Pharmacy";
import Labs from "./pages/Labs";
import AppDownload from "./pages/AppDownload";
import Schedule from "./pages/Schedule";
import PatientPortal from "./pages/PatientPortal";
import ProviderPortal from "./pages/ProviderPortal";
import AdminPortal from "./pages/AdminPortal";
import NGOPortal from "./pages/NGOPortal";
import NgoLogin from "./pages/NgoLogin";
import PharmacyPortal from "./pages/PharmacyPortal";
import LabsPortal from "./pages/LabsPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NgoAuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/book/:doctorSlug" element={<BookDoctor />} />
            <Route path="/booking-confirmed" element={<BookingConfirmation />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/app" element={<AppDownload />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/patient-portal" element={<PatientPortal />} />
            <Route path="/provider-portal" element={<ProviderPortal />} />
            <Route path="/admin-portal" element={<AdminPortal />} />
            <Route path="/ngo-login" element={<NgoLogin />} />
            <Route path="/ngo-portal" element={<NGOPortal />} />
            <Route path="/pharmacy-portal" element={<PharmacyPortal />} />
            <Route path="/labs-portal" element={<LabsPortal />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </NgoAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
