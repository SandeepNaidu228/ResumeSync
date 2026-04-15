import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ResumesPage from "./pages/ResumesPage";
import WorkspacePage from "./pages/WorkspacePage";
import JobTrackerPage from "./pages/JobTrackerPage";
import AtsPage from "./pages/AtsPage";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/resumes" element={<ProtectedRoute><ResumesPage /></ProtectedRoute>} />
      <Route path="/resume/:id" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/builder" element={<ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>} />
      <Route path="/builder/:id" element={<ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>} />
      <Route path="/job-tracker" element={<ProtectedRoute><JobTrackerPage /></ProtectedRoute>} />
      <Route path="/ats" element={<ProtectedRoute><AtsPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;