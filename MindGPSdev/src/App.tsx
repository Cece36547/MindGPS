import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import MoodCheckIn from "./pages/MoodCheckIn";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import type { MoodEntry } from "@/types/mood";
import type { JournalEntry } from "@/types/journal";
import { createJournal, getJournals } from "@/lib/journalApi";
import { useAuth } from "@/context/AuthContext";

// (Andy) App.tsx is only switching landing mood home and explore pages
function App() {
  const { currentUser, loading } = useAuth();
  const [page, setPage] = useState<"mood" | "home" | "explore">("home");
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalLoading, setJournalLoading] = useState(false);
  const [journalError, setJournalError] = useState<string | null>(null);

  const journalToMoodEntry = (journal: JournalEntry): MoodEntry => {
    return {
      feeling: journal.feelings?.[0] ?? "Reflective",
      influences: journal.influences ?? [],
      note: journal.content,
      createdAt: journal.createdAt,
    };
  };

  const addMoodEntry = async (entry: MoodEntry) => {
    try {
      setJournalError(null);
      // i am integrating MongoDB here, so instead of just adding the entry to the local state, I will save it to MongoDB first and then update the state with the saved version 
      // andy: Save the entry to MongoDB first, then update the UI with the saved version.
      const savedJournal = await createJournal({
        title: entry.feeling ? `${entry.feeling} Check-In` : "Untitled Entry",
        content: entry.note,
        feelings: [entry.feeling],
        influences: entry.influences,
        mapId: null,
      });

      setMoodEntries((prev) => [journalToMoodEntry(savedJournal), ...prev]);
    } catch (error) {
      console.error("Failed to save journal entry:", error);
      setJournalError("Could not save your journal entry. Please try again.");
    }
  };

  useEffect(() => {
    if (!currentUser) {
      setPage("home");
      setMoodEntries([]);
      setJournalError(null);
      return;
    }

    const loadJournalEntries = async () => {
      try {
        setJournalLoading(true);
        setJournalError(null);

        // andy: When the user logs in, load their saved journal entries from MongoDB.
        const journals = await getJournals();

        setMoodEntries(journals.map(journalToMoodEntry));
      } catch (error) {
        console.error("Failed to load journal entries:", error);
        setJournalError("Could not load your saved journal entries.");
      } finally {
        setJournalLoading(false);
      }
    };

    loadJournalEntries();
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

  if (journalLoading) {
    return (
      <main className="min-h-screen bg-[#ede8ff] text-[#2f1d69]">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="rounded-3xl border border-violet-200 bg-white/90 px-8 py-6 text-center shadow-xl">
            <p className="text-lg font-semibold">Loading your journal...</p>
            <p className="mt-2 text-sm text-[#6b6485]">
              MindGPS is syncing your saved entries.
            </p>
          </div>
        </div>
      </main>
    );
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