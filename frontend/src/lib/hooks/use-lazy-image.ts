"use client"

import { useState, useEffect, useRef } from 'react'

interface UseLazyImageOptions {
  /**
   * Root margin for the intersection observer
   */
  rootMargin?: string;
  
  /**
   * Threshold for the intersection observer
   */
  threshold?: number | number[];
  
  /**
   * Whether to disable the lazy loading
   */
  disabled?: boolean;
}

/**
 * Hook for lazy loading images using Intersection Observer
 * 
 * @param options Configuration options for the lazy loading
 * @returns An object with the ref to attach to the container and loading state
 */
export const useLazyImage = ({
  rootMargin = '200px 0px',
  threshold = 0.1,
  disabled = false,
}: UseLazyImageOptions = {}) => {
  const [isVisible, setIsVisible] = useState(disabled)
  const [isLoaded, setIsLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // If disabled, mark as visible immediately
    if (disabled) {
      setIsVisible(true)
      return
    }
    
    const element = ref.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold }
    )
    
    observer.observe(element)
    
    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [rootMargin, threshold, disabled])
  
  const handleImageLoad = () => {
    setIsLoaded(true)
  }
  
  return {
    ref,
    isVisible,
    isLoaded,
    handleImageLoad,
  }
}

export default useLazyImage 