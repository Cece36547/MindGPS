import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import MoodCheckIn from "./pages/MoodCheckIn.tsx";
import HomePage from "./pages/HomePage.tsx";

type MoodEntry = {
  feeling: string;
  influences: string[];
  note: string;
  createdAt: string;
};

function App() {
  const [page, setPage] = useState<"landing" | "mood" | "home">("landing");
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

  const addMoodEntry = (entry: MoodEntry) => {
    setMoodEntries((prev) => [entry, ...prev]);
  };

  return page === "landing" ? (
    <LandingPage onStart={() => setPage("mood")} />
  ) : page === "mood" ? (
    <MoodCheckIn
      onSave={() => setPage("home")}
      onBack={() => setPage("landing")}
      onAddEntry={addMoodEntry}
    />
  ) : (
    <HomePage entries={moodEntries} />
  );
}

export default App;