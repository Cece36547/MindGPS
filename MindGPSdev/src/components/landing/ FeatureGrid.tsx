import { BookOpen, Brain, ChartNoAxesColumn, Network } from "lucide-react";

const features = [
  {
    title: "Emotional Concept Maps",
    description:
      "Visualize the branching paths of your subconscious through interactive, fluid nodes and connections.",
    icon: Network,
  },
  {
    title: "Journaling / Notes",
    description:
      "A distraction-free writing experience with smart tagging and temporal reflection prompts.",
    icon: BookOpen,
  },
  {
    title: "Pattern Tracking",
    description:
      "Uncover the hidden rhythm of your mood over weeks, months, or years with elegant data visualization.",
    icon: ChartNoAxesColumn,
  },
  {
    title: "Reflection Support",
    description:
      "Create a calmer starting point for self-reflection with a layout designed to reduce noise and overwhelm.",
    icon: Brain,
  },
];

export default function FeatureGrid() {
  return (
    <section className="px-6 pb-24 pt-10 md:px-10 lg:px-16 lg:pb-32">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b3abc9]">
            Features
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-[#2f1d69] md:text-5xl">
            Built to support calm reflection, not clutter.
          </h2>
          <p className="text-lg leading-8 text-[#6b6485]">
            MindGPS gives users a soft digital environment to capture thoughts,
            explore emotions, and better understand their internal patterns.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-[2rem] bg-white/40 p-8 shadow-[0_14px_40px_rgba(120,96,190,0.08)] backdrop-blur-xl"
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#e6defd]">
                  <Icon className="h-6 w-6 text-[#6d54c7]" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold tracking-tight text-[#2f1d69]">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-8 text-[#6b6485]">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}