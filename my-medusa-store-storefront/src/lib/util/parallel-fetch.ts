"use server"

/**
 * Default timeout for fetch operations in milliseconds (3 seconds)
 */
const DEFAULT_TIMEOUT = 3000;

/**
 * @typedef {Object} ParallelFetchOptions
 * @property {number} [timeout] - Timeout in milliseconds
 * @property {boolean} [suppressErrors] - Whether to suppress error logs
 * @property {number} [retries] - Number of retries for failed fetches
 * @property {number} [retryDelay] - Delay between retries in milliseconds
 */
interface ParallelFetchOptions {
  timeout?: number;
  suppressErrors?: boolean;
  retries?: number;
  retryDelay?: number;
}

/**
 * Fetch data in parallel with timeout and error handling
 * @param fetchers Array of functions that return promises
 * @param options Optional configuration
 * @returns Array of results in the same order as the input functions
 */
export async function parallelFetch<T extends any[]>(
  fetchers: Array<() => Promise<any>>,
  options?: ParallelFetchOptions
): Promise<T> {
  const {
    timeout = DEFAULT_TIMEOUT,
    suppressErrors = false,
    retries = 1,
    retryDelay = 300
  } = options || {};

  // Create a promise for each fetcher, wrapped with error handling
  const promises = fetchers.map(async (fetcher, index) => {
    try {
      return await fetchWithRetry(
        () => fetchWithTimeout(fetcher, timeout),
        retries,
        retryDelay
      );
    } catch (error) {
      // Only log errors if not suppressed
      if (!suppressErrors) {
        // Log a cleaner error without the full stack trace
        console.error(`Error in parallel fetch #${index}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      return null;
    }
  });

  // Wait for all promises to resolve
  return Promise.all(promises) as Promise<T>;
}

/**
 * Fetch with timeout
 * @param fetcher Function that returns a promise
 * @param ms Timeout in milliseconds
 * @returns Promise that resolves with the result or rejects with a timeout error
 */
export async function fetchWithTimeout<T>(
  fetcher: () => Promise<T>,
  ms: number = DEFAULT_TIMEOUT
): Promise<T> {
  // Create an abort controller for the timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  
  try {
    // If the fetcher supports AbortController, pass the signal
    const result = await Promise.race([
      typeof fetcher === 'function' && fetcher.length > 0
        ? (fetcher as any)(controller.signal)
        : fetcher(),
      new Promise<never>((_, reject) => {
        const onAbort = () => {
          reject(new Error(`Request timed out after ${ms}ms`));
        };
        
        controller.signal.addEventListener('abort', onAbort);
      })
    ]);
    
    clearTimeout(timeoutId);
    return result as T;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Fetch with retry
 * @param fetcher Function that returns a promise
 * @param retries Number of retries
 * @param delay Delay between retries in milliseconds
 * @returns Promise that resolves with the result or rejects after all retries fail
 */
export async function fetchWithRetry<T>(
  fetcher: () => Promise<T>,
  retries: number = 3,
  delay: number = 300
): Promise<T> {
  try {
    return await fetcher();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    // Wait for the specified delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry with one less retry remaining
    return fetchWithRetry(fetcher, retries - 1, delay);
  }
} 