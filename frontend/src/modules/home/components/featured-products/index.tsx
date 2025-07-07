import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  return (
    <div className="featured-products">
      <ul className="list-none p-0 m-0">
        {collections.map((collection) => (
          <li key={collection.id} className="mb-12">
            <ProductRail collection={collection} region={region} />
          </li>
        ))}
      </ul>
    </div>
  )
}
