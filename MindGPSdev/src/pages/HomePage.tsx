import { useState } from "react";
import type { MoodEntry } from "@/types/mood";
import { FindListenerPage } from "@/components/listener/FindListenerPage";

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
  "You have the power to choose your thoughts. Choose kindness for yourself."
];

const tabs = [
  { id: "explore", label: "Explore", icon: "🔍" },
  { id: "journal", label: "Journal", icon: "📝" },
  { id: "listener", label: "Find a Listener", icon: "👂" },
  { id: "community", label: "Community", icon: "👥" },
  { id: "burnbook", label: "Burn Book", icon: "🔥" }
];


type HomePageProps = {
  entries: MoodEntry[];
  onOpenExplore: () => void;
};

export default function HomePage({ entries, onOpenExplore }: HomePageProps) {
  const [activeTab, setActiveTab] = useState("journal"); // i am changing the wiring (Andy) the first page will be journal
  const [currentQuote] = useState(() =>
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  return (
    <main className="min-h-screen bg-[#ede8ff] text-[#2f1d69]">
      <div className="flex flex-col lg:flex-row min-h-screen lg:pb-0 pb-24">
        {/* Left Sidebar - Hidden on mobile, visible on lg */}
        <aside className="hidden lg:block w-full lg:w-64 bg-white/90 border-b-0 lg:border-r border-violet-200 p-4 lg:p-6 shadow-lg">
          <div className="space-y-4">
            <h2 className="text-lg lg:text-xl font-semibold text-[#2f1d69] mb-4 lg:mb-6">MindGPS</h2>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                 onClick={() => {
  if (tab.id === "explore") {
    onOpenExplore();
  } else {
    setActiveTab(tab.id);
  }
}}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                    activeTab === tab.id
                      ? "bg-violet-100 text-violet-900 border border-violet-300"
                      : "text-[#6b6485] hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="pt-6 border-t border-violet-200 space-y-3">
              <p className="text-xs text-[#6b6485] text-center">
                Your mood entries are saved in Journal
              </p>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition text-sm font-medium">
                Log Out
              </button>
            </div>
          </div>
        </aside>



        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Motivational Quote */}
            <div className="bg-white/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-violet-200 mb-6 sm:mb-8">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">💭</div>
                <blockquote className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#2f1d69] leading-relaxed mb-3 sm:mb-4">
                  "{currentQuote}"
                </blockquote>
                <p className="text-[#6b6485] text-sm sm:text-base lg:text-lg">Take a moment to breathe and reflect</p>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-violet-200">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#2f1d69] mb-4 capitalize">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h3>

              {activeTab === "journal" ? (
                <div className="space-y-3 sm:space-y-4">
                  {entries.length > 0 ? (
                    entries.map((entry, index) => (
                      <article key={`${entry.createdAt}-${index}`} className="rounded-xl sm:rounded-2xl border border-violet-100 bg-white p-3 sm:p-4 shadow-sm">
                        <p className="text-xs sm:text-sm text-[#5d5479]">{entry.createdAt}</p>
                        <p className="mt-1 text-base sm:text-lg font-semibold text-[#2f1d69]">Feeling: {entry.feeling}</p>
                        <p className="text-xs sm:text-sm text-[#6b6485]">Influences: {entry.influences.length ? entry.influences.join(", ") : "none"}</p>
                        {entry.note && <p className="mt-2 text-xs sm:text-sm text-[#4e3a8a]">{entry.note}</p>}
                      </article>
                    ))
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📝</div>
                      <p className="text-[#6b6485] text-sm sm:text-base lg:text-lg">No journal entries yet. Complete your daily check-in to get started!</p>
                    </div>
                  )}
                </div>
              ) : activeTab === "listener" ? (
                <FindListenerPage />
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
                    {tabs.find(tab => tab.id === activeTab)?.icon}
                  </div>
                  <p className="text-[#6b6485] text-sm sm:text-base lg:text-lg">
                    {activeTab === "explore" && "emotional concept map "}
                    {activeTab === "community" && "find people of similar interests"}
                    {activeTab === "burnbook" && "vent. write out frustrations and burn them away !"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tab Navigation - Fixed at bottom on mobile, hidden on lg */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 border-t border-violet-200 shadow-2xl">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "explore") {
                  onOpenExplore();
                } else {
                  setActiveTab(tab.id);
                }
              }}
              className={`flex-1 min-w-fit flex flex-col items-center gap-1 px-3 py-3 transition border-t-2 ${
                activeTab === tab.id
                  ? "bg-violet-50 text-violet-900 border-violet-300"
                  : "text-[#6b6485] border-transparent hover:bg-violet-50 hover:text-violet-700"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}