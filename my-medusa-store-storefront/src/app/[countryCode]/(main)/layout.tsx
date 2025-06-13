"use client"

import { Suspense } from "react"
import LoadingSpinner from "@modules/common/components/loading-spinner"
import PageTransition from "@modules/common/components/page-transition"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="content-container py-6 sm:py-10 overflow-x-hidden">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <LoadingSpinner size="large" />
        </div>
      }>
        <PageTransition className="min-h-[calc(100vh-200px)]">
          {children}
        </PageTransition>
      </Suspense>
    </div>
  )
}
