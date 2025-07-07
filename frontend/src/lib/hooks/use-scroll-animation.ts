"use client"

import { useInView } from "framer-motion"
import { useRef } from "react"

interface UseScrollAnimationProps {
  /**
   * Once: if true, animation happens only once when element enters viewport
   * Default: true
   */
  once?: boolean
  
  /**
   * Threshold: value between 0 and 1 indicating what percentage of the element
   * must be visible to trigger the animation
   * Default: 0.2 (20%)
   */
  threshold?: number
  
  /**
   * Margin: margin around the element to consider for intersection
   * Default: "-100px 0px"
   */
  margin?: string
}

/**
 * Custom hook for scroll animations
 * Returns a ref to attach to the element and a boolean indicating if it's in view
 */
export const useScrollAnimation = ({
  once = true,
  threshold = 0.2,
  margin = "-100px 0px"
}: UseScrollAnimationProps = {}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once,
    amount: threshold,
    margin,
  })

  return { ref, isInView }
} 