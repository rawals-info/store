import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import ProductPreviewRating from "./rating-client"

export default function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region?: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const isLimitedEdition = product.tags?.some(
    (tag) =>
      tag.value?.toLowerCase().includes("limited") ||
      tag.value?.toLowerCase().includes("edition")
  )

  const productHandle = product.handle || `product-${product.id}`
  const countryCode = region?.countries?.[0]?.iso_2 || "us"

  return (
    <Link
      href={`/${countryCode}/products/${productHandle}`}
      className="group block relative luxury-image-hover"
      aria-label={`View ${product.title}`}
    >
      <div
        data-testid="product-wrapper"
        className="overflow-hidden rounded-sm border border-luxury-gold/10 bg-luxury-ivory/10 transition-all duration-300 group-hover:shadow-md group-hover:border-luxury-gold/30 group-hover:-translate-y-1"
      >
        <div className="relative">
          <div
            className="w-full overflow-hidden relative"
            style={{ height: "260px" }}
          >
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={isFeatured}
              className="transition-transform duration-700 group-hover:scale-110 object-cover w-full h-full"
            />
          </div>

          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(to bottom, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.3))",
            }}
          ></div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 transform translate-y-4 group-hover:translate-y-0">
            <span className="bg-luxury-ivory/95 border border-luxury-gold px-4 py-2 text-luxury-charcoal text-[10px] uppercase tracking-wider hover:bg-luxury-gold hover:text-luxury-ivory transition-colors duration-300 shadow-sm">
              Quick View
            </span>
          </div>

          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {isLimitedEdition && (
              <div className="badge-container">
                <span className="bg-luxury-gold/90 px-2 py-1 text-luxury-ivory text-[9px] uppercase tracking-wider font-medium flex items-center">
                  <svg
                    className="w-2.5 h-2.5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    ></path>
                  </svg>
                  Limited Edition
                </span>
              </div>
            )}
          </div>

          {cheapestPrice?.price_type === "sale" && (
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-luxury-gold/90 px-2 py-1 text-luxury-ivory text-[9px] uppercase tracking-wider font-medium flex items-center">
                <svg
                  className="w-2.5 h-2.5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Sale
              </span>
            </div>
          )}
        </div>

        <div className="pt-3 pb-3 px-4">
          <div className="flex justify-between items-start mb-1">
            <h3
              className="font-display text-sm text-luxury-charcoal group-hover:text-luxury-gold transition-colors duration-300 pr-4"
              data-testid="product-title"
            >
              {product.title}
            </h3>

            <div className="flex items-center">
              {cheapestPrice ? (
                <PreviewPrice price={cheapestPrice} />
              ) : (
                <Text className="text-luxury-gold font-medium text-sm">
                  Contact for price
                </Text>
              )}
            </div>
          </div>

          {/* Add Reviews Rating */}
          <ProductPreviewRating productId={product.id} />

          <div className="h-px bg-luxury-gold/20 w-full my-2"></div>

          <div className="flex justify-between items-center">
            <p className="text-serif-italic text-xs text-luxury-charcoal/70 max-w-[80%] line-clamp-1">
              {product.description?.substring(0, 40)}
              {product.description && product.description.length > 40
                ? "..."
                : ""}
            </p>

            <div className="w-6 h-6 rounded-full border border-luxury-gold/30 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:border-luxury-gold group-hover:bg-luxury-cream/20">
              <svg
                className="w-3 h-3 text-luxury-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 