"use client"

import React, { useEffect } from "react"
import { usePrefetch } from "@lib/util/prefetch"

/**
 * PrefetchProvider component
 * This component will start prefetching resources when mounted
 * It also provides a way to prefetch routes when hovering over links
 */
const PrefetchProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // Use the prefetch hook to load critical resources
  usePrefetch()

  // Setup link hover listeners to prefetch routes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Track which routes have been prefetched
    const prefetchedRoutes = new Set<string>()
    
    // Prefetch a route when hovering over a link
    const handleLinkHover = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const link = target.closest('a')
      
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        const route = link.getAttribute('href')
        
        if (route && !prefetchedRoutes.has(route)) {
          // Mark this route as prefetched
          prefetchedRoutes.add(route)
          
          // Create a prefetch link
          const prefetchLink = document.createElement('link')
          prefetchLink.rel = 'prefetch'
          prefetchLink.href = route
          prefetchLink.as = 'document'
          
          document.head.appendChild(prefetchLink)
        }
      }
    }
    
    // Add event listener with passive options for better performance
    document.addEventListener('mouseover', handleLinkHover, { passive: true })
    
    return () => {
      document.removeEventListener('mouseover', handleLinkHover)
    }
  }, [])
  
  return <>{children}</>
}

export default PrefetchProvider 