"use client"

import React from "react"

/**
 * PrefetchProvider component
 * Next.js App Router handles Link prefetching automatically.
 */
const PrefetchProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return <>{children}</>
}

export default PrefetchProvider 