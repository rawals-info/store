import { ProductCardSkeleton } from "./product-grid-skeleton"

const ProductListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="w-full" data-testid="skeleton-product-list">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export default ProductListSkeleton 