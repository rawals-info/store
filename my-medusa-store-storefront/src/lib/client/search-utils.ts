"use client"

const DEBOUNCE_TIME = 300 // milliseconds for debouncing

/**
 * Client-side helper to debounce search requests
 */
export const debounceSearch = (
  callback: (value: string) => void,
  delay: number = DEBOUNCE_TIME
) => {
  let timeoutId: NodeJS.Timeout

  return (value: string) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      callback(value)
    }, delay)
  }
} 