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
