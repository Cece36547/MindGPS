import { ArrowLeft } from "@/lib/lucide-icons";
import { MindMapCanvas } from "@/components/explore/MindMapCanvas";

type ExplorePageProps = {
  onBack: () => void;
};

export default function ExplorePage({ onBack }: ExplorePageProps) {
  return (
    <main className="relative h-screen overflow-hidden bg-[#ede8ff] text-[#2f1d69]">
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex items-center justify-between border-b border-violet-200 bg-white/70 px-6 py-4 backdrop-blur-md">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <h1 className="text-lg font-semibold text-[#2f1d69]">
            Explore Your Concept Map
          </h1>

          <div className="w-[72px]" />
        </header>

        <section className="relative flex-1 min-h-0 overflow-hidden">
          <MindMapCanvas />
        </section>
      </div>
    </main>
  );
}
