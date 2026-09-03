"use client"

import { HttpTypes } from "@medusajs/types"
import ProofBar from "./proof-bar"
import Bestsellers from "./bestsellers"
import CategoryStrip from "./category-strip"
import WhyUs from "./why-us"
import Process from "./process"
import Reviews from "./reviews"
import GiftingBanner from "./gifting-banner"
import Newsletter from "./newsletter"

type HomeClientWrapperProps = {
  featuredProducts: any[]
  categories: any[]
  region: HttpTypes.StoreRegion | null
  countryCode: string
}

export default function HomeClientWrapper({
  featuredProducts,
  categories,
  region,
  countryCode,
}: HomeClientWrapperProps) {
  return (
    <div className="w-full overflow-hidden bg-[#FAF8F5]">
      {/* 2. Social proof stats bar */}
      <ProofBar />

      {/* 3. Main Products Catalog (Centerpiece with filter tabs & instant Add to Cart) */}
      <Bestsellers products={featuredProducts} countryCode={countryCode} region={region} />

      {/* 4. Curated Collections & Story Chips */}
      <CategoryStrip categories={categories} countryCode={countryCode} />

      {/* 5. Why Choose Us editorial rows */}
      <WhyUs />

      {/* 6. Purity & Craft 4-step process */}
      <Process />

      {/* 7. Verified Customer reviews */}
      <Reviews />

      {/* 8. Festive & Corporate Gifting banner */}
      <GiftingBanner countryCode={countryCode} />

      {/* 9. Newsletter & Instant Contact */}
      <Newsletter />
    </div>
  )
}