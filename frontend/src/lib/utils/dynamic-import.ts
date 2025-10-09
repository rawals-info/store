/**
 * ✅ Code Splitting Utilities
 * Helper functions for dynamic imports to reduce initial bundle size
 */

import dynamic from "next/dynamic"
import React, { ComponentType } from "react"

/**
 * Create a dynamically imported component with loading state
 * @param importFn - Function that imports the component
 * @param loadingComponent - Optional loading component to show while loading
 */
export function lazyLoad<T = any>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  loadingComponent?: ComponentType,
  ssr: boolean = true
) {
  return dynamic(importFn, {
    loading: loadingComponent ? () => React.createElement(loadingComponent) : undefined,
    ssr, // Configurable SSR - use false only in client components
  })
}

/**
 * Create a dynamically imported component that's only loaded when visible
 * Use only in client components
 */
export function lazyLoadOnVisible<T = any>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  ssr: boolean = false
) {
  return dynamic(importFn, {
    ssr, // Default false for lazy loading, but configurable
  })
}

export default lazyLoad

