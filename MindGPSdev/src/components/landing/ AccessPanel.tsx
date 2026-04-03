export default function AccessPanel() {
  return (
    <div className="rounded-[2rem] bg-white/55 p-8 shadow-[0_18px_50px_rgba(115,90,200,0.12)] backdrop-blur-xl">
      <div className="space-y-2">
        <h2 className="text-5xl font-semibold tracking-tight text-[#2f1d69]">
          Welcome back
        </h2>
        <p className="text-lg leading-relaxed text-[#6a6385]">
          Enter the sanctuary to continue your journey.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a93b3]">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@email.com"
            className="h-14 w-full rounded-full border border-white/40 bg-white/80 px-6 text-base text-[#2f1d69] placeholder:text-[#b8b2cc] outline-none transition focus:border-[#b7a7f5]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a93b3]">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="h-14 w-full rounded-full border border-white/40 bg-white/80 px-6 text-base text-[#2f1d69] placeholder:text-[#b8b2cc] outline-none transition focus:border-[#b7a7f5]"
          />
        </div>

        <div className="flex items-center justify-between text-sm text-[#6a6385]">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded-full border border-[#cfc7ea]"
            />
            <span>Remember me</span>
          </label>

          <button className="font-medium text-[#6a4fd8] hover:opacity-80">
            Forgot password?
          </button>
        </div>

        <button className="h-14 w-full rounded-full bg-[#6f4fc3] text-lg font-semibold text-white shadow-[0_12px_30px_rgba(111,79,195,0.22)] transition hover:bg-[#6545b9]">
          Continue
        </button>
      </div>
    </div>
  );
}