import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Forgot from "./pages/auth/Forgot";
import Pricing from "./pages/Pricing";
import ApiDocs from "./pages/ApiDocs";
import { AdminDashboard, DoctorDashboard, PatientDashboard } from "./pages/dashboards";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/forgot" element={<Forgot />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

const rootEl = document.getElementById("root")!;
// HMR-friendly: reuse existing root if present to avoid createRoot() warning
declare global {
  interface Window {
    __root?: any;
  }
}
if (!window.__root) {
  window.__root = createRoot(rootEl);
}
window.__root.render(<App />);
