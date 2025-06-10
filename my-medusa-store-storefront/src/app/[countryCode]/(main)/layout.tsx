"use client"

import { Suspense } from "react"
import PageTransition from "@modules/common/components/page-transition"
import LoadingSpinner from "@modules/common/components/loading-spinner"

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <LoadingSpinner size="large" />
        </div>
      }>
        <PageTransition className="min-h-[calc(100vh-200px)]">
          {children}
        </PageTransition>
      </Suspense>
    </>
  )
}
