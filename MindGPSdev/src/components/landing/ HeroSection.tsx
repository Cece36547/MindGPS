// (Andy) this is the hero section component, it will be used on the landing page and will be a simple section with a title, description, and call to action button.)
import { Button } from "@/components/ui/button";
import AccessPanel from "../landing/ AccessPanel";

export default function HeroSection() {
  return (
    <section className="px-6 pb-20 pt-8 md:px-10 lg:px-16 lg:pb-28 lg:pt-12">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full bg-white/45 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5a49a6] shadow-sm">
            The sanctuary awaits
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-tight text-[#2f1d69] md:text-6xl lg:text-7xl">
              A calm digital
              <br />
              space to map
              <br />
              thoughts, <span className="text-[#7d69d6]">emotions,</span>
              <br />
              and reflection.
            </h1>

            <p className="max-w-2xl text-lg leading-9 text-[#5d5479]">
              Users can visually connect emotions, journal reflections, and
              explore patterns in a workspace designed to feel clear, soft, and
              intentional.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button className="h-14 rounded-full bg-[#8d72ea] px-8 text-base font-semibold text-white shadow-[0_10px_30px_rgba(141,114,234,0.28)] hover:bg-[#8165e4]">
              Get Started
            </Button>

            <Button
              variant="ghost"
              className="h-14 rounded-full bg-white/65 px-8 text-base font-semibold text-[#5f46b3] shadow-sm hover:bg-white/80"
            >
              How it Works
            </Button>
          </div>
        </div>

        <div className="relative">
          <AccessPanel />
        </div>
      </div>
    </section>
  );
}