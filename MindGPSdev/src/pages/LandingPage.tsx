// (Andy) This is the landing page layout wrapper for the landing components folder
import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/ HeroSection";
import FeatureGrid from "../components/landing/ FeatureGrid";
import Footer from "../components/landing/Footer";

export default function LandingPage() { // the main compoennt for the landing page, it will be a simple wrapper that includes the navbar, hero section, and feature grid components.
  return (
    <main className="min-h-screen bg-[#ede8ff] text-[#2f1d69]"> 
      <LandingNavbar />
      <HeroSection />
      <FeatureGrid />
      <Footer />
    </main>
  );
}
// <main className="min-h-screen bg-[#ede8ff] text-[#2f1d69]">  // We are using a light purple background color with a dark purple text color to create a sense of calm and focus, we will also set the min height to screen to ensure it takes up the full viewport height.