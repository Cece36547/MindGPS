import { useState } from "react"
import { BurnBook } from "@/components/burnbook/BurnBook"
import type { MoodEntry } from "@/types/mood"
import { FindListenerPage } from "@/components/listener/FindListenerPage"
import { CommunityPage } from "@/components/community/CommunityPage"
import MoodCheckIn from "@/pages/MoodCheckIn"
// (Andy) HomePage is the main dashboard for the user after they complete their mood check-in, it has a sidebar with navigation tabs and a main content area that displays a motivational quote and the content of the selected tab, the explore tab will take the user to the emotional concept map, the journal tab will show the user's mood entries, the listener tab will show the find a listener page, the community tab will show a placeholder for finding people of similar interests, and the burn book tab will show the burn book component where users can release their frustrations in a safe and private space.
const motivationalQuotes = [
  "Every day is a new beginning. Take a deep breath and start again.",
  "You are stronger than you think. You've overcome challenges before, and you will again.",
  "Your feelings are valid. Give yourself permission to feel and heal.",
  "Small steps lead to big changes. Be patient with yourself.",
  "You are not alone in this journey. Your emotions are part of what makes you human.",
  "Take care of your mind, and your mind will take care of you.",
  "It's okay to not be okay. Healing takes time and self-compassion.",
  "Your mental health matters. You deserve peace and happiness.",
  "One day at a time. Focus on today, not tomorrow's worries.",
  "You have the power to choose your thoughts. Choose kindness for yourself.",
]
// (Andy) HomePage is the main dashboard for the user after they complete their mood check-in, it has a sidebar with navigation tabs and a main content area that displays a motivational quote and the content of the selected tab, the explore tab will take the user to the emotional concept map, the journal tab will show the user's mood entries, the listener tab will show the find a listener page, the community tab will show a placeholder for finding people of similar interests, and the burn book tab will show the burn book component where users can release their frustrations in a safe and private space.
const tabs = [
  // (Andy) added home first so it shows before journal
  { id: "home", label: "Home", icon: "🏠" },
  { id: "explore", label: "Explore", icon: "🔍" },
  { id: "journal", label: "Journal", icon: "📝" },
  { id: "listener", label: "Find a Listener", icon: "👂" },
  { id: "community", label: "Community", icon: "👥" },
  { id: "burnbook", label: "Burn Book", icon: "🔥" },
]
// (Andy) the HomePage component is designed to be a calming and supportive space for users to reflect on their emotions, track their mood entries, find support through listeners and community, and release their frustrations through the burn book, the motivational quote at the top serves as a gentle reminder to take care of their mental health and practice self-compassion.
type HomePageProps = {
  entries: MoodEntry[]
  onOpenExplore: () => void
  onAddEntry: (entry: MoodEntry) => void
  onLogout: () => void
}
// (Andy) the HomePage component is designed to be a calming and supportive space for users to reflect on their emotions, track their mood entries, find support through listeners and community, and release their frustrations through the burn book, the motivational quote at the top serves as a gentle reminder to take care of their mental health and practice self-compassion.
export default function HomePage({
  entries,
  onOpenExplore,
  onAddEntry,
  onLogout,
}: HomePageProps) {
  // (Andy) start users on the dashboard after login
  const [activeTab, setActiveTab] = useState("home")
  // (Andy) tracks when someone is writing a new journal entry
  const [isWritingEntry, setIsWritingEntry] = useState(false)
  const [currentQuote] = useState(
    () =>
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  )
  const isBurnBookTab = activeTab === "burnbook"
  // (Andy) hide the extra tab title on home so welcome back stays clean
  const showTabTitle = !isBurnBookTab && activeTab !== "home"

  const handleTabClick = (tabId: string) => {
    // (Andy) leaving the form should bring the journal back to the list
    setIsWritingEntry(false)

    if (tabId === "explore") {
      onOpenExplore()
      return
    }

    setActiveTab(tabId)
  }

  // (Andy) only show the journal form after New Entry is clicked

  return (
    <main className="min-h-screen bg-[#ede8ff] text-[#2f1d69]">
      <div className="flex min-h-screen flex-col pb-24 lg:flex-row lg:pb-0">
        {/* Left Sidebar - Hidden on mobile, visible on lg */}
        <aside className="hidden w-full border-b-0 border-violet-200 bg-white/90 p-4 shadow-lg lg:block lg:w-64 lg:border-r lg:p-6">
          <div className="space-y-4">
            <h2 className="mb-4 text-lg font-semibold text-[#2f1d69] lg:mb-6 lg:text-xl">
              MindGPS
            </h2>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                    activeTab === tab.id
                      ? "border border-violet-300 bg-violet-100 text-violet-900"
                      : "text-[#6b6485] hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden font-medium sm:inline">
                    {tab.label}
                  </span>
                </button>
              ))}
            </nav>

            <div className="space-y-3 border-t border-violet-200 pt-6">
              <p className="text-center text-xs text-[#6b6485]">
                Your mood entries are saved in Journal
              </p>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100" onClick={onLogout}>
                Log Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            {/* Motivational Quote */}
            <div className="mb-6 rounded-2xl border border-violet-200 bg-white/90 p-4 shadow-xl sm:mb-8 sm:rounded-3xl sm:p-6 lg:p-8">
              <div className="text-center">
                <div className="mb-3 text-4xl sm:mb-4 sm:text-5xl lg:text-6xl">
                  💭
                </div>
                <blockquote className="mb-3 text-lg leading-relaxed font-semibold text-[#2f1d69] sm:mb-4 sm:text-xl lg:text-2xl">
                  "{currentQuote}"
                </blockquote>
                <p className="text-sm text-[#6b6485] sm:text-base lg:text-lg">
                  Take a moment to breathe and reflect
                </p>
              </div>
            </div>

            {/* Tab Content */}
            <div
              className={`rounded-2xl border border-violet-200 bg-white/90 shadow-xl sm:rounded-3xl ${
                isBurnBookTab ? "overflow-hidden" : "p-4 sm:p-6 lg:p-8"
              }`}
            >
              {showTabTitle && (
                <h3 className="mb-4 text-lg font-semibold text-[#2f1d69] capitalize sm:text-xl lg:text-2xl">
                  {tabs.find((tab) => tab.id === activeTab)?.label}
                </h3>
              )}
              {activeTab === "home" ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#2f1d69]">
                    Welcome back
                  </h2>
                  <p className="text-[#6b6485]">
                    Here&apos;s a quick look at how you&apos;ve been feeling lately.
                  </p>
                  <div className="rounded-3xl bg-[#f7f4ff] p-6">
                    <p className="text-sm text-[#6b6485]">Most recent mood</p>
                    <p className="text-lg font-semibold text-[#2f1d69]">
                      {entries.length > 0 ? entries[0].feeling : "No entries yet"}
                    </p>
                  </div>
                </div>
              ) : activeTab === "journal" ? (
  isWritingEntry ? (
    <div className="-m-4 sm:-m-6 lg:-m-8">
      <MoodCheckIn
        isInline
        backLabel="Cancel"
        onBack={() => setIsWritingEntry(false)}
        // (Andy) after saving, go back to the journal list
        onSave={() => setIsWritingEntry(false)}
        onAddEntry={onAddEntry}
      />
    </div>
  ) : (
  <section className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"> 
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-2xl font-bold text-[#2f1d69] sm:text-3xl">
            Journal
          </h3>
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700">
            {entries.length} {entries.length === 1 ? "entry" : "entries"} saved
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[#6b6485] sm:text-base">
          Reflect on your thoughts, moods, and patterns over time.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsWritingEntry(true)}
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#6d4cc2] to-[#a78bfa] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:scale-[1.02] hover:shadow-xl"
      >
        + New Entry
      </button>
    </div>

    {entries.length > 0 ? ( 
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a80aa]">
          Recent Reflections
        </p>

        {entries.map((entry, index) => (
          <article
            key={`${entry.createdAt}-${index}`}
            className="rounded-3xl bg-[#f7f4ff] p-5 shadow-sm transition hover:bg-white hover:shadow-md sm:p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-medium text-[#5d5479] sm:text-sm">
                  {entry.createdAt}
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
                {entry.feeling}
              </span>
            </div>

            {entry.note && (
              <p className="mt-5 text-base leading-relaxed text-[#2f1d69] sm:text-lg">
                “{entry.note}”
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#6b6485]">
                Influences:
              </span>

              {entry.influences.length > 0 ? (
                entry.influences.map((influence) => (
                  <span
                    key={influence}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#4e3a8a] shadow-sm"
                  >
                    {influence}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#8a80aa] shadow-sm">
                  none
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    ) : (
      <div className="rounded-3xl bg-[#f7f4ff] px-6 py-12 text-center">
        <div className="mb-4 text-4xl">📝</div>
        <h4 className="text-lg font-semibold text-[#2f1d69]">
          No journal entries yet
        </h4>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#6b6485] sm:text-base">
          Complete your daily check-in to start building your private reflection history.
        </p>
      </div>
    )}
  </section>
  )
              ) : activeTab === "listener" ? (
                <FindListenerPage />
              ) : activeTab === "community" ? (
                <CommunityPage entries={entries} />
              ) : activeTab === "burnbook" ? (
                <BurnBook />
              ) : (
                <div className="py-8 text-center sm:py-12">
                  <div className="mb-3 text-3xl sm:mb-4 sm:text-4xl">
                    {tabs.find((tab) => tab.id === activeTab)?.icon}
                  </div>
                  <p className="text-sm text-[#6b6485] sm:text-base lg:text-lg">
                    {activeTab === "explore" && "emotional concept map "}
                    {activeTab === "community" &&
                      "find people of similar interests"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tab Navigation - Fixed at bottom on mobile, hidden on lg */}
      <nav className="fixed right-0 bottom-0 left-0 border-t border-violet-200 bg-white/95 shadow-2xl lg:hidden">
        <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex min-w-fit flex-1 flex-col items-center gap-1 border-t-2 px-3 py-3 transition ${
                    activeTab === tab.id
                      ? "border-violet-300 bg-violet-50 text-violet-900"
                  : "border-transparent text-[#6b6485] hover:bg-violet-50 hover:text-violet-700"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </main>
  )
}
