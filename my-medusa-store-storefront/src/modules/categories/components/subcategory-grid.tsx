"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { motion } from "framer-motion"

type SubcategoryGridProps = {
  subcategories: HttpTypes.StoreProductCategory[]
  countryCode: string
}

const SubcategoryGrid = ({ subcategories, countryCode }: SubcategoryGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {subcategories.map((subcat) => (
        <LocalizedClientLink
          href={`/categories/${subcat.handle}`}
          key={subcat.id}
          className="group"
        >
          <motion.div
            className="bg-white/70 backdrop-blur-sm p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 border border-luxury-gold/10 hover:border-luxury-gold/30"
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="font-medium text-luxury-charcoal text-lg mb-2 group-hover:text-luxury-gold/90 transition-colors">
              {subcat.name}
            </h4>
            {subcat.description && (
              <p className="text-sm text-luxury-charcoal/70 line-clamp-2">
                {subcat.description}
              </p>
            )}
          </motion.div>
        </LocalizedClientLink>
      ))}
    </div>
  )
}

export default SubcategoryGrid 