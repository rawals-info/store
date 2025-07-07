"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { luxuryHover } from "@lib/util/animations"
import Thumbnail from "@modules/products/components/thumbnail"
import { formatAmount } from "@lib/util/prices"

interface AnimatedProductCardProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

const AnimatedProductCard = ({ product, region }: AnimatedProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const { currency_code } = region
  
  const price = product.variants[0]?.prices?.find(
    (p) => p.currency_code === currency_code
  )
  
  return (
    <motion.div
      className="group relative flex flex-col"
      variants={luxuryHover}
      initial="initial"
      whileHover="whileHover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="relative block aspect-square w-full"
        data-testid={`product-link-${product.id}`}
      >
        <div className="relative h-full w-full overflow-hidden rounded-md">
          {product.thumbnail && (
            <motion.div
              className="absolute inset-0"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            >
              <Thumbnail thumbnail={product.thumbnail} size="full" />
            </motion.div>
          )}
          
          {/* Overlay on hover */}
          <motion.div 
            className="absolute inset-0 bg-black pointer-events-none"
            animate={{ opacity: isHovered ? 0.05 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Luxury badge */}
          {product.tags?.some(tag => tag.value === "handcrafted") && (
            <div className="absolute top-2 right-2 bg-amber-100 text-amber-900 text-xs px-2 py-1 rounded-sm font-medium">
              Handcrafted
            </div>
          )}
          
          {/* Limited edition badge */}
          {product.tags?.some(tag => tag.value === "limited") && (
            <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-sm font-medium">
              Limited Edition
            </div>
          )}
        </div>
      </LocalizedClientLink>
      
      <div className="mt-4 flex flex-col gap-y-1">
        <motion.div 
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Text className="text-ui-fg-base font-medium">
            {product.title}
          </Text>
        </motion.div>
        
        <motion.div 
          animate={{ y: isHovered ? -2 : 0, opacity: isHovered ? 0.8 : 1 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          <Text className="text-ui-fg-subtle text-sm">
            {product.collection?.title || "Marble Collection"}
          </Text>
        </motion.div>
        
        <motion.div 
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Text className="text-ui-fg-base font-medium mt-1">
            {price ? formatAmount({
              amount: price.amount,
              region,
              includeTaxes: false,
            }) : "N/A"}
          </Text>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default AnimatedProductCard 