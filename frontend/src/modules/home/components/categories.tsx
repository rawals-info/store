// @ts-nocheck
"use server"

import React from "react";
import { motion } from "framer-motion"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cache } from "react"
import { ClientCategoriesWrapper } from "./client-categories-wrapper"

// Cache categories fetch with a 1-hour revalidation period
export const getCachedCategories = cache(async () => {
  try {
    const response = await sdk.client.fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          // Remove the limit to fetch all categories
          fields: "*category_children",
        },
        next: {
          revalidate: 3600, // Cache for 1 hour
          tags: ["categories"]
        }
      }
    )
    
    return response.product_categories || []
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
})

const Categories = async () => {
  // Fetch categories and keep only the four main parent categories we want to feature
  const allCategories = await getCachedCategories()
  const displayHandles = ["petha", "namkeen", "dalmoth", "combo1"]
  const categories = allCategories.filter((cat) => {
    if (cat.parent_category) return false // skip children
    const handle = (cat.handle || "").replace(/^\//, "") // normalize leading slash
    return displayHandles.includes(handle)
  })
  
  return (
    <section className="py-16 bg-white">
      <div className="content-container">
        <div className="flex flex-col items-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-luxury-charcoal mb-4">
            Explore Our Categories
          </h2>
          <div className="h-px w-24 bg-luxury-gold mb-6" />
          <p className="text-center text-luxury-charcoal/80 max-w-lg">
            Discover our exquisite collection of handcrafted marble pieces, meticulously created for various aspects of luxury living
          </p>
        </div>
        
        {/* Client wrapper handles animations */}
        <ClientCategoriesWrapper categories={categories} />
        
        <div className="flex justify-center mt-12">
          <LocalizedClientLink
            href="/categories"
            className="inline-block bg-transparent border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white transition-colors duration-300 px-6 py-3 rounded font-medium text-sm tracking-wider uppercase"
          >
            View All Categories
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default Categories 