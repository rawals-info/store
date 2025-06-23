"use client"

import { Suspense } from "react"
import LoadingSpinner from "@modules/common/components/loading-spinner"
import PageTransition from "@modules/common/components/page-transition"
import { usePathname } from "next/navigation"
import { clx } from "@medusajs/ui"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  // Treat a pathname shaped like "/us" as home (two segments when split by "/")
  const isHomePage = pathname?.split("/").filter(Boolean).length === 1

  return (
    <div
      className={clx(
        isHomePage ? "w-full overflow-x-hidden" : "content-container overflow-x-hidden",
        {
          "py-6 sm:py-10": !isHomePage,
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
  )
}
