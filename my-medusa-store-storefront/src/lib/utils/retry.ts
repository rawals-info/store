export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  {
    retries = 3,
    minDelay = 300,
    factor = 2,
  }: { retries?: number; minDelay?: number; factor?: number } = {}
): Promise<T> {
  let attempt = 0
  let delay = minDelay

  while (true) {
    try {
      return await fn()
    } catch (err) {
      attempt += 1
      if (attempt > retries) {
        throw err
      }
      await new Promise((res) => setTimeout(res, delay))
      delay *= factor
    }
  }
}

// Promise helper that rejects if the wrapped promise does not settle within `ms` milliseconds.
export async function withTimeout<T>(promise: Promise<T>, ms = 8000, timeoutMessage = "Operation timed out"):
  Promise<T> {
  let timer: NodeJS.Timeout
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(timeoutMessage)), ms)
    }),
  ]).finally(() => clearTimeout(timer))
}
