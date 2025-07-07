import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import Image from "next/image"

interface CollectionPreviewProps {
  collection: HttpTypes.StoreCollection
}

const CollectionPreview = ({ collection }: CollectionPreviewProps) => {
  const thumbnail = collection.metadata?.thumbnail as string | undefined

  return (
    <LocalizedClientLink 
      href={`/collections/${collection.handle}`}
      className="group block relative luxury-image-hover"
    >
      <div className="relative h-80 overflow-hidden mb-4">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={collection.title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            width={600}
            height={400}
          />
        ) : (
          <div className="absolute inset-0 bg-luxury-cream/50 flex items-center justify-center">
            <div className="text-center z-10 transition-all duration-500 transform group-hover:scale-110">
              <span className="text-luxury-gold font-display text-2xl">{collection.title}</span>
              <div className="h-px w-12 bg-luxury-gold mx-auto my-4"></div>
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-luxury-charcoal/40 group-hover:bg-luxury-charcoal/30 transition-colors duration-300"></div>
        
        {/* Collection Title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6">
          <h3 className="font-display text-2xl text-luxury-ivory mb-3">{collection.title}</h3>
          <div className="h-px w-16 bg-luxury-gold mb-4 transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
          <p className="text-luxury-ivory/90 text-serif-italic opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-xs">
            {collection.metadata?.description || "Discover our exclusive collection of handcrafted marble pieces."}
          </p>
        </div>
      </div>
      
      {/* View Collection button */}
      <div className="flex justify-center mt-2">
        <span className="text-small-semi text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300 uppercase tracking-wider flex items-center">
          View Collection
          <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </span>
      </div>
    </LocalizedClientLink>
  )
}

export default CollectionPreview 