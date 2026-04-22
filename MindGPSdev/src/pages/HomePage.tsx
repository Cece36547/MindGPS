import { useState } from "react"
import { BurnBook } from "@/components/burnbook/BurnBook"
import type { MoodEntry } from "@/types/mood"
import { FindListenerPage } from "@/components/listener/FindListenerPage"
import { CommunityPage } from "@/components/community/CommunityPage"
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
}
// (Andy) the HomePage component is designed to be a calming and supportive space for users to reflect on their emotions, track their mood entries, find support through listeners and community, and release their frustrations through the burn book, the motivational quote at the top serves as a gentle reminder to take care of their mental health and practice self-compassion.
export default function HomePage({ entries, onOpenExplore }: HomePageProps) {
  const [activeTab, setActiveTab] = useState("journal") // i am changing the wiring (Andy) the first page will be journal
  const [currentQuote] = useState(
    () =>
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  )
  const isBurnBookTab = activeTab === "burnbook"

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
                  onClick={() => {
                    if (tab.id === "explore") {
                      onOpenExplore()
                    } else {
                      setActiveTab(tab.id)
                    }
                  }}
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
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100">
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
              {!isBurnBookTab && (
                <h3 className="mb-4 text-lg font-semibold text-[#2f1d69] capitalize sm:text-xl lg:text-2xl">
                  {tabs.find((tab) => tab.id === activeTab)?.label}
                </h3>
              )}

              {activeTab === "journal" ? (
                <div className="space-y-3 sm:space-y-4">
                  {entries.length > 0 ? (
                    entries.map((entry, index) => (
                      <article
                        key={`${entry.createdAt}-${index}`}
                        className="rounded-xl border border-violet-100 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4"
                      >
                        <p className="text-xs text-[#5d5479] sm:text-sm">
                          {entry.createdAt}
                        </p>
                        <p className="mt-1 text-base font-semibold text-[#2f1d69] sm:text-lg">
                          Feeling: {entry.feeling}
                        </p>
                        <p className="text-xs text-[#6b6485] sm:text-sm">
                          Influences:{" "}
                          {entry.influences.length
                            ? entry.influences.join(", ")
                            : "none"}
                        </p>
                        {entry.note && (
                          <p className="mt-2 text-xs text-[#4e3a8a] sm:text-sm">
                            {entry.note}
                          </p>
                        )}
                      </article>
                    ))
                  ) : (
                    <div className="py-8 text-center sm:py-12">
                      <div className="mb-3 text-3xl sm:mb-4 sm:text-4xl">
                        📝
                      </div>
                      <p className="text-sm text-[#6b6485] sm:text-base lg:text-lg">
                        No journal entries yet. Complete your daily check-in to
                        get started!
                      </p>
                    </div>
                  )}
                </div>
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
              onClick={() => {
                if (tab.id === "explore") {
                  onOpenExplore()
                } else {
                  setActiveTab(tab.id)
                }
              }}
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
