import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import MoodCheckIn from "./pages/MoodCheckIn";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import type { MoodEntry } from "@/types/mood";
import { useAuth } from "@/context/AuthContext";
// (Andy) App.tsx is only switching landing mood home and explore pages
function App() {
  const { currentUser, loading } = useAuth();
  const [page, setPage] = useState<"mood" | "home" | "explore">("home");
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

  const addMoodEntry = (entry: MoodEntry) => {
    setMoodEntries((prev) => [entry, ...prev]);
  };

  useEffect(() => {
    if (!currentUser) {
      setPage("home");
      setMoodEntries([]);
    }
  }, [currentUser]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#ede8ff] text-[#2f1d69]">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="rounded-3xl border border-violet-200 bg-white/90 px-8 py-6 text-center shadow-xl">
            <p className="text-lg font-semibold">Loading your space...</p>
            <p className="mt-2 text-sm text-[#6b6485]">
              Firebase is checking your session.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return <LandingPage />;
  }

  return page === "mood" ? (
    <MoodCheckIn
      onSave={() => setPage("home")}
      onBack={() => setPage("home")}
      onAddEntry={addMoodEntry}
    />
  ) : page === "explore" ? (
    <ExplorePage onBack={() => setPage("home")} />
  ) : (
    <HomePage
      entries={moodEntries}
      onOpenExplore={() => setPage("explore")}
      onAddEntry={addMoodEntry}
    />
  );
}

export default App;
