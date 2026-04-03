import { MindButton } from "@/components/mind/MindButton";
// (Andy) landing navbar compo
export default function LandingNavbar() { // This is the landing page navbar, it will be used on the landing page and will be a simple sticky navbar with the logo and a call to action button.
  return (
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur-xl"> 
      <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-6 md:px-10 lg:px-12">
        <div className="text-2xl font-bold tracking-tight text-violet-900">
          MindGPS
        </div>

        <div className="flex items-center gap-4 md:gap-6"> 
          <button className="text-sm font-medium text-violet-700 transition-opacity hover:opacity-80"> 
            Log In
          </button>

          <MindButton className="px-8">Get Started</MindButton>
        </div>
      </nav>
    </header>
  );
}