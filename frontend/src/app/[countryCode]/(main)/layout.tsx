"use client"

import { Suspense, useEffect, useState } from "react"
import LoadingSpinner from "@modules/common/components/loading-spinner"
import PageTransition from "@modules/common/components/page-transition"
import ErrorBoundary from "@modules/common/components/error-boundary"
import { usePathname } from "next/navigation"
import { clx } from "@medusajs/ui"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [bannerVisible, setBannerVisible] = useState(true)
  
  // Treat a pathname shaped like "/us" as home (two segments when split by "/")
  const isHomePage = pathname?.split("/").filter(Boolean).length === 1

  // Check banner visibility state
  useEffect(() => {
    if (typeof window === 'undefined') return // ✅ SSR safety
    
    const checkBannerState = () => {
      const dismissed = localStorage.getItem('promotional-banner-dismissed') === 'true'
      setBannerVisible(!dismissed)
    }
    
    checkBannerState()
    
    // Listen for storage changes (when banner is dismissed on another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'promotional-banner-dismissed') {
        checkBannerState()
      }
    }
    
    // Listen for custom event when banner is dismissed on same page
    const handleBannerDismiss = () => {
      setBannerVisible(false)
    }
    
    // Listen for custom event when banner is shown again
    const handleBannerShow = () => {
      setBannerVisible(true)
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('bannerDismissed', handleBannerDismiss)
    window.addEventListener('bannerShown', handleBannerShow)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('bannerDismissed', handleBannerDismiss)
      window.removeEventListener('bannerShown', handleBannerShow)
    }
  }, [])

  return (
    <ErrorBoundary>
      <div
        className={clx(
          isHomePage ? "w-full overflow-x-hidden" : "content-container overflow-x-hidden",
          // Add top padding for banner space (48px banner height) only when banner is visible
          {
            "pt-12": bannerVisible, // This is equivalent to 48px for the banner
            "pb-6 sm:pb-10": !isHomePage, // Only bottom padding for non-home pages
          }
        )}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
              <LoadingSpinner size="large" />
            </div>
          }
        >
          <PageTransition className="min-h-[calc(100vh-200px)]">
            {children}
          </PageTransition>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
