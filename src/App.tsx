import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChunkErrorBoundary } from "@/components/ChunkErrorBoundary";
import Index from "./pages/Index";
import LandingA from "./pages/LandingA";
import LandingB from "./pages/LandingB";

// Lazy-load non-landing routes — these are never needed on first visit
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const DashboardProperties = lazy(() => import("./pages/dashboard/DashboardProperties"));
const DashboardNewProperty = lazy(() => import("./pages/dashboard/DashboardNewProperty"));
const DashboardPropertyDetail = lazy(() => import("./pages/dashboard/DashboardPropertyDetail"));
const DashboardCredits = lazy(() => import("./pages/dashboard/DashboardCredits"));
const DashboardProfile = lazy(() => import("./pages/dashboard/DashboardProfile"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminSubmissions = lazy(() => import("./pages/admin/AdminSubmissions"));
const AdminSubmissionDetail = lazy(() => import("./pages/admin/AdminSubmissionDetail"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ChunkErrorBoundary>
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pre-fotografov" element={<LandingA />} />
            <Route path="/bez-fotografa" element={<LandingB />} />
            <Route path="/platba-uspesna" element={<PaymentSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<DashboardProperties />} />
            <Route path="/dashboard/new" element={<DashboardNewProperty />} />
            <Route path="/dashboard/properties/:id" element={<DashboardPropertyDetail />} />
            <Route path="/dashboard/credits" element={<DashboardCredits />} />
            <Route path="/dashboard/profile" element={<DashboardProfile />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Navigate to="/admin/submissions" replace />} />
            <Route path="/admin/submissions" element={<AdminSubmissions />} />
            <Route path="/admin/submissions/:id" element={<AdminSubmissionDetail />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </ChunkErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
