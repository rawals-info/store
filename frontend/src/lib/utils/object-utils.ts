/**
 * ✅ Object Utility Functions
 * Consolidated utility functions to replace lodash and avoid duplication
 * ✅ Type-safe implementations with proper TypeScript types
 */

/**
 * Deep equality check for objects
 * Native implementation to replace lodash's isEqual
 */
export function isEqual<T = unknown>(obj1: T, obj2: T): boolean {
  if (obj1 === obj2) return true
  if (!obj1 || !obj2 || typeof obj1 !== 'object' || typeof obj2 !== 'object') return false
  
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  
  if (keys1.length !== keys2.length) return false
  
  return keys1.every(key => {
    const val1 = (obj1 as Record<string, unknown>)[key]
    const val2 = (obj2 as Record<string, unknown>)[key]
    
    if (val1 === val2) return true
    if (typeof val1 === 'object' && typeof val2 === 'object') {
      return isEqual(val1, val2)
    }
    return false
  })
}

/**
 * Pick specific keys from an object
 * Native implementation to replace lodash's pick
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T, 
  keys: readonly K[]
): Pick<T, K> {
  const result: Partial<T> = {}
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }
  return result as Pick<T, K>
}

/**
 * Map object keys
 * Native implementation to replace lodash's mapKeys
 */
export function mapKeys<T extends Record<string, unknown>>(
  obj: T, 
  fn: (value: unknown, key: string) => string
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [fn(value, key), value])
  )
}

/**
 * Debounce a function
 * Useful for search, scroll, resize handlers
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function (this: any, ...args: Parameters<T>) {
    const context = this

    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

/**
 * Throttle a function
 * Limits execution rate
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

