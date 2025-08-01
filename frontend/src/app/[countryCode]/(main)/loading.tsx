"use client"

import HomepageSkeleton from "@modules/skeletons/templates/homepage-skeleton"

export default function MainLoading() {
  // This loading UI is automatically used by Next.js while the /(main) route is streaming
  return <HomepageSkeleton />
} 