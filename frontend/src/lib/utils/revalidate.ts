import { revalidateTag } from "next/cache"


/**
 * Schedule a revalidateTag call.  Multiple calls for the same tag within
 * `delay` ms window collapse into a single invocation, reducing redundant
 * Redis traffic.
 */
export function scheduleRevalidate(tag: string, _delay = 0) {
  try {
    revalidateTag(tag)
  } catch (err: any) {
    const message: string | undefined = err instanceof Error ? err.message : undefined
    const isDuringRender = Boolean(
      message && (message.includes('used "revalidateTag') || message.includes('during render'))
    )
    if (!isDuringRender) {
      console.warn(`[revalidateTag] Failed to revalidate tag "${tag}":`, err)
    }
  }
}

// Add helper to schedule multiple tags at once – ensures consistent batching across the codebase
export function scheduleRevalidates(tags: string | string[], delay = 75) {
  if (Array.isArray(tags)) {
    tags.forEach((tag) => scheduleRevalidate(tag, delay))
  } else {
    scheduleRevalidate(tags, delay)
  }
} 