import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import { Button } from "@/components/ui/button"
import type { MoodEntry } from "@/types/mood"

type CommunityPost = {
  id: number
  author: string
  feeling: string
  message: string
  timestamp: string
  supportCount: number
}

const initialCommunityPosts: CommunityPost[] = []

const feelings = [
  "Hopeful",    
  "Anxious",
  "Calm",
  "Overwhelmed",
  "Grateful",
  "Low",
  "Excited",
  "Reflective",
]

export function CommunityPage({ entries }: { entries: MoodEntry[] }) {
  const [posts, setPosts] = useState<CommunityPost[]>(initialCommunityPosts)
  const [message, setMessage] = useState("")
  const [feeling, setFeeling] = useState("")
  const [author, setAuthor] = useState("You")

  const totalEntries = entries.length
  const totalPosts = posts.length

  const mostCommonEmotion = useMemo(() => {
    const counts = entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.feeling] = (acc[entry.feeling] || 0) + 1
      return acc
    }, {})
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return sorted[0]?.[0] ?? "No entries yet"
  }, [entries])

  const handlePost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!message.trim()) return

    setPosts((current) => [
      {
        id: Date.now(),
        author: author || "You",
        feeling: feeling || "Reflective",
        message: message.trim(),
        timestamp: "Just now",
        supportCount: 0,
      },
      ...current,
    ])

    setMessage("")
    setFeeling("")
  }

  const handleSupport = (postId: number) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? { ...post, supportCount: post.supportCount + 1 }
          : post
      )
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
      <section className="space-y-6">
        <div className="rounded-3xl border border-violet-100 bg-white/90 p-6 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#2f1d69]">MindGPS Community</h2>
              <p className="mt-2 text-sm leading-6 text-[#6b6485]">
                Share reflections, post your feeling updates, and support one another with safe, positive responses.
              </p>
            </div>
            <div className="rounded-3xl bg-violet-50 px-4 py-3 text-sm text-violet-900 shadow-sm">
              <p className="font-semibold">Community focus</p>
              <p className="mt-1 text-[#5f4d95]">Show your feelings, get support, and grow together.</p>
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handlePost}>
            <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
              <label className="block">
                <span className="text-sm font-medium text-[#2f1d69]">Feeling</span>
                <select
                  value={feeling}
                  onChange={(event) => setFeeling(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-[#3b2f5b] outline-none transition focus:border-violet-300 focus:bg-white"
                >
                  <option value="">Choose a mood</option>
                  {feelings.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#2f1d69]">Name</span>
                <input
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-[#3b2f5b] outline-none transition focus:border-violet-300 focus:bg-white"
                  placeholder="Display name"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-[#2f1d69]">Share a reflection</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={5}
                placeholder="Write something honest, kind, or simply real..."
                className="mt-2 w-full rounded-[2rem] border border-violet-200 bg-violet-50 px-4 py-4 text-sm text-[#3b2f5b] outline-none transition focus:border-violet-300 focus:bg-white"
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#6b6485]">
                Community posts are stored locally for this prototype.
              </p>
              <Button type="submit" className="rounded-3xl px-5 py-3">
                Post to community
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="rounded-[2rem] border border-violet-100 bg-white/95 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-[#6b6485]">{post.timestamp}</p>
                  <h3 className="mt-2 text-lg font-semibold text-[#2f1d69]">{post.author}</h3>
                </div>
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-violet-900">
                  {post.feeling}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#4e3a8a]">{post.message}</p>
              <div className="mt-5 flex items-center justify-between gap-3 text-sm text-[#6b6485]">
                <button
                  type="button"
                  onClick={() => handleSupport(post.id)}
                  className="rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-violet-900 transition hover:bg-violet-100"
                >
                  ❤️ Support ({post.supportCount})
                </button>
                <span>{post.supportCount > 0 ? "You shared some support" : "Be the first to support"}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="space-y-6 rounded-3xl border border-violet-100 bg-violet-50/80 p-6 shadow-xl">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-[#6b6485]">Community dashboard</p>
          <h3 className="mt-3 text-xl font-semibold text-[#2f1d69]">Helpful stats</h3>
          <p className="mt-2 text-sm leading-6 text-[#665b87]">
            These numbers help you see how your journal practice connects to the community.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-violet-100">
            <p className="text-sm text-[#6b6485]">Total journal entries</p>
            <p className="mt-3 text-3xl font-semibold text-[#2f1d69]">{totalEntries}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-violet-100">
            <p className="text-sm text-[#6b6485]">Most common emotion</p>
            <p className="mt-3 text-3xl font-semibold text-[#2f1d69]">{mostCommonEmotion}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-violet-100">
            <p className="text-sm text-[#6b6485]">Community posts</p>
            <p className="mt-3 text-3xl font-semibold text-[#2f1d69]">{totalPosts}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-violet-100">
            <p className="text-sm text-[#6b6485]">Top community mood</p>
            <p className="mt-3 text-lg font-semibold text-[#2f1d69]">{posts[0]?.feeling ?? "Ready to share"}</p>
          </div>
        </div>
      </aside>
    </div>
  )
}
