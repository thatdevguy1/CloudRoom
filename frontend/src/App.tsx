import { useState } from "react";
import "./App.css";
import Header from "@/components/header/Header";
import LandingPage from "./pages/landingPage/LandingPage";
import { Routes, Route } from "react-router";
import Dashboard from "./pages/dashboardPage/DashboardPage";
import SilentCallback from "./components/silent-callback/SilentCallback";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/callback" element={<SilentCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
