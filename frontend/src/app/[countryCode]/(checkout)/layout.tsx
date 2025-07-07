"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Main content */}
      <div className="w-full bg-[#f9f6f2] relative">
        <div className="relative" data-testid="checkout-container">{children}</div>
      </div>
    </>
  )
}
