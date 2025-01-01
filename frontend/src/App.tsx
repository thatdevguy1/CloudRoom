import { useState } from "react";
import "./App.css";
import Header from "@/components/header/Header";
import LandingPage from "./pages/landingPage/LandingPage";

function App() {
  return (
    <>
      <Header />
      <LandingPage />
    </>
  );
}

export default App;
