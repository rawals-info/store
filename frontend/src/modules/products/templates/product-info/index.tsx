import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  // Extract features and materials from product description if they exist
  const descriptionLines = product.description?.split('\n') || []
  const mainDescription = descriptionLines.filter(line => !line.startsWith('• ') && line.trim() !== '').join('\n')
  const bulletPoints = descriptionLines.filter(line => line.startsWith('• ')).map(line => line.replace('• ', ''))
  
  // Check if product has specific tags
  const isLimitedEdition = product.tags?.some(tag => 
    tag.value?.toLowerCase().includes("limited") || 
    tag.value?.toLowerCase().includes("edition")
  )
  
  const isFeatured = product.tags?.some(tag => 
    tag.value?.toLowerCase().includes("featured")
  )

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
              
              {product.categories?.length > 0 && (
                <span className="text-luxury-gold/50 mx-1">·</span>
              )}
            </>
          )}

          {product.categories?.length > 0 && (
            <LocalizedClientLink
              href={`/categories/${product.categories[0].handle}`}
              className="text-luxury-gold/80 hover:text-luxury-gold transition-colors duration-300 uppercase tracking-wider text-xs"
            >
              {product.categories[0].name} Category
            </LocalizedClientLink>
          )}
        </div>
        
        {/* Product title with luxury styling */}
        <div className="space-y-2">
          <Heading
            level="h1"
            className="font-display text-3xl md:text-4xl leading-tight text-luxury-charcoal"
            data-testid="product-title"
          >
            {product.title}
          </Heading>
          
          {/* Product badges */}
          <div className="flex gap-3 mt-2">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"></path>
              </svg>
              Handcrafted
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
          <Text
            className="text-serif-italic text-base leading-relaxed text-luxury-charcoal whitespace-pre-line"
            data-testid="product-description"
          >
            {mainDescription}
          </Text>
          
          {/* Feature bullet points if they exist */}
          {bulletPoints.length > 0 && (
            <div className="mt-4">
              <h3 className="text-small-semi uppercase tracking-wider text-luxury-charcoal mb-3">Features & Materials</h3>
              <ul className="space-y-2">
                {bulletPoints.map((point, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-luxury-gold mr-2 mt-1">•</span>
                    <span className="text-luxury-charcoal/80 text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Craftsmanship note */}
        <div className="bg-luxury-cream/50 border border-luxury-gold/20 p-4 mt-2">
          <p className="text-xs text-luxury-charcoal/70 italic">
            Each piece is meticulously handcrafted by our master artisans, making every item uniquely yours. Slight variations may occur, reflecting the authentic nature of handmade marble craftsmanship.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
