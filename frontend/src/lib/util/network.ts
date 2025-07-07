export const fetchWithAdaptiveTimeout = async (
  input: RequestInfo | URL,
  init: RequestInit & { timeoutMultiplier?: number } = {}
) => {
  const connection = (typeof navigator !== "undefined" && (navigator as any).connection) || {}
  const effectiveType: string = connection.effectiveType || "4g"
  // base timeout 15s for fast networks, 30s for slower ones
  const base = effectiveType.includes("4g") ? 15000 : 30000
  const timeout = Math.round(base * (init.timeoutMultiplier || 1))

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const resp = await fetch(input, { ...init, signal: controller.signal })
    return resp
  } finally {
    clearTimeout(id)
  }
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  {
    retries = 4,
    initialDelay = 250,
  }: { retries?: number; initialDelay?: number } = {}
): Promise<T> {
  let attempt = 0
  let delay = initialDelay
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn()
    } catch (err) {
      attempt++
      if (attempt > retries) {
        throw err
      }
      await new Promise((res) => setTimeout(res, delay))
      delay *= 2
    }
  }
} 