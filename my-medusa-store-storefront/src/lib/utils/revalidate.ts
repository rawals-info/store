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
    // Fire and forget – any error bubbles up normally
    revalidateTag(tag)
    pending.delete(tag)
  }, delay)

  pending.set(tag, timer)
} 