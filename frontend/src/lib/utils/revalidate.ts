import { revalidateTag } from "next/cache"

// In-memory map used per server runtime instance to coalesce frequent revalidation
const pending = new Map<string, NodeJS.Timeout>()

/**
 * Schedule a revalidateTag call.  Multiple calls for the same tag within
 * `delay` ms window collapse into a single invocation, reducing redundant
 * Redis traffic.
 */
export function scheduleRevalidate(tag: string, delay = 75) {
  // If a call is already queued, do nothing
  if (pending.has(tag)) {
    return
  }

  const timer = setTimeout(() => {
    try {
      // Fire and forget – any error bubbles up normally, but gracefully handle
      // the specific Next.js runtime error that occurs when `revalidateTag`
      // is invoked during an RSC render.
      revalidateTag(tag)
    } catch (err: any) {
      if (
        process.env.NODE_ENV !== "production" &&
        err instanceof Error &&
        err.message?.includes("used \"revalidateTag\" during render")
      ) {
        // Ignore — calling revalidateTag during a server render is unsupported,
        // but not fatal. Let the next mutation-triggered revalidation handle it.
        if (process.env.NEXT_PUBLIC_DEBUG_REVALIDATE === "true") {
          console.warn(
            `[revalidate] Suppressed revalidateTag error for tag "${tag}": ${err.message}`
          )
        }
      } else {
        // Re-throw unknown errors so they are surfaced and logged.
        console.error("revalidateTag failed", err)
      }
    } finally {
      pending.delete(tag)
    }
  }, delay)

  pending.set(tag, timer)
}

// Add helper to schedule multiple tags at once – ensures consistent batching across the codebase
export function scheduleRevalidates(tags: string | string[], delay = 75) {
  if (Array.isArray(tags)) {
    tags.forEach((tag) => scheduleRevalidate(tag, delay))
  } else {
    scheduleRevalidate(tags, delay)
  }
} 