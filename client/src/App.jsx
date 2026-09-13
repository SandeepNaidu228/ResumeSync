import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureSection from "./components/FeatureSection";
import PlatformStrip from "./components/PlatformStrip";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import ResumeBuilder from "./pages/ResumeBuilder";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Resumes from "./pages/Resumes";

function LandingPage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <FeatureSection />
        <PlatformStrip />
        <CTASection />
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected application */}
      <Route element={<ProtectedRoute />}>

        <Route
          path="/resumes"
          element={<Resumes />}
        />

        <Route
          path="/resumes/:id"
          element={<ResumeBuilder />}
        />

      </Route>

        {/* Temporary compatibility */}
        <Route
          path="/dashboard"
          element={
            <Navigate
              to="/resumes"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;