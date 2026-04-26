// (Andy) This is the landing page layout wrapper for the landing components folder
import { useState } from "react";
import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/ HeroSection";
import FeatureGrid from "../components/landing/ FeatureGrid";
import Footer from "../components/landing/Footer";
import type { AuthMode } from "@/types/types";

export default function LandingPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("signup");

  return (
    <main className="min-h-screen bg-[#ede8ff] text-[#2f1d69]"> 
      <LandingNavbar
        onLogIn={() => setAuthMode("signin")}
        onStart={() => setAuthMode("signup")}
      />
      <HeroSection
        authMode={authMode}
        onAuthModeChange={setAuthMode}
        onStart={() => setAuthMode("signup")}
      />
      <FeatureGrid />
      <Footer />
    </main>
  );
}
// <main className="min-h-screen bg-[#ede8ff] text-[#2f1d69]">  // We are using a light purple background color with a dark purple text color to create a sense of calm and focus, we will also set the min height to screen to ensure it takes up the full viewport height.
