import { useMemo, useState, type FormEvent } from "react"
import { BurnBook } from "@/components/burnbook/BurnBook"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { MoodEntry } from "@/types/mood"
import { CommunityPage } from "@/components/community/CommunityPage"
import MoodCheckIn from "@/pages/MoodCheckIn"
import { useAuth } from "@/context/AuthContext"
import type { UpdateJournalPayload } from "@/types/journal"
import {
  BookOpen,
  Brain,
  ChartNoAxesColumn,
  ChevronRight,
  Flame,
  Home,
  Network,
  NotebookPen,
  Pencil,
  Save,
  Search,
  Trash2,
  UsersRound,
  Wind,
  X,
} from "@/lib/lucide-icons"
// (Andy) HomePage is the main dashboard after the mood check-in, with sidebar tabs for the core MVP spaces and a main content area for the selected view.
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
// (Andy) keep the dashboard tabs focused on the MVP sections we want people using right now
const tabs = [
  // (Andy) added home first so it shows before journal
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Search },
  { id: "journal", label: "Journal", icon: NotebookPen },
  { id: "community", label: "Community", icon: UsersRound },
  { id: "burnbook", label: "Burn Book", icon: Flame },
]
const journalInfluenceOptions = [
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
]
// (Andy) the HomePage component is meant to feel calm and supportive while people move between reflection, exploration, community, and the burn book.
type HomePageProps = { // Props for the HomePage component
  entries: MoodEntry[]
  onOpenExplore: () => void
  onAddEntry: (entry: MoodEntry) => void
  onEditEntry: (
    journalId: string,
    payload: UpdateJournalPayload
  ) => Promise<void>
  onDeleteEntry: (journalId: string) => Promise<void>
}
type JournalSectionProps = { // Props for the JournalSection component
  entries: MoodEntry[]
  onAddEntry: (entry: MoodEntry) => void
  onEditEntry: (
    journalId: string,
    payload: UpdateJournalPayload
  ) => Promise<void>
  onDeleteEntry: (journalId: string) => Promise<void>
}

type EditDraft = {
  title: string
  feeling: string
  note: string
  influences: string[]
}
// (Andy) Create an edit draft from a mood entry
const createEditDraft = (entry: MoodEntry): EditDraft => ({
  title:
    entry.title ??
    (entry.feeling ? `${entry.feeling} Check-In` : "Untitled Entry"),
  feeling: entry.feeling,
  note: entry.note,
  influences: entry.influences,
})

const formatStatLabel = (value: string) =>
  value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

const formatEntryDate = (value?: string) => { // Format a date for display
  if (!value) {
    return "No reflections yet"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

const formatJournalDate = (dateString?: string) => {
  if (!dateString) {
    return ""
  }

  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  // (Andy) Formats MongoDB timestamps for a cleaner journal UI.
  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)

  return `${datePart} at ${timePart}`
}
// MindGPS does not intend to provide medical advice or replace professional help. it is tool for personal reflection and support.
const supportResources = [ // Support resources for mental health and crisis situations (Andy)
  {
    title: "988 Suicide & Crisis Lifeline",
    description:
      "Free, confidential crisis support in the U.S. Call or text 988, or visit to chat.",
    href: "https://988lifeline.org/get-help/",
    icon: Wind,
  },
  {
    title: "SAMHSA FindTreatment.gov",
    description:
      "Search for mental health and substance use treatment providers by location.",
    href: "https://findtreatment.gov/",
    icon: ChartNoAxesColumn,
  },
  {
    title: "NAMI Support Groups",
    description:
      "Find peer-led support groups and local NAMI chapters for community support.",
    href: "https://www.nami.org/support-groups/",
    icon: Network,
  },
  {
    title: "BetterHelp Online Therapy Option",
    description:
      "Compare an online therapy option when virtual counseling feels easier to start.",
    href: "https://www.betterhelp.com/online-therapy/",
    icon: Brain,
  },
]

// (Andy) the quote at the top helps keep the dashboard feeling warm without changing the layout underneath it.
export default function HomePage({
  entries,
  onOpenExplore,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
}: HomePageProps) {
  const { logOut } = useAuth()
  // (Andy) start users on the dashboard after login
  const [activeTab, setActiveTab] = useState("home")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [currentQuote] = useState(
    () =>
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  )
  const isBurnBookTab = activeTab === "burnbook"
  const isHomeTab = activeTab === "home"
  // (Andy) hide the extra tab title on home so welcome back stays clean
  const showTabTitle = !isBurnBookTab && !isHomeTab

  // (Andy) This keeps the homepage focused on quick emotional insights.
  const emotionalSnapshot = useMemo(() => {
    const latestEntry = [...entries].sort((first, second) => {
      const firstTime = Date.parse(first.createdAt)
      const secondTime = Date.parse(second.createdAt)

      return (
        (Number.isNaN(secondTime) ? 0 : secondTime) -
        (Number.isNaN(firstTime) ? 0 : firstTime)
      )
    })[0]

    const influenceCounts = entries.reduce<Record<string, number>>(
      (counts, entry) => {
        entry.influences.forEach((influence) => {
          counts[influence] = (counts[influence] ?? 0) + 1
        })

        return counts
      },
      {}
    )

    const mostCommonInfluence = Object.entries(influenceCounts).sort(
      (first, second) => second[1] - first[1]
    )[0]?.[0]

    return {
      mostRecentMood: latestEntry?.feeling
        ? formatStatLabel(latestEntry.feeling)
        : "No entries yet",
      totalEntries: entries.length.toString(),
      mostCommonInfluence: mostCommonInfluence
        ? formatStatLabel(mostCommonInfluence)
        : "No tags yet",
      lastReflectionDate: formatEntryDate(latestEntry?.createdAt),
    }
  }, [entries])

  const snapshotStats = [
    {
      label: "Most recent mood",
      value: emotionalSnapshot.mostRecentMood,
      helper:
        entries.length > 0
          ? "Latest saved check-in"
          : "Start with a mood check-in",
      icon: Brain,
    },
    {
      label: "Journal entries",
      value: emotionalSnapshot.totalEntries,
      helper:
        entries.length === 1
          ? "Private reflection saved"
          : "Private reflections saved",
      icon: BookOpen,
    },
    {
      label: "Common influence",
      value: emotionalSnapshot.mostCommonInfluence,
      helper:
        emotionalSnapshot.mostCommonInfluence === "No tags yet"
          ? "Tags appear as patterns grow"
          : "Most repeated tag",
      icon: ChartNoAxesColumn,
    },
    {
      label: "Last reflection",
      value: emotionalSnapshot.lastReflectionDate,
      helper: "Based on saved journal data",
      icon: Wind,
    },
  ]

  const handleTabClick = (tabId: string) => {
    if (tabId === "explore") {
      onOpenExplore()
      return
    }

    setActiveTab(tabId)
  }

  // (Andy) These cards help users choose where to go next without feeling lost.
  const nextStepCards = [
    {
      title: "Journal",
      description: "Write a new reflection or review what you already saved.",
      action: () => setActiveTab("journal"),
      icon: BookOpen,
    },
    {
      title: "Explore",
      description:
        "Open the concept map and connect what is influencing your mood.",
      action: onOpenExplore,
      icon: Brain,
    },
    {
      title: "Burn Book",
      description: "Let a heavy thought out, then release it from the screen.",
      action: () => setActiveTab("burnbook"),
      icon: Flame,
    },
    {
      title: "Community",
      description: "Share a supportive update and see the community space.",
      action: () => setActiveTab("community"),
      icon: Network,
    },
  ]

  // (Andy) only show the journal form after New Entry is clicked

  const handleLogOut = async () => {
    // (Andy) Firebase controls the real session now, so signing out here sends the app back to landing automatically
    try {
      setIsLoggingOut(true)
      await logOut()
    } catch (error) {
      console.error("Unable to log out right now.", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

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
              {tabs.map((tab) => {
                const Icon = tab.icon

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                      activeTab === tab.id
                        ? "border border-violet-300 bg-violet-100 text-violet-900"
                        : "text-[#6b6485] hover:bg-violet-50 hover:text-violet-700"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden font-medium sm:inline">
                      {tab.label}
                    </span>
                  </button>
                )
              })}
            </nav>

            <div className="space-y-3 border-t border-violet-200 pt-6">
              <p className="text-center text-xs text-[#6b6485]">
                Your mood entries are saved in Journal
              </p>
              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isLoggingOut}
                onClick={() => void handleLogOut()}
              >
                {isLoggingOut ? "Logging Out..." : "Log Out"}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            {/* (Andy) The hero keeps the calm quote but adds context so Home feels less empty. */}
            <section className="mb-6 overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-5 shadow-xl shadow-violet-200/60 backdrop-blur sm:mb-8 sm:rounded-3xl sm:p-7 lg:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
                <div>
                  <Badge className="mb-4 border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-violet-700 uppercase">
                    Today&apos;s pause
                  </Badge>
                  <blockquote className="text-xl leading-relaxed font-semibold text-[#2f1d69] sm:text-2xl lg:text-3xl">
                    "{currentQuote}"
                  </blockquote>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6b6485] sm:text-base">
                    Take a moment to breathe, notice what is here, and choose
                    one next step that feels manageable.
                  </p>
                </div>

                <div className="rounded-3xl border border-violet-100 bg-[#f7f4ff]/80 p-5">
                  <p className="text-xs font-semibold tracking-[0.18em] text-[#8a80aa] uppercase">
                    Gentle check-in
                  </p>
                  <div className="mt-4 space-y-3">
                    {[
                      ["Breathe", "One slow inhale before you move on."],
                      ["Reflect", "Use your saved entries to spot patterns."],
                      ["Continue", "Pick the smallest useful next step."],
                    ].map(([title, description]) => (
                      <div key={title} className="flex gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-violet-400" />
                        <div>
                          <p className="text-sm font-semibold text-[#2f1d69]">
                            {title}
                          </p>
                          <p className="text-xs leading-5 text-[#6b6485]">
                            {description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Tab Content */}
            <div
              className={
                isHomeTab
                  ? "space-y-6"
                  : `rounded-2xl border border-violet-200 bg-white/90 shadow-xl sm:rounded-3xl ${
                      isBurnBookTab ? "overflow-hidden" : "p-4 sm:p-6 lg:p-8"
                    }`
              }
            >
              {showTabTitle && (
                <h3 className="mb-4 text-lg font-semibold text-[#2f1d69] capitalize sm:text-xl lg:text-2xl">
                  {tabs.find((tab) => tab.id === activeTab)?.label}
                </h3>
              )}
              {activeTab === "home" ? (
                <div className="space-y-6">
                  {/* (Andy) This stat uses the saved journal entries instead of hardcoded data. */}
                  <section className="rounded-3xl border border-violet-200 bg-white/90 p-5 shadow-xl shadow-violet-200/50 backdrop-blur sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-[#8a80aa] uppercase">
                          Emotional snapshot
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-[#2f1d69] sm:text-3xl">
                          Welcome back
                        </h2>
                      </div>
                      <p className="max-w-md text-sm leading-6 text-[#6b6485]">
                        Here&apos;s a quick look at your recent reflections and
                        the patterns saved in Journal.
                      </p>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {snapshotStats.map((stat) => {
                        const Icon = stat.icon

                        return (
                          <Card
                            key={stat.label}
                            className="rounded-3xl border-violet-100 bg-[#f7f4ff]/80 p-5 shadow-sm transition hover:bg-white hover:shadow-md"
                          >
                            <CardContent className="p-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-sm font-medium text-[#6b6485]">
                                    {stat.label}
                                  </p>
                                  <p className="mt-2 text-2xl font-semibold text-[#2f1d69]">
                                    {stat.value}
                                  </p>
                                </div>
                                <span className="rounded-2xl bg-white p-3 text-violet-700 shadow-sm">
                                  <Icon className="h-5 w-5" />
                                </span>
                              </div>
                              <p className="mt-4 text-xs leading-5 text-[#8a80aa]">
                                {stat.helper}
                              </p>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </section>

                  {/* (Andy) These navigation cards keep the main dashboard simple and actionable. */}
                  <section className="rounded-3xl border border-violet-200 bg-white/85 p-5 shadow-xl shadow-violet-200/50 backdrop-blur sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-[#8a80aa] uppercase">
                          Choose your next step
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-[#2f1d69]">
                          What feels useful right now?
                        </h2>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {nextStepCards.map((card) => {
                        const Icon = card.icon

                        return (
                          <button
                            key={card.title}
                            type="button"
                            onClick={card.action}
                            className="group rounded-3xl border border-violet-100 bg-[#f7f4ff]/80 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-white hover:shadow-lg"
                          >
                            <span className="inline-flex rounded-2xl bg-white p-3 text-violet-700 shadow-sm">
                              <Icon className="h-5 w-5" />
                            </span>
                            <h3 className="mt-4 text-lg font-semibold text-[#2f1d69]">
                              {card.title}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-[#6b6485]">
                              {card.description}
                            </p>
                            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-violet-700">
                              Open {card.title}
                              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </section>

                  {/* (Andy) Support resources are external links, so they open in a new tab. */}
                  <section className="rounded-3xl border border-violet-200 bg-white/85 p-5 shadow-xl shadow-violet-200/50 backdrop-blur sm:p-6 lg:p-8">
                    <div className="max-w-2xl">
                      <p className="text-xs font-semibold tracking-[0.2em] text-[#8a80aa] uppercase">
                        Support beyond MindGPS
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-[#2f1d69]">
                        Extra support to keep nearby
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-[#6b6485]">
                        These are external resources, not medical advice.
                        MindGPS can support reflection, but it does not replace
                        crisis care or professional support.
                      </p>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {supportResources.map((resource) => {
                        const Icon = resource.icon

                        return (
                          <a
                            key={resource.title}
                            href={resource.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group rounded-3xl border border-violet-100 bg-[#f7f4ff]/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-white hover:shadow-lg"
                          >
                            <div className="flex items-start gap-4">
                              <span className="rounded-2xl bg-white p-3 text-violet-700 shadow-sm">
                                <Icon className="h-5 w-5" />
                              </span>
                              <div>
                                <h3 className="text-base font-semibold text-[#2f1d69]">
                                  {resource.title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-[#6b6485]">
                                  {resource.description}
                                </p>
                                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-700">
                                  Open resource
                                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                </span>
                              </div>
                            </div>
                          </a>
                        )
                      })}
                    </div>
                  </section>
                </div>
              ) : activeTab === "journal" ? (
                <JournalSection
                  entries={entries}
                  onAddEntry={onAddEntry}
                  onEditEntry={onEditEntry}
                  onDeleteEntry={onDeleteEntry}
                />
              ) : activeTab === "community" ? (
                <CommunityPage entries={entries} />
              ) : activeTab === "burnbook" ? (
                <BurnBook />
              ) : (
                <div className="py-8 text-center sm:py-12">
                  {(() => {
                    const ActiveIcon = tabs.find(
                      (tab) => tab.id === activeTab
                    )?.icon

                    return ActiveIcon ? (
                      <ActiveIcon className="mx-auto mb-3 h-8 w-8 text-violet-500 sm:mb-4" />
                    ) : null
                  })()}
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
          {tabs.map((tab) => {
            const Icon = tab.icon

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex min-w-fit flex-1 flex-col items-center gap-1 border-t-2 px-3 py-3 transition ${
                  activeTab === tab.id
                    ? "border-violet-300 bg-violet-50 text-violet-900"
                    : "border-transparent text-[#6b6485] hover:bg-violet-50 hover:text-violet-700"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </main>
  )
}

function JournalSection({
  entries,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
}: JournalSectionProps) {
  const [isWritingEntry, setIsWritingEntry] = useState(false)
  // (Andy) Keep edit/delete loading local to each journal card.
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
  const [deleteConfirmEntryId, setDeleteConfirmEntryId] = useState<
    string | null
  >(null)
  const [savingEntryId, setSavingEntryId] = useState<string | null>(null)
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<EditDraft>({
    title: "",
    feeling: "",
    note: "",
    influences: [],
  })

  const startEditing = (entry: MoodEntry) => {
    if (!entry.journalId) {
      return
    }

    setDeleteConfirmEntryId(null)
    setEditingEntryId(entry.journalId)
    setEditDraft(createEditDraft(entry))
  }

  const cancelEditing = () => {
    setEditingEntryId(null)
    setEditDraft({
      title: "",
      feeling: "",
      note: "",
      influences: [],
    })
  }

  const toggleEditInfluence = (influence: string) => {
    setEditDraft((current) => ({
      ...current,
      influences: current.influences.includes(influence)
        ? current.influences.filter((item) => item !== influence)
        : [...current.influences, influence],
    }))
  }

  const handleSaveEdit = async (
    event: FormEvent<HTMLFormElement>,
    entry: MoodEntry
  ) => {
    event.preventDefault()

    if (!entry.journalId) {
      return
    }

    const feeling = editDraft.feeling.trim() || "Reflective"
    const payload: UpdateJournalPayload = {
      title: editDraft.title.trim() || `${feeling} Check-In`,
      content: editDraft.note.trim(),
      feelings: [feeling],
      influences: editDraft.influences,
      mapId: entry.mapId ?? null,
    }

    try {
      setSavingEntryId(entry.journalId)
      await onEditEntry(entry.journalId, payload)
      cancelEditing()
    } catch {
      // (Andy) App.tsx owns the calm journal error toast, so the card stays in edit mode here.
    } finally {
      setSavingEntryId(null)
    }
  }

  const handleConfirmDelete = async (entry: MoodEntry) => {
    if (!entry.journalId) {
      return
    }

    try {
      setDeletingEntryId(entry.journalId)
      await onDeleteEntry(entry.journalId)
      setDeleteConfirmEntryId(null)

      if (editingEntryId === entry.journalId) {
        cancelEditing()
      }
    } catch {
      // (Andy) Leave the entry visible and let App.tsx show the non-blocking error.
    } finally {
      setDeletingEntryId(null)
    }
  }

  if (isWritingEntry) {
    return (
      <div className="-m-4 sm:-m-6 lg:-m-8">
        <MoodCheckIn
          isInline
          backLabel="Cancel"
          onBack={() => setIsWritingEntry(false)}
          onSave={() => setIsWritingEntry(false)}
          onAddEntry={onAddEntry}
        />
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-bold text-[#2f1d69] sm:text-3xl">
              Journal
            </h3>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold tracking-wide text-violet-700 uppercase">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}{" "}
              saved
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[#6b6485] sm:text-base">
            Reflect on your thoughts, moods, and patterns over time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            cancelEditing()
            setDeleteConfirmEntryId(null)
            setIsWritingEntry(true)
          }}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#6d4cc2] to-[#a78bfa] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:scale-[1.02] hover:shadow-xl"
        >
          + New Entry
        </button>
      </div>

      {entries.length > 0 ? (
        <div className="space-y-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#8a80aa] uppercase">
            Recent Reflections
          </p>

          {entries.map((entry, index) => {
            const entryId = entry.journalId
            const isEditing =
              entryId !== undefined && editingEntryId === entryId
            const isConfirmingDelete =
              entryId !== undefined && deleteConfirmEntryId === entryId
            const isSaving = entryId !== undefined && savingEntryId === entryId
            const isDeleting =
              entryId !== undefined && deletingEntryId === entryId
            const influenceChoices = Array.from(
              new Set([...journalInfluenceOptions, ...editDraft.influences])
            )

            return (
              <article
                key={entryId ?? `${entry.createdAt}-${index}`}
                className="rounded-3xl border border-violet-100 bg-[#f7f4ff]/95 p-5 shadow-sm transition hover:bg-white hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium text-[#5d5479] sm:text-sm">
                      {formatJournalDate(entry.createdAt)}
                    </p>
                    {entry.updatedAt && entry.updatedAt !== entry.createdAt && (
                      <p className="mt-1 text-xs text-[#8a80aa]">
                        Edited {formatJournalDate(entry.updatedAt)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
                      {entry.feeling}
                    </span>
                    <button
                      type="button"
                      onClick={() => startEditing(entry)}
                      disabled={!entryId || isSaving || isDeleting}
                      className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!entryId) return
                        setEditingEntryId(null)
                        setDeleteConfirmEntryId(entryId)
                      }}
                      disabled={!entryId || isSaving || isDeleting}
                      className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/80 px-3 py-1.5 text-xs font-semibold text-rose-600 shadow-sm transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <form
                    className="mt-5 space-y-4 rounded-3xl border border-violet-100 bg-white/85 p-4 shadow-inner"
                    onSubmit={(event) => void handleSaveEdit(event, entry)}
                  >
                    <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                      <label className="block">
                        <span className="text-xs font-semibold tracking-wide text-[#6b6485] uppercase">
                          Title
                        </span>
                        <input
                          value={editDraft.title}
                          onChange={(event) =>
                            setEditDraft((current) => ({
                              ...current,
                              title: event.target.value,
                            }))
                          }
                          className="mt-2 w-full rounded-2xl border border-violet-200 bg-purple-50/60 px-4 py-3 text-sm text-[#2f1d69] transition outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold tracking-wide text-[#6b6485] uppercase">
                          Feeling
                        </span>
                        <input
                          value={editDraft.feeling}
                          onChange={(event) =>
                            setEditDraft((current) => ({
                              ...current,
                              feeling: event.target.value,
                            }))
                          }
                          className="mt-2 w-full rounded-2xl border border-violet-200 bg-purple-50/60 px-4 py-3 text-sm text-[#2f1d69] transition outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="text-xs font-semibold tracking-wide text-[#6b6485] uppercase">
                        Reflection
                      </span>
                      <textarea
                        value={editDraft.note}
                        onChange={(event) =>
                          setEditDraft((current) => ({
                            ...current,
                            note: event.target.value,
                          }))
                        }
                        rows={5}
                        className="mt-2 w-full rounded-2xl border border-violet-200 bg-purple-50/60 p-3 text-sm text-[#2f1d69] transition outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                      />
                    </label>

                    <div>
                      <p className="text-xs font-semibold tracking-wide text-[#6b6485] uppercase">
                        Influences
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {influenceChoices.map((influence) => {
                          const checked =
                            editDraft.influences.includes(influence)

                          return (
                            <button
                              key={influence}
                              type="button"
                              onClick={() => toggleEditInfluence(influence)}
                              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                checked
                                  ? "border-violet-300 bg-violet-100 text-violet-800"
                                  : "border-violet-100 bg-white text-[#6b6485] hover:bg-violet-50"
                              }`}
                            >
                              {influence}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <Save className="h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {entry.note && (
                      <p className="mt-5 text-base leading-relaxed text-[#2f1d69] sm:text-lg">
                        "{entry.note}"
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold tracking-wide text-[#6b6485] uppercase">
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
                  </>
                )}

                {isConfirmingDelete && (
                  <div className="mt-5 rounded-3xl border border-rose-100 bg-white/90 p-4 shadow-inner">
                    <p className="text-sm font-semibold text-[#2f1d69]">
                      Delete this journal entry?
                    </p>
                    <p className="mt-1 text-sm text-[#6b6485]">
                      This cannot be undone.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmEntryId(null)}
                        disabled={isDeleting}
                        className="rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleConfirmDelete(entry)}
                        disabled={isDeleting}
                        className="rounded-full border border-rose-200 bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isDeleting ? "Deleting..." : "Delete Entry"}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      ) : (
        <div className="rounded-3xl bg-[#f7f4ff] px-6 py-12 text-center">
          <NotebookPen className="mx-auto mb-4 h-10 w-10 text-violet-500" />
          <h4 className="text-lg font-semibold text-[#2f1d69]">
            No journal entries yet
          </h4>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#6b6485] sm:text-base">
            Complete your daily check in to start building your private
            reflection history.
          </p>
        </div>
      )}
    </section>
  )
}
