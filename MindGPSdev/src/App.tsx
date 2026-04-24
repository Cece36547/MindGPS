import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import MoodCheckIn from "./pages/MoodCheckIn";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import type { MoodEntry } from "@/types/mood";
// (Andy) App.tsx is only switching landing mood home and explore pages
function App() {
  const [page, setPage] = useState<"landing" | "mood" | "home" | "explore">("landing");
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

  const addMoodEntry = (entry: MoodEntry) => {
    setMoodEntries((prev) => [entry, ...prev]);
  };

  return page === "landing" ? (
    // (Andy) send users to home first after login
    <LandingPage onStart={() => setPage("home")} />
  ) : page === "mood" ? (
    <MoodCheckIn
      onSave={() => setPage("home")}
      onBack={() => setPage("landing")}
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
