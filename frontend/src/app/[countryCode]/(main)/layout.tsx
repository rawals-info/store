import { Suspense } from "react"
import LoadingSpinner from "@modules/common/components/loading-spinner"
import PageTransition from "@modules/common/components/page-transition"
import ErrorBoundary from "@modules/common/components/error-boundary"
import BannerPaddingWrapper from "./banner-padding-wrapper"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <BannerPaddingWrapper>
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
      </BannerPaddingWrapper>
    </ErrorBoundary>
  )
}

