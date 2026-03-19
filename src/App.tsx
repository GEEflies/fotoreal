import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useIsPWA } from "@/hooks/use-pwa";
import Index from "./pages/Index";
import LandingA from "./pages/LandingA";
import LandingB from "./pages/LandingB";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Install from "./pages/Install";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import References from "./pages/References";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import { UserLayout } from "./components/dashboard/UserLayout";
import DashboardProperties from "./pages/dashboard/DashboardProperties";
import DashboardNewProperty from "./pages/dashboard/DashboardNewProperty";
import DashboardPropertyDetail from "./pages/dashboard/DashboardPropertyDetail";
import DashboardCredits from "./pages/dashboard/DashboardCredits";
import DashboardProfile from "./pages/dashboard/DashboardProfile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import {
  AdminLogin,
  AdminSubmissions,
  AdminSubmissionDetail,
  AdminClients,
  AdminClientDetail,
  AdminAnalytics,
} from "./pages/admin";
import {
  OutreachLeads,
  OutreachInboxes,
  OutreachCampaigns,
  OutreachReplies,
  OutreachStats,
} from "./pages/admin/outreach";

const queryClient = new QueryClient();

function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 80);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, hash]);
  return null;
}

/** Redirects to /login when running as installed PWA */
function PWAGuard({ children }: { children: React.ReactNode }) {
  const isPWA = useIsPWA();
  if (isPWA) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToHash />
        <Routes>
          {/* Static / marketing pages — blocked in PWA mode */}
          <Route path="/" element={<PWAGuard><Index /></PWAGuard>} />
          <Route path="/pre-fotografov" element={<PWAGuard><LandingA /></PWAGuard>} />
          <Route path="/bez-fotografa" element={<PWAGuard><LandingB /></PWAGuard>} />
          <Route path="/ako-to-funguje" element={<PWAGuard><HowItWorks /></PWAGuard>} />
          <Route path="/cennik" element={<PWAGuard><Pricing /></PWAGuard>} />
          <Route path="/kontakt" element={<PWAGuard><Contact /></PWAGuard>} />
          <Route path="/funkcie" element={<PWAGuard><Features /></PWAGuard>} />
          <Route path="/referencie" element={<PWAGuard><References /></PWAGuard>} />
          <Route path="/o-nas" element={<PWAGuard><AboutUs /></PWAGuard>} />
          <Route path="/blog" element={<PWAGuard><Blog /></PWAGuard>} />

          {/* Always accessible */}
          <Route path="/platba-uspesna" element={<PaymentSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/install" element={<Install />} />

          {/* Dashboard — shared layout, sidebar stays mounted */}
          <Route path="/dashboard" element={<UserLayout />}>
            <Route index element={<DashboardProperties />} />
            <Route path="new" element={<DashboardNewProperty />} />
            <Route path="properties/:id" element={<DashboardPropertyDetail />} />
            <Route path="credits" element={<DashboardCredits />} />
            <Route path="profile" element={<DashboardProfile />} />
          </Route>

          {/* Admin — blocked in PWA mode */}
          <Route path="/admin/login" element={<PWAGuard><AdminLogin /></PWAGuard>} />
          <Route path="/admin" element={<PWAGuard><Navigate to="/admin/submissions" replace /></PWAGuard>} />
          <Route path="/admin/submissions" element={<PWAGuard><AdminSubmissions /></PWAGuard>} />
          <Route path="/admin/submissions/:id" element={<PWAGuard><AdminSubmissionDetail /></PWAGuard>} />
          <Route path="/admin/clients" element={<PWAGuard><AdminClients /></PWAGuard>} />
          <Route path="/admin/clients/:userId" element={<PWAGuard><AdminClientDetail /></PWAGuard>} />
          <Route path="/admin/analytics" element={<PWAGuard><AdminAnalytics /></PWAGuard>} />
          <Route path="/admin/outreach/leads" element={<PWAGuard><OutreachLeads /></PWAGuard>} />
          <Route path="/admin/outreach/inboxes" element={<PWAGuard><OutreachInboxes /></PWAGuard>} />
          <Route path="/admin/outreach/campaigns" element={<PWAGuard><OutreachCampaigns /></PWAGuard>} />
          <Route path="/admin/outreach/replies" element={<PWAGuard><OutreachReplies /></PWAGuard>} />
          <Route path="/admin/outreach/stats" element={<PWAGuard><OutreachStats /></PWAGuard>} />
          <Route path="/ochrana-sukromia" element={<PrivacyPolicy />} />
          <Route path="/obchodne-podmienky" element={<TermsOfService />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
