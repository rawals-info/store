import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import { Star, StarSolid } from "@medusajs/icons"
import ReactMarkdown from "react-markdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  reviewData?: {
    average_rating: number
    count: number
  }
}

const ProductInfo = ({ product, reviewData }: ProductInfoProps) => {
  // Extract features and materials from product description if they exist
  const descriptionLines = product.description?.split('\n') || []
  // Identify bullet‐style lines that start with "* " or "- " or the unicode bullet "• "
  const bulletLineRegex = /^([*\-]|•)\s+/

  const bulletPoints = descriptionLines
    .filter((line) => bulletLineRegex.test(line))
    .map((line) => line.replace(bulletLineRegex, ""))

  const mainDescription = descriptionLines
    .filter((line) => !bulletLineRegex.test(line) && line.trim() !== "")
    .join("\n")
  
  // Check if product has specific tags
  const isLimitedEdition = product.tags?.some(tag => 
    tag.value?.toLowerCase().includes("limited") || 
    tag.value?.toLowerCase().includes("edition")
  )
  
  const isFeatured = product.tags?.some(tag => 
    tag.value?.toLowerCase().includes("featured")
  )
  
  // Generate fake low stock number for urgency (3-12 items left)
  const getLowStockCount = () => {
    const seed = product.id?.charCodeAt(0) || 0
    return ((seed % 10) + 3) // Returns 3-12
  }
  const lowStockCount = getLowStockCount()
  
  // Generate fake view count (between 50-250)
  const getViewCount = () => {
    const seed = product.id?.charCodeAt(product.id.length - 1) || 0
    return ((seed % 200) + 50)
  }
  const viewCount = getViewCount()
  
  // Generate fake recent purchase count (5-25 in last 24 hours)
  const getRecentPurchases = () => {
    const seed = (product.id?.charCodeAt(0) || 0) + (product.id?.charCodeAt(product.id.length - 1) || 0)
    return ((seed % 21) + 5)
  }
  const recentPurchases = getRecentPurchases()

  const renderStars = (rating: number, size = "w-4 h-4") => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span key={index}>
        {index < Math.round(rating) ? (
          <StarSolid className={`text-luxury-gold ${size}`} />
        ) : (
          <Star className={`text-luxury-gold/30 ${size}`} />
        )}
      </span>
    ))
  }

  return (
    <div id="product-info" className="px-1">
      <div className="flex flex-col gap-y-6 lg:max-w-[500px] mx-auto">
        {/* Collection and Category links with enhanced styling */}
        <div className="flex flex-wrap gap-2 items-center">
          {product.collection && (
            <>
              <LocalizedClientLink
                href={`/collections/${product.collection.handle}`}
                className="text-luxury-gold/80 hover:text-luxury-gold transition-colors duration-300 uppercase tracking-wider text-xs"
              >
                {product.collection.title} Collection
              </LocalizedClientLink>
              
              {(product.categories?.length ?? 0) > 0 && (
                <span className="text-luxury-gold/50 mx-1">·</span>
              )}
            </>
          )}

          {(product.categories?.length ?? 0) > 0 && (
            <LocalizedClientLink
              href={`/categories/${product.categories?.[0]?.handle ?? "#"}`}
              className="text-luxury-gold/80 hover:text-luxury-gold transition-colors duration-300 uppercase tracking-wider text-xs"
            >
              {product.categories?.[0]?.name ?? ""} Category
            </LocalizedClientLink>
          )}
        </div>
        
        {/* Product title with luxury styling */}
        <div className="space-y-4">
          <Heading
            level="h1"
            className="font-display text-3xl md:text-4xl leading-tight text-luxury-charcoal"
            data-testid="product-title"
          >
            {product.title}
          </Heading>
          
          {/* Average Rating Display - Only show if reviews exist */}
          {reviewData && reviewData.count > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {renderStars(reviewData.average_rating)}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-luxury-charcoal">
                    {reviewData.average_rating.toFixed(1)}
                  </span>
                  <span className="text-luxury-charcoal/60">
                    ({reviewData.count} review{reviewData.count !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>
              
              {/* Quick link to reviews */}
              <a 
                href="#customer-reviews" 
                className="text-xs text-luxury-gold hover:text-luxury-gold/80 transition-colors w-fit"
              >
                Read customer reviews →
              </a>
            </div>
          )}
          
          {/* Urgency Indicators - Mobile-Optimized Luxury Style */}
          <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6">
            {/* Low Stock Warning - Mobile Responsive */}
            <div className="flex items-center gap-2 sm:gap-3 bg-luxury-cream/30 border border-luxury-gold/30 px-3 py-2 sm:px-4 sm:py-3 rounded-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-luxury-gold animate-pulse flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-luxury-charcoal">
                  Only {lowStockCount} available
                </p>
                <p className="text-[10px] sm:text-xs text-luxury-charcoal/60 mt-0.5">
                  {recentPurchases} orders in 24hrs
                </p>
              </div>
            </div>
            
            {/* Social Proof - Mobile Responsive */}
            <div className="flex items-center gap-2 sm:gap-3 bg-luxury-cream/20 border border-luxury-gold/20 px-3 py-2 sm:px-4 sm:py-3 rounded-sm">
              <div className="flex -space-x-0.5 sm:-space-x-1 flex-shrink-0">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-luxury-gold/70 to-luxury-gold border-2 border-luxury-ivory"></div>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-luxury-gold/50 to-luxury-gold/70 border-2 border-luxury-ivory"></div>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-luxury-gold/30 to-luxury-gold/50 border-2 border-luxury-ivory"></div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-luxury-charcoal">
                {viewCount}+ viewing now
              </p>
            </div>
            
            {/* Flash Sale Badge - Mobile Responsive */}
            <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-luxury-gold to-yellow-600 px-3 py-2 sm:px-4 sm:py-3 rounded-sm shadow-md">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              <p className="text-xs sm:text-sm font-bold text-white">
                Save 20% with SWEET20
              </p>
            </div>
          </div>
          
          {/* Product badges */}
          <div className="flex gap-3 mt-4">
            {isLimitedEdition && (
              <span className="bg-luxury-gold/90 px-3 py-1 text-luxury-ivory text-[11px] uppercase tracking-wider font-medium inline-flex items-center">
                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
                Limited Edition
              </span>
            )}
            
            <span className="bg-luxury-ivory border border-luxury-gold/60 px-3 py-1 text-luxury-charcoal text-[11px] uppercase tracking-wider font-medium inline-flex items-center">
              <svg className="w-3 h-3 mr-1.5 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 113 0v3m0 0V11"></path>
              </svg>
              Freshly Made
            </span>
          </div>
        </div>

        {/* Decorative separator */}
        <div className="flex items-center gap-4">
          <div className="h-px bg-luxury-gold/30 flex-grow"></div>
          <div className="w-2 h-2 rounded-full bg-luxury-gold/50"></div>
          <div className="h-px bg-luxury-gold/30 flex-grow"></div>
        </div>
        
        {/* Main description with refined typography */}
        <div className="space-y-4">
          <div className="text-base leading-relaxed text-luxury-charcoal whitespace-pre-line" data-testid="product-description">
            <ReactMarkdown
              components={{
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold" {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em className="italic" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="list-disc ml-5 text-luxury-charcoal/80 text-sm leading-relaxed" {...props} />
                ),
              }}
            >
              {mainDescription}
            </ReactMarkdown>
          </div>
          
          {/* Feature bullet points if they exist */}
          {bulletPoints.length > 0 && (
            <div className="mt-4">
              <h3 className="text-small-semi uppercase tracking-wider text-luxury-charcoal mb-3">Features & Materials</h3>
              <ul className="space-y-2">
                {bulletPoints.map((point, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-luxury-gold mr-2 mt-1">•</span>
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <span className="text-luxury-charcoal/80 text-sm leading-relaxed" {...props} />, 
                        strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                        em: ({node, ...props}) => <em className="italic" {...props} />
                      }}
                    >
                      {point}
                    </ReactMarkdown>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Craftsmanship note */}
        <div className="bg-luxury-cream/50 border border-luxury-gold/20 p-4 mt-2">
          <p className="text-xs text-luxury-charcoal/70 italic">
          Our Petha is handmade in small batches—each piece may vary slightly in size, shape, or hue, a true sign of its heritage.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
