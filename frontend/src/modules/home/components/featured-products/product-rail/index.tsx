import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"
import Link from "next/link"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="py-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-48 gold-gradient opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute right-0 bottom-0 w-64 h-64 gold-gradient opacity-10 rounded-full blur-3xl"></div>
      
      <div className="content-container relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl mb-4">
            {collection.title}
          </h2>
          <div className="h-px w-24 bg-luxury-gold mx-auto"></div>
          <p className="text-serif-regular text-luxury-charcoal/80 mt-6 max-w-lg mx-auto">
            {collection.metadata?.description || 
             "Discover our handcrafted luxury marble pieces, each one a masterpiece of precision and artistry"}
          </p>
        </div>
        
        <ul className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-x-8 gap-y-16">
          {pricedProducts &&
            pricedProducts.map((product) => (
              <li key={product.id} className="transform transition-transform duration-500 hover:-translate-y-1">
                <ProductPreview product={product} region={region} isFeatured />
              </li>
            ))}
        </ul>
        
        <div className="flex justify-center mt-16">
          <Link href={`/collections/${collection.handle}`} className="group inline-flex items-center">
            <span className="luxury-btn-outline group-hover:bg-transparent group-hover:text-luxury-gold border-2 px-8 py-4">
              View Entire Collection
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
