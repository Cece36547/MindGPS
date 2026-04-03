import { useMemo, useState } from "react";
import { MindButton } from "@/components/mind/MindButton";

const feelings = [
  { value: "calm", label: "Calm", emoji: "🧘" },
  { value: "anxious", label: "Anxious", emoji: "😟" },
  { value: "grateful", label: "Grateful", emoji: "🙏" },
  { value: "restless", label: "Restless", emoji: "😬" },
  { value: "sad", label: "Sad", emoji: "😢" },
  { value: "energetic", label: "Energetic", emoji: "⚡" },
];
const influences = [
  "homesickness",
  "social anxiety",
  "relationships",
  "physical health",
  "school/college",
  "work/career",
  "family matters",
  "diet",
  "sleep loss",
  "exercise",
];

type MoodCheckInProps = {
  onBack: () => void;
  onSave: () => void;
  onAddEntry: (entry: MoodEntry) => void;
};

type MoodEntry = {
  feeling: string;
  influences: string[];
  note: string;
  createdAt: string;
};

export default function MoodCheckIn({ onBack, onSave, onAddEntry }: MoodCheckInProps) {
  const [selectedFeeling, setSelectedFeeling] = useState("");
  const [selectedInfluences, setSelectedInfluences] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const activeLabel = selectedFeeling ? selectedFeeling : "none yet";
  const influenceText = useMemo(() => (selectedInfluences.length ? selectedInfluences.join(", ") : "none selected"), [selectedInfluences]);

  const toggleInfluence = (influence: string) => {
    setSelectedInfluences((prev) =>
      prev.includes(influence)
        ? prev.filter((item) => item !== influence)
        : [...prev, influence]
    );
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFeeling) {
      setSaved(false);
      return;
    }

    const entry: MoodEntry = {
      feeling: selectedFeeling,
      influences: selectedInfluences,
      note: note.trim(),
      createdAt: new Date().toLocaleString(),
    };

    onAddEntry(entry);
    setSaved(true);
    setNote("");
    setSelectedFeeling("");
    setSelectedInfluences([]);

    setTimeout(() => {
      setSaved(false);
      onSave();
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#ede8ff] text-[#2f1d69]">
      <div className="mx-auto max-w-3xl p-6 md:p-10">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 rounded-lg border border-violet-200 px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50"
        >
          ← Back to Landing
        </button>

        <div className="rounded-3xl border border-violet-200 bg-white/90 p-6 shadow-xl">
          <h1 className="text-3xl font-bold text-[#2f1d69]">How are you feeling?</h1>
          <p className="mt-1 text-sm text-[#5d5479]">Pick one that fits best, then write it out.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {feelings.map((feeling) => {
              const active = selectedFeeling === feeling.value;
              return (
                <button
                  key={feeling.value}
                  type="button"
                  onClick={() => setSelectedFeeling(feeling.value)}
                  className={`group rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-violet-500 bg-violet-100 text-violet-900"
                      : "border-violet-200 bg-white text-violet-700 hover:border-violet-300 hover:bg-violet-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{feeling.emoji}</span>
                    <span className="text-base font-semibold">{feeling.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSave} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4f3c97]">
                Optional: What&apos;s influencing your mood?
              </label>              <p className="mb-3 text-xs text-[#6b6485]">Pick any relevant tags.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {influences.map((item) => (
                  <label
                    key={item}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-violet-200 bg-violet-50/70 px-3 py-2 text-sm text-purple-900"
                  >
                    <input
                      type="checkbox"
                      checked={selectedInfluences.includes(item)}
                      onChange={() => toggleInfluence(item)}
                      className="h-4 w-4 accent-violet-600"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="journal" className="mb-2 block text-sm font-semibold text-[#4f3c97]">
                Write it out
              </label>
              <p className="mb-2 text-xs text-[#6b6485]">This is a private space. No one will ever see it.</p>
              <textarea
                id="journal"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Share your thoughts, feelings, and what’s happening..."
                rows={6}
                className="w-full rounded-2xl border border-violet-200 bg-purple-50/60 p-3 text-sm text-[#2f1d69] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <MindButton type="submit" className="h-12 w-full sm:w-auto px-8" fullWidth={false}>
                Save Entry
              </MindButton>
              <span className="text-sm text-[#6b6485]">
                feeling: <strong>{activeLabel}</strong> · influences: <strong>{influenceText}</strong>
              </span>
            </div>

            {saved && (
              <p className="rounded-lg bg-emerald-100 p-3 text-sm text-emerald-700">Saved! Your mood entry is now recorded.</p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
