// (Andy) This is the landing page we are going to use this as a layout wrapper for the landing components folder
export default function LandingPage() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10 lg:px-12">
      <section className="grid min-h-[calc(100vh-4rem)] items-center gap-8 lg:grid-cols-[1.1fr_480px]">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              MindGPS
            </p>

            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              A calm digital space to map thoughts, emotions, and reflection.
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Build emotional maps, capture notes, and explore patterns in a
              workspace designed to feel clear, soft, and intentional.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
              Get Started
            </button>
            <button className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium text-foreground">
              Preview Workspace
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-md">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Welcome Back
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Sign in to MindGPS
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Continue your reflection journey.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <input
              type="email"
              placeholder="Email address"
              className="h-11 w-full rounded-xl border border-input bg-white/70 px-4 text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              className="h-11 w-full rounded-xl border border-input bg-white/70 px-4 text-sm"
            />
            <button className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
              Sign In
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}