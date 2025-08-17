"use client"

import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { motion } from "framer-motion"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import Thumbnail from "../thumbnail"
import { getProductReviewSummary } from "@lib/data/products"
import { getBaseURL } from "@lib/seo"

type ProductCardProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  index?: number
}

// Client-side rating component
const ProductRating = ({ productId }: { productId: string }) => {
  const [reviewData, setReviewData] = useState<{ average_rating: number; count: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getProductReviewSummary(productId)
      .then(setReviewData)
      .finally(() => setIsLoading(false))
  }, [productId])

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 pt-1">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <span className="text-xs text-gray-400">Loading...</span>
      </div>
    )
  }

  if (!reviewData || reviewData.count === 0) {
    return (
      <div className="flex items-center space-x-2 pt-1">
        <span className="text-xs text-gray-500">No reviews yet</span>
      </div>
    )
  }

  const { average_rating, count } = reviewData
  const roundedRating = Math.round(average_rating)

  return (
    <div className="flex items-center space-x-2 pt-1" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-3 h-3 ${i < roundedRating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-gray-500">
        <span itemProp="ratingValue">{average_rating.toFixed(1)}</span> (<span itemProp="reviewCount">{count}</span> review{count !== 1 ? 's' : ''})
      </span>
      <meta itemProp="bestRating" content="5" />
      <meta itemProp="worstRating" content="1" />
    </div>
  )
}

const AnimatedProductCard = ({ product, region, index = 0 }: ProductCardProps) => {
  // Enhanced product data for SEO
  const productPrice = product.variants?.[0]?.calculated_price
  const isInStock = product.variants?.some(variant => variant.inventory_quantity && variant.inventory_quantity > 0)
  const productCategory = product.categories?.[0]?.name || product.collection?.title || "Indian Sweets"
  const baseUrl = getBaseURL()

  const toAbsoluteUrl = (url: string) =>
    url && (url.startsWith("http://") || url.startsWith("https://"))
      ? url
      : `${baseUrl}${url?.startsWith("/") ? "" : "/"}${url || ""}`

  // Determine real lowest price in current region currency (minor units)
  const findBestVariantAmountMinorUnits = () => {
    const variants = Array.isArray(product.variants) ? product.variants : []
    const wantedCurrency = (region?.currency_code || "INR").toUpperCase()

    const matchingAmounts: number[] = []
    for (const v of variants as any[]) {
      const cp = v?.calculated_price
      if (cp && cp.currency_code && cp.currency_code.toUpperCase() === wantedCurrency && cp.calculated_amount !== undefined) {
        const amt = Number(cp.calculated_amount)
        if (!Number.isNaN(amt)) matchingAmounts.push(amt)
        continue
      }
      const prices = v?.prices || []
      const matchInPrices = prices.find((p: any) => p?.currency_code && p.currency_code.toUpperCase() === wantedCurrency)
      if (matchInPrices && matchInPrices.amount !== undefined) {
        const amt = Number(matchInPrices.amount)
        if (!Number.isNaN(amt)) matchingAmounts.push(amt)
      }
    }

    if (matchingAmounts.length > 0) return Math.min(...matchingAmounts)

    const anyAmounts: number[] = []
    for (const v of variants as any[]) {
      const cp = v?.calculated_price
      if (cp && cp.calculated_amount !== undefined) {
        const amt = Number(cp.calculated_amount)
        if (!Number.isNaN(amt)) anyAmounts.push(amt)
      } else if (Array.isArray(v?.prices) && v.prices.length > 0) {
        const amt = Number(v.prices[0]?.amount)
        if (!Number.isNaN(amt)) anyAmounts.push(amt)
      }
    }
    return anyAmounts.length > 0 ? Math.min(...anyAmounts) : 0
  }
  const amountMinorUnits = findBestVariantAmountMinorUnits()
  const priceMajorUnits = (Number(amountMinorUnits) / 100).toFixed(2)
  
  // Generate SEO-optimized product description
  const seoDescription = product.description 
    ? `${product.description.slice(0, 120)}...` 
    : `Authentic ${product.title} from Taj Petha. Premium quality ${productCategory.toLowerCase()} made with traditional recipes and hygienic preparation.`

  // Product schema markup for rich snippets - will be updated with real review data
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseUrl}/in/products/${product.handle}#product`,
    "name": product.title,
    "description": seoDescription,
    "image": [toAbsoluteUrl(product.thumbnail || "/placeholder-image.jpg")],
    "url": `${baseUrl}/in/products/${product.handle}`,
    "sku": product.variants?.[0]?.sku || `TAJ-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Taj Petha",
      "url": baseUrl
    },
    "category": productCategory,
    "offers": {
      "@type": "Offer",
      "price": priceMajorUnits,
      "priceCurrency": region?.currency_code?.toUpperCase() || "INR",
      "availability": isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Taj Petha"
      },
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      "itemCondition": "https://schema.org/NewCondition",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": priceMajorUnits,
        "priceCurrency": region?.currency_code?.toUpperCase() || "INR"
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "merchantReturnLink": `${baseUrl}/in/returns`,
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 7,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn",
        "refundType": "https://schema.org/StoreCreditRefund",
        "inStoreReturnsOffered": false
      },
      "shippingDetails": [
        {
          "@type": "OfferShippingDetails",
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "IN"
          },
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0.00",
            "currency": region?.currency_code?.toUpperCase() || "INR"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "d" },
            "transitTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 4, "unitCode": "d" }
          }
        }
      ]
    }
    // Note: aggregateRating will be added dynamically when we have real review data
  }

  // Animation variants for better UX
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 1, 0.5, 1]
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  }

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <>
      {/* Product Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      
      <motion.article
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
        itemScope
        itemType="https://schema.org/Product"
      >
        <Link href={`/in/products/${product.handle}`} className="block" aria-label={`View ${product.title} details`}>
          {/* Product Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            {!isInStock && (
              <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                Out of Stock
              </div>
            )}
            
            {/* Premium Badge for featured products */}
            {product.status === "published" && productCategory.toLowerCase().includes("premium") && (
              <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                Premium
              </div>
            )}

            <motion.div variants={imageVariants} className="w-full h-full">
              <Thumbnail
                thumbnail={product.thumbnail}
                images={product.images}
                size="full"
                className="object-cover w-full h-full group-hover:opacity-90 transition-opacity duration-300"
              />
            </motion.div>

            {/* Hover overlay with quick actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
              <motion.div 
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1 }}
              >
                <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  View Details
                </span>
              </motion.div>
            </div>
          </div>

          {/* Product Information */}
          <div className="p-4 space-y-3">
            {/* Category and Collection */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-luxury-gold font-medium" itemProp="category">
                {productCategory}
              </span>
              {product.collection && (
                <span className="text-gray-500 text-xs">
                  {product.collection.title || "Petha Collection"}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h3 
              className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-luxury-gold transition-colors duration-200"
              itemProp="name"
            >
              {product.title}
            </h3>

            {/* Product Description */}
            {product.description && (
              <p 
                className="text-gray-600 text-sm line-clamp-2 leading-relaxed"
                itemProp="description"
              >
                {seoDescription}
              </p>
            )}

            {/* Pricing Information */}
            <div className="flex items-center justify-between pt-2" itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <div className="flex flex-col">
                {productPrice && typeof productPrice === 'number' && (
                  <span 
                    className="text-xl font-bold text-gray-900"
                    itemProp="price"
                    content={(productPrice / 100).toFixed(2)}
                  >
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: region?.currency_code || 'INR',
                      minimumFractionDigits: 0,
                    }).format(productPrice / 100)}
                  </span>
                )}
                <meta itemProp="priceCurrency" content={region?.currency_code?.toUpperCase() || "INR"} />
                <meta itemProp="availability" content={isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
                <meta itemProp="itemCondition" content="https://schema.org/NewCondition" />
                <meta itemProp="priceValidUntil" content={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
                <span className="text-xs text-gray-500">Free delivery above ₹500</span>
              </div>

              {/* Stock Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isInStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-xs font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                  {isInStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Rating and Reviews - Now Dynamic */}
            <ProductRating productId={product.id} />

            {/* Additional product features */}
            <div className="flex flex-wrap gap-1 pt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Hygienic
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                ✓ Fresh
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                ✓ Authentic
              </span>
            </div>
          </div>
        </Link>

        {/* Hidden SEO content */}
        <div className="sr-only">
          <span itemProp="brand" itemScope itemType="https://schema.org/Brand">
            <span itemProp="name">Taj Petha</span>
          </span>
          <span itemProp="manufacturer" itemScope itemType="https://schema.org/Organization">
            <span itemProp="name">Taj Petha</span>
          </span>
          <span itemProp="sku">{product.variants?.[0]?.sku || `TAJ-${product.id}`}</span>
        </div>
      </motion.article>
    </>
  )
}

export default AnimatedProductCard 