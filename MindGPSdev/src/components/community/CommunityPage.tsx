import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  createCommunityPost,
  deleteCommunityPost,
  getCommunityPosts,
  toggleCommunityPostSupport,
  updateCommunityPost,
} from "@/lib/communityApi"
import type { CommunityFeeling, CommunityPost } from "@/types/community"
import type { MoodEntry } from "@/types/mood"

// (andy) This list mirrors the backend enum for community post feelings.
const feelings: CommunityFeeling[] = [
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
  // (andy) Community posts now come from the backend instead of local prototype state.
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [message, setMessage] = useState("")
  const [feeling, setFeeling] = useState<CommunityFeeling | "">("")
  const [author, setAuthor] = useState("You")
  // (andy) These fields hold the currently edited owned post.
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editMessage, setEditMessage] = useState("")
  const [editFeeling, setEditFeeling] = useState<CommunityFeeling | "">("")
  const [editAuthor, setEditAuthor] = useState("")
  // (andy) These states keep backend loading and errors visible in the existing UI.
  const [communityError, setCommunityError] = useState<string | null>(null)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [pendingPostId, setPendingPostId] = useState<string | null>(null)
  const [isPosting, setIsPosting] = useState(false)

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

  useEffect(() => {
    // (andy) Load all community posts once when this page mounts.
    const loadPosts = async () => {
      try {
        setIsLoadingPosts(true)
        setCommunityError(null)
        const savedPosts = await getCommunityPosts()

        setPosts(savedPosts)
      } catch (error) {
        console.error("Failed to load community posts:", error)
        setCommunityError("Could not load community posts. Please try again.")
      } finally {
        setIsLoadingPosts(false)
      }
    }

    loadPosts()
  }, [])

  // (andy) Convert backend timestamps into compact display text.
  const formatPostTime = (createdAt: string) =>
    new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(createdAt))

  // (andy) Replace a single post with the backend response after edits or support.
  const replacePost = (updatedPost: CommunityPost) => {
    setPosts((current) =>
      current.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    )
  }

  // (andy) Create posts only when the message has text.
  const handlePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!message.trim()) return

    try {
      setIsPosting(true)
      setCommunityError(null)
      const savedPost = await createCommunityPost({
        authorDisplayName: author.trim() || "You",
        feeling: feeling || "Reflective",
        message: message.trim(),
      })

      setPosts((current) => [savedPost, ...current])
      setMessage("")
      setFeeling("")
    } catch (error) {
      console.error("Failed to create community post:", error)
      setCommunityError("Could not post to the community. Please try again.")
    } finally {
      setIsPosting(false)
    }
  }

  // (andy) Copy the selected owned post into the edit form.
  const startEditing = (post: CommunityPost) => {
    setEditingPostId(post._id)
    setEditAuthor(post.authorDisplayName)
    setEditFeeling(post.feeling)
    setEditMessage(post.message)
  }

  // (andy) Clear edit mode without changing the saved post.
  const cancelEditing = () => {
    setEditingPostId(null)
    setEditAuthor("")
    setEditFeeling("")
    setEditMessage("")
  }

  // (andy) Save edits only for posts the backend marks as owned.
  const handleEdit = async (post: CommunityPost) => {
    if (!post.isOwner || !editMessage.trim()) return

    try {
      setPendingPostId(post._id)
      setCommunityError(null)
      const updatedPost = await updateCommunityPost(post._id, {
        authorDisplayName: editAuthor.trim() || "You",
        feeling: editFeeling || "Reflective",
        message: editMessage.trim(),
      })

      replacePost(updatedPost)
      cancelEditing()
    } catch (error) {
      console.error("Failed to update community post:", error)
      setCommunityError("Could not update that post. Please try again.")
    } finally {
      setPendingPostId(null)
    }
  }

  // (andy) Delete posts only when isOwner is true.
  const handleDelete = async (post: CommunityPost) => {
    if (!post.isOwner) return

    try {
      setPendingPostId(post._id)
      setCommunityError(null)
      await deleteCommunityPost(post._id)

      setPosts((current) => current.filter((item) => item._id !== post._id))
    } catch (error) {
      console.error("Failed to delete community post:", error)
      setCommunityError("Could not delete that post. Please try again.")
    } finally {
      setPendingPostId(null)
    }
  }

  // (andy) Support toggles use the returned post instead of guessing counts locally.
  const handleSupport = async (postId: string) => {
    try {
      setPendingPostId(postId)
      setCommunityError(null)
      const updatedPost = await toggleCommunityPostSupport(postId)

      // (andy) The backend is the source of truth for supportCount and whether this user supported the post.
      replacePost(updatedPost)
    } catch (error) {
      console.error("Failed to support community post:", error)
      setCommunityError("Could not update support for that post.")
    } finally {
      setPendingPostId(null)
    }
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
                  onChange={(event) => setFeeling(event.target.value as CommunityFeeling | "")}
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
                Community posts are shared with signed-in MindGPS members.
              </p>
              <Button type="submit" className="rounded-3xl px-5 py-3" disabled={isPosting || !message.trim()}>
                {isPosting ? "Posting..." : "Post to community"}
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {communityError && (
            <div className="rounded-3xl border border-rose-200 bg-white/95 p-4 text-sm font-medium text-rose-600 shadow-sm">
              {communityError}
            </div>
          )}

          {isLoadingPosts && (
            <div className="rounded-[2rem] border border-violet-100 bg-white/95 p-6 text-sm text-[#6b6485] shadow-sm">
              Loading community posts...
            </div>
          )}

          {posts.map((post) => (
            <article key={post._id} className="rounded-[2rem] border border-violet-100 bg-white/95 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-[#6b6485]">{formatPostTime(post.createdAt)}</p>
                  <h3 className="mt-2 text-lg font-semibold text-[#2f1d69]">{post.authorDisplayName}</h3>
                </div>
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-violet-900">
                  {post.feeling}
                </span>
              </div>

              {editingPostId === post._id ? (
                <div className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                    <label className="block">
                      <span className="text-sm font-medium text-[#2f1d69]">Feeling</span>
                      <select
                        value={editFeeling}
                        onChange={(event) => setEditFeeling(event.target.value as CommunityFeeling | "")}
                        className="mt-2 w-full rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-[#3b2f5b] outline-none transition focus:border-violet-300 focus:bg-white"
                      >
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
                        value={editAuthor}
                        onChange={(event) => setEditAuthor(event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-[#3b2f5b] outline-none transition focus:border-violet-300 focus:bg-white"
                        placeholder="Display name"
                      />
                    </label>
                  </div>
                  <textarea
                    value={editMessage}
                    onChange={(event) => setEditMessage(event.target.value)}
                    rows={4}
                    className="w-full rounded-[2rem] border border-violet-200 bg-violet-50 px-4 py-4 text-sm text-[#3b2f5b] outline-none transition focus:border-violet-300 focus:bg-white"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={() => handleEdit(post)}
                      className="rounded-3xl px-5 py-3"
                      disabled={pendingPostId === post._id || !editMessage.trim()}
                    >
                      {pendingPostId === post._id ? "Saving..." : "Save"}
                    </Button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm text-violet-900 transition hover:bg-violet-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-[#4e3a8a]">{post.message}</p>
              )}

              <div className="mt-5 flex items-center justify-between gap-3 text-sm text-[#6b6485]">
                <button
                  type="button"
                  onClick={() => handleSupport(post._id)}
                  disabled={pendingPostId === post._id}
                  className="rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-violet-900 transition hover:bg-violet-100"
                >
                  {post.supportedByCurrentUser ? "❤️ Supported" : "❤️ Support"} ({post.supportCount})
                </button>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <span>{post.supportedByCurrentUser ? "You shared some support" : "Send some support"}</span>
                  {post.isOwner && editingPostId !== post._id && (
                    <>
                      <button
                        type="button"
                        onClick={() => startEditing(post)}
                        className="rounded-full border border-violet-200 bg-white px-3 py-2 text-violet-900 transition hover:bg-violet-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(post)}
                        disabled={pendingPostId === post._id}
                        className="rounded-full border border-rose-200 bg-white px-3 py-2 text-rose-600 transition hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
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
