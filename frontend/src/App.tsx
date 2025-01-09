import { useEffect } from "react";
import "./App.css";
import Header from "@/components/header/Header";
import LandingPage from "./pages/landingPage/LandingPage";
import Pricing from "./components/pricing/Pricing";
import { Routes, Route, useNavigate } from "react-router";
import Dashboard from "./pages/dashboardPage/DashboardPage";
import SilentCallback from "./components/silent-callback/SilentCallback";
import { useAuth } from "react-oidc-context";
import Faq from "./components/faq/Faq";
import DynamicPage from "./pages/dynamicPage/DynamicPage";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [auth.isAuthenticated]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/callback" element={<SilentCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/pricing"
          element={
            <DynamicPage>
              <Pricing />
            </DynamicPage>
          }
        />
        <Route
          path="/faq"
          element={
            <DynamicPage>
              <Faq />
            </DynamicPage>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
