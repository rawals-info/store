"use client"

import { useInView } from "framer-motion"
import { useRef } from "react"

type UseScrollAnimationOptions = {
  threshold?: number | "some" | "all"
  once?: boolean
  rootMargin?: string
}

/**
 * Custom hook to detect if an element is in the viewport.
 * Useful for scroll-triggered animations.
 */
export const useScrollAnimation = (
  options: UseScrollAnimationOptions = {}
) => {
  const {
    threshold = 0.1,
    once = true,
    rootMargin = "0px 0px -50px 0px",
  } = options

  const ref = useRef<HTMLElement | null>(null)

  const isInView = useInView(ref, {
    amount: threshold,
    once,
    rootMargin,
  })

  return { ref, isInView }
}
