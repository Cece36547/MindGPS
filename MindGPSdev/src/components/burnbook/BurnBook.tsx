import { useCallback, useEffect, useRef, useState } from "react"
import { Flame, RotateCcw, Trash2, Wind } from "@/lib/lucide-icons"
import * as motion from "motion/react-client"
// this is the burn book component (Andy) it is a place for users to write down their frustrations and let them go by "burning" them. The text is stored in local component state and is cleared when the release completes, the page hides, or this view unmounts. It has a burning animation and a success state after the burn completes.
type BurnStatus = "idle" | "burning" | "success" // idle: user is writing, burning: burn animation is playing, success: burn completed and text is cleared

const BURN_DURATION_MS = 1500 // this is how long i set the burn animation to play

export function BurnBook() { // this is the main component function for the burn book, it manages the state and logic for the burn book feature
  const [text, setText] = useState("")
  const [status, setStatus] = useState<BurnStatus>("idle")
  const burnTimeoutRef = useRef<number | null>(null)
  const isMountedRef = useRef(false)

  const clearBurnTimeout = useCallback(() => { // (Andy) this is a helper function to clear the burn animation
    if (burnTimeoutRef.current !== null) {
      window.clearTimeout(burnTimeoutRef.current)
      burnTimeoutRef.current = null
    }
  }, [])

  const resetSession = useCallback(() => { // (Andy) this is a helper function to reset the burn book session, it clears the text and resets the status to idle
    clearBurnTimeout()

    if (!isMountedRef.current) {
      return
    }

    setText("")
    setStatus("idle")
  }, [clearBurnTimeout])

  useEffect(() => { // (Andy) this effect sets up the component when it mounts, it sets the isMountedRef to true, adds an event listener for visibility change to reset the session when the user switches tabs or minimizes the browser, and cleans up the event listener and burn timeout when the component unmounts
    isMountedRef.current = true

    const handleVisibilityChange = () => { // (Andy) this is an event listener for when the user switches tabs or minimizes the browser, it will reset the burn book session to prevent the burn animation from playing while the user is not looking at the page
      if (document.visibilityState === "hidden") {
        resetSession()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange) // (Andy) we add the event listener to the document to listen for visibility changes

    return () => {
      isMountedRef.current = false
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      clearBurnTimeout()
    }
  }, [clearBurnTimeout, resetSession])

  const handleRelease = () => { // (Andy) this is the main function that handles the release action, it checks if there is text to burn and if the burn animation is not already playing, then it starts the burn animation and sets a timeout to clear the text and show the success state after the burn duration
    if (!text.trim() || status === "burning") {
      return
    }

    clearBurnTimeout() 
    setStatus("burning")

    burnTimeoutRef.current = window.setTimeout(() => { // (Andy) this is the timeout function that runs after the burn animation duration, it clears the burn timeout reference, checks if the component is still mounted, and then clears the text and sets the status to success
      burnTimeoutRef.current = null

      if (!isMountedRef.current) {
        return
      }

      setText("")
      setStatus("success")
    }, BURN_DURATION_MS)
  }

  const handleReset = () => { // (Andy) this is a helper function to handle the reset action after the burn is complete, it simply calls the resetSession function to clear the text and reset the status
    resetSession()
  } // (Andy) the burn book component is designed to be a safe and private space for users to express their frustrations and let go of them, the burn animation provides a visual representation of the release process, and the success state gives a sense of closure and accomplishment after the burn is complete.

  return (
    <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex min-h-[520px] flex-col items-center justify-center gap-10 py-6 text-center"
        >
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.24, 0.45, 0.24] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute h-64 w-64 rounded-full bg-[#c7d2fe]/60 blur-[88px]"
            />

            <div className="relative flex h-72 w-72 flex-col items-center justify-center rounded-[48px] border border-dashed border-violet-200 bg-white/70 p-10 shadow-[0_24px_60px_-28px_rgba(79,70,229,0.45)] backdrop-blur-xl sm:h-80 sm:w-80">
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 4, -4, 0] }} // (Andy) this is the animation for the wind icon that appears in the success state, it gently moves up and down while also rotating slightly to create a sense of lightness and relief after the burn is complete
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-white/70 bg-[#eef2ff] shadow-inner"
              >
                <Wind className="h-9 w-9 text-[#4f46e5]" />
              </motion.div>

              <div className="space-y-3">
                <h3 className="text-3xl font-semibold tracking-tight text-[#2f1d69] sm:text-4xl">
                  Space Cleared.
                </h3>
                <p className="mx-auto max-w-[240px] text-sm leading-6 text-[#6b6485] sm:text-base">
                  The weight has been released. Nothing was saved, and nothing
                  remains.
                </p>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            className="inline-flex h-14 items-center gap-3 rounded-full border border-violet-200 bg-white px-8 text-sm font-semibold text-[#4e3a8a] shadow-[0_20px_40px_-24px_rgba(79,70,229,0.45)] transition hover:bg-violet-50 sm:h-16 sm:px-10 sm:text-base"
          >
            Begin New Release
            <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 lg:gap-10"
        >
          <div className="space-y-3 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#2f1d69] sm:text-4xl lg:text-5xl">
              Burn Book
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-[#6b6485] sm:text-base lg:text-lg">
              A private space to unload what is weighing on you. Your words
              stay in local component state and are cleared when the release
              completes, the page hides, or this view unmounts.
            </p>
          </div>

          <div className="relative w-full">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/75 via-[#f8f5ff]/85 to-[#ede8ff]/85 shadow-[0_32px_80px_-36px_rgba(79,70,229,0.45)] backdrop-blur-2xl" />
            <div className="absolute inset-0 rounded-[32px] border border-white/80" />

            <div className="relative flex min-h-[320px] flex-col p-6 sm:min-h-[380px] sm:p-8 lg:min-h-[420px] lg:p-10">
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                disabled={status === "burning"}
                placeholder="Type your frustrations, fears, or anything you need to let go of..."
                className={`min-h-[240px] w-full flex-1 resize-none bg-transparent text-lg leading-relaxed text-[#2f1d69] outline-none placeholder:text-[#9a8fc1] sm:text-xl lg:text-2xl ${
                  status === "burning" ? "opacity-0 blur-xl" : "opacity-100"
                } transition duration-700`}
                style={{ WebkitFontSmoothing: "antialiased" }}
              />

              {status === "burning" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-[32px] bg-white/20 backdrop-blur-sm"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.45, 0.65],
                      opacity: [0.2, 1, 0],
                      y: [0, -48, -84],
                      filter: ["blur(0px)", "blur(3px)", "blur(10px)"],
                    }}
                    transition={{
                      duration: BURN_DURATION_MS / 1000,
                      ease: "easeInOut",
                    }}
                    className="relative"
                  >
                    <Flame className="h-24 w-24 fill-orange-500/25 text-orange-500 sm:h-28 sm:w-28" />
                    <div className="absolute inset-0 rounded-full bg-orange-400/35 blur-3xl" />
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-semibold tracking-[0.35em] text-orange-700 uppercase sm:text-sm"
                  >
                    Releasing to the void...
                  </motion.p>
                </motion.div>
              ) : null}
            </div>
          </div>

          <div className="flex w-full max-w-md flex-col items-center gap-5">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRelease}
              disabled={!text.trim() || status === "burning"}
              className="group relative flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-[24px] bg-[#2f1d69] px-6 text-base font-semibold text-white shadow-[0_24px_48px_-24px_rgba(47,29,105,0.8)] transition disabled:cursor-not-allowed disabled:opacity-40 sm:h-[4.5rem] sm:text-lg"
            >
              <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-orange-400/15 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
              <Flame
                className={`h-5 w-5 ${text.trim() ? "text-orange-300" : "text-violet-300"} ${
                  text.trim() ? "animate-pulse" : ""
                }`}
              />
              <span className="relative">Release Forever</span>
            </motion.button>

            <button
              type="button"
              onClick={() => setText("")}
              disabled={!text.trim() || status === "burning"}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.28em] text-[#6b6485] uppercase transition hover:text-[#4e3a8a] disabled:pointer-events-none disabled:opacity-30"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Page
            </button>
          </div>
        </motion.div>
      )}
    </div>
  ) // (Andy) the burn book component is designed to be a safe and private space for users to express their frustrations and let go of them, the burn animation provides a visual representation of the release process, and the success state gives a sense of closure and accomplishment after the burn is complete.
}
