import React, { Suspense } from "react"
import Footer from "@modules/layout/templates/footer"
import AnimatedHeader from "@modules/layout/components/animated-header"
import PrefetchProvider from "@modules/layout/components/prefetch-provider"
import { listIndiaRegions } from "@lib/constants/india-region"
import { dataFetchingConfig } from "@lib/config"

export const dynamic = 'force-dynamic'
export const revalidate = 60

// Skip static generation for account pages
// This is necessary because account pages use cookies and server-side data
// that can't be statically generated
export async function generateStaticParams() {
  // Use hardcoded India region instead of API call
  const regions = listIndiaRegions()
  const countryCodes = regions.flatMap(region => 
    region.countries?.map(country => ({
      countryCode: country.iso_2?.toLowerCase() || 'in',
    })).filter(item => item.countryCode) || []
  )

  return countryCodes
}

// This will return 404 for non-existent countries
export const dynamicParams = true

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { countryCode: string }
}) {
  return (
    <PrefetchProvider>
      <div className="relative flex flex-col min-h-screen overflow-x-hidden">
        <AnimatedHeader />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </div>
    </PrefetchProvider>
  )
} 