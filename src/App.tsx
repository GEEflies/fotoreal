import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LandingA from "./pages/LandingA";
import LandingB from "./pages/LandingB";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import DashboardProperties from "./pages/dashboard/DashboardProperties";
import DashboardNewProperty from "./pages/dashboard/DashboardNewProperty";
import DashboardPropertyDetail from "./pages/dashboard/DashboardPropertyDetail";
import {
  AdminLogin,
  AdminSubmissions,
  AdminSubmissionDetail,
  AdminAnalytics,
  AdminSettings,
} from "./pages/admin";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pre-fotografov" element={<LandingA />} />
          <Route path="/bez-fotografa" element={<LandingB />} />
          <Route path="/platba-uspesna" element={<PaymentSuccess />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Navigate to="/admin/submissions" replace />} />
          <Route path="/admin/submissions" element={<AdminSubmissions />} />
          <Route path="/admin/submissions/:id" element={<AdminSubmissionDetail />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
