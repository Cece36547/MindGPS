// (Andy) this is the footer component for the landing page, it will be used on the landing page and will be a simple footer with some links and copyright information.
// the key to react is creating reusuable components one by one and putting them together to create the full page (Andy)
export default function Footer() {
  return (
    <footer className="mt-8 border-t border-white/20 px-6 py-10 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <h2 className="text-4xl font-semibold tracking-tight text-[#2f1d69]">
            MindGPS
          </h2>
          <p className="text-sm uppercase tracking-[0.2em] text-[#8f87ad]">
            © 2026 MindGPS. Breathe deep.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-[#7b7398]">
          <a href="#" className="transition hover:text-[#5f46b3]">
            Privacy Policy
          </a>
          <a href="#" className="transition hover:text-[#5f46b3]">
            Terms of Service
          </a>
          <a href="#" className="transition hover:text-[#5f46b3]">
            Contact Support
          </a>
        </nav>
      </div>
    </footer>
  );
}