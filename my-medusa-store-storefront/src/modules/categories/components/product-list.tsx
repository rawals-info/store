import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"

const ProductList = ({
  products,
  region,
}: {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
      {products.map((p) => {
        return <ProductPreview key={p.id} product={p} region={region} />
      })}
    </div>
  )
}

export default ProductList 