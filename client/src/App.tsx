import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ResumesPage from "./pages/ResumesPage";
import WorkspacePage from "./pages/WorkspacePage";
import JobTrackerPage from "./pages/JobTrackerPage";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import ProfileOnboardingPage from "./pages/ProfileOnboardingPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  const isProfileComplete = localStorage.getItem("profile_completed") === "true";
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace />;

  if (!isProfileComplete && location.pathname !== "/setup-profile") {
    return <Navigate to="/setup-profile" replace />;
  }

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
      <Route path="/setup-profile" element={<ProtectedRoute><ProfileOnboardingPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/job-tracker" element={<ProtectedRoute><JobTrackerPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => (
  <GoogleOAuthProvider clientId="795757389813-1i302cqmb2rs9q5c3vjubvo6r04f9kob.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;