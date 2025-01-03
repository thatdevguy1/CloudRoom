import { useState, useEffect } from "react";
import "./App.css";
import Header from "@/components/header/Header";
import LandingPage from "./pages/landingPage/LandingPage";
import { Routes, Route, useNavigate } from "react-router";
import Dashboard from "./pages/dashboardPage/DashboardPage";
import SilentCallback from "./components/silent-callback/SilentCallback";

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [loggedIn]);

  return (
    <>
      <Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/callback"
          element={<SilentCallback setLoggedIn={setLoggedIn} />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
