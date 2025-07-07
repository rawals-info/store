// offline-cart-queue.ts
"use client"

import { fetchWithAdaptiveTimeout, retryWithBackoff } from "@lib/util/network"

export interface CartQueueJob {
  variantId: string
  quantity: number
  countryCode: string
}

const QUEUE_KEY = "_medusa_cart_job_queue"
const BATCH_WINDOW = 250 // ms window to allow batching of very rapid clicks
const MAX_BATCH_SIZE = 5

let queue: CartQueueJob[] = []
let processing = false

// Load any persisted jobs from localStorage (if available) exactly once on module init
try {
  if (typeof window !== "undefined") {
    const persisted = localStorage.getItem(QUEUE_KEY)
    if (persisted) {
      queue = JSON.parse(persisted) as CartQueueJob[]
    }
  }
} catch {
  // ignore JSON errors / SSR
}

function persistQueue() {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
    }
  } catch {
    // quota exceeded or unavailable – silently ignore
  }
}

export function enqueueCartJob(job: CartQueueJob) {
  // Merge with an existing queued job for same variant & country to avoid duplicates
  const existing = queue.find(
    (j) => j.variantId === job.variantId && j.countryCode === job.countryCode
  )
  if (existing) {
    existing.quantity += job.quantity
  } else {
    queue.push(job)
  }
  persistQueue()
  // Attempt immediate processing (debounced by BATCH_WINDOW)
  scheduleProcess(BATCH_WINDOW)
}

let scheduleHandle: ReturnType<typeof setTimeout> | null = null
function scheduleProcess(delay = 0) {
  if (scheduleHandle) return
  scheduleHandle = setTimeout(() => {
    scheduleHandle = null
    processQueue()
  }, delay)
}

async function processQueue() {
  if (processing) return
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    // Wait until we are back online
    return
  }
  if (!queue.length) return
  processing = true

  try {
    // Batch jobs by countryCode – backend supports single-item endpoint only now
    // so we send jobs sequentially, but group rapid duplicates by variantId when possible
    while (queue.length) {
      const batch = queue.splice(0, MAX_BATCH_SIZE)
      for (const job of batch) {
        const { variantId, quantity, countryCode } = job
        const body = JSON.stringify({ variantId, quantity, countryCode })
        await retryWithBackoff(() =>
          fetchWithAdaptiveTimeout("/api/cart/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Idempotency key prevents double-adds on retry
              "Idempotency-Key":
                (typeof crypto !== "undefined" && (crypto as any).randomUUID)
                  ? (crypto as any).randomUUID()
                  : `${Date.now()}-${Math.random().toString(36).substring(2)}`,
            },
            body,
          }).then((r) => (r.ok ? r : Promise.reject(r)))
        )
      }
      persistQueue()
    }
  } catch (err) {
    // If any request fails, push the current batch back so it's retried later
    if (Array.isArray(err) && err.length) {
      queue.unshift(...(err as CartQueueJob[]))
    }
    persistQueue()
  } finally {
    processing = false
  }
}

// Re-process queue when connection is restored
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    // give the network stack a tiny buffer before retrying
    scheduleProcess(500)
  })
}

// Also try processing immediately on load (after any persisted jobs were loaded)
if (typeof window !== "undefined") {
  scheduleProcess(0)
}

export function isProcessingQueue() {
  return processing
} 