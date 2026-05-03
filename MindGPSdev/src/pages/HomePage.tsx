import { useState, type FormEvent } from "react"
import { BurnBook } from "@/components/burnbook/BurnBook"
import type { MoodEntry } from "@/types/mood"
import { CommunityPage } from "@/components/community/CommunityPage"
import MoodCheckIn from "@/pages/MoodCheckIn"
import { useAuth } from "@/context/AuthContext"
import type { UpdateJournalPayload } from "@/types/journal"
import { Pencil, Save, Trash2, X } from "@/lib/lucide-icons"
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
  { id: "home", label: "Home", icon: "🏠" },
  { id: "explore", label: "Explore", icon: "🔍" },
  { id: "journal", label: "Journal", icon: "📝" },
  { id: "community", label: "Community", icon: "👥" },
  { id: "burnbook", label: "Burn Book", icon: "🔥" },
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
type HomePageProps = {
  entries: MoodEntry[]
  onOpenExplore: () => void
  onAddEntry: (entry: MoodEntry) => void
  onEditEntry: (journalId: string, payload: UpdateJournalPayload) => Promise<void>
  onDeleteEntry: (journalId: string) => Promise<void>
}
type JournalSectionProps = {
  entries: MoodEntry[]
  onAddEntry: (entry: MoodEntry) => void
  onEditEntry: (journalId: string, payload: UpdateJournalPayload) => Promise<void>
  onDeleteEntry: (journalId: string) => Promise<void>
}

type EditDraft = {
  title: string
  feeling: string
  note: string
  influences: string[]
}

const createEditDraft = (entry: MoodEntry): EditDraft => ({
  title: entry.title ?? (entry.feeling ? `${entry.feeling} Check-In` : "Untitled Entry"),
  feeling: entry.feeling,
  note: entry.note,
  influences: entry.influences,
})

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
  // (Andy) hide the extra tab title on home so welcome back stays clean
  const showTabTitle = !isBurnBookTab && activeTab !== "home"

  const handleTabClick = (tabId: string) => {
    if (tabId === "explore") {
      onOpenExplore()
      return
    }

    setActiveTab(tabId)
  }

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

function JournalSection({
  entries,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
}: JournalSectionProps) {
  const [isWritingEntry, setIsWritingEntry] = useState(false)
  // (Andy) Keep edit/delete loading local to each journal card.
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
  const [deleteConfirmEntryId, setDeleteConfirmEntryId] = useState<string | null>(null)
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a80aa]">
            Recent Reflections
          </p>

          {entries.map((entry, index) => {
            const entryId = entry.journalId
            const isEditing = entryId !== undefined && editingEntryId === entryId
            const isConfirmingDelete =
              entryId !== undefined && deleteConfirmEntryId === entryId
            const isSaving = entryId !== undefined && savingEntryId === entryId
            const isDeleting = entryId !== undefined && deletingEntryId === entryId
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
                      {entry.createdAt}
                    </p>
                    {entry.updatedAt && entry.updatedAt !== entry.createdAt && (
                      <p className="mt-1 text-xs text-[#8a80aa]">
                        Edited {entry.updatedAt}
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
                        <span className="text-xs font-semibold uppercase tracking-wide text-[#6b6485]">
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
                          className="mt-2 w-full rounded-2xl border border-violet-200 bg-purple-50/60 px-4 py-3 text-sm text-[#2f1d69] outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold uppercase tracking-wide text-[#6b6485]">
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
                          className="mt-2 w-full rounded-2xl border border-violet-200 bg-purple-50/60 px-4 py-3 text-sm text-[#2f1d69] outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-wide text-[#6b6485]">
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
                        className="mt-2 w-full rounded-2xl border border-violet-200 bg-purple-50/60 p-3 text-sm text-[#2f1d69] outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                      />
                    </label>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#6b6485]">
                        Influences
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {influenceChoices.map((influence) => {
                          const checked = editDraft.influences.includes(influence)

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
}
