"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { clx } from "@medusajs/ui"

export default function BannerPaddingWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [bannerVisible, setBannerVisible] = useState(true)

  // Treat a pathname shaped like "/in" as home
  const isHomePage = pathname?.split("/").filter(Boolean).length === 1

  // Check banner visibility state
  useEffect(() => {
    if (typeof window === "undefined") return

    const checkBannerState = () => {
      const dismissed = localStorage.getItem("promotional-banner-dismissed") === "true"
      setBannerVisible(!dismissed)
    }

    checkBannerState()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "promotional-banner-dismissed") {
        checkBannerState()
      }
    }

    const handleBannerDismiss = () => {
      setBannerVisible(false)
    }

    const handleBannerShow = () => {
      setBannerVisible(true)
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("bannerDismissed", handleBannerDismiss)
    window.addEventListener("bannerShown", handleBannerShow)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("bannerDismissed", handleBannerDismiss)
      window.removeEventListener("bannerShown", handleBannerShow)
    }
  }, [])

  return (
    <div
      className={clx("w-full overflow-x-hidden", {
        "pt-12": bannerVisible,
        "pb-6 sm:pb-10": !isHomePage,
      })}
    >
      {children}
    </div>
  )
}
