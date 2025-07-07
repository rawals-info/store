"use client"

import { HttpTypes } from "@medusajs/types"
import { motion, AnimatePresence } from "framer-motion"
import { Text, Heading } from "@medusajs/ui"
import { useEffect, useState } from "react"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
  activeTab: string
  setActiveTab: (tab: string) => void
}

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    }
  },
  exit: { 
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
    }
  }
}

const ProductTabs = ({ product, activeTab, setActiveTab }: ProductTabsProps) => {
  // Get the visible tabs based on available data
  const getAvailableTabs = () => {
    const tabs = [
      { id: "description", label: "Description" },
      { id: "details", label: "Details" },
      { id: "dimensions", label: "Dimensions" },
      { id: "shipping", label: "Shipping" },
    ]
    
    // Only show tabs for which we have data
    // (In this case we're showing all tabs, but this could be modified to hide tabs with no data)
    return tabs
  }
  
  const tabs = getAvailableTabs()
  
  // Get metadata for the current selected variant from product actions
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  
  // Listen for variant changes from localStorage (set by product-actions component)
  useEffect(() => {
    const handleStorageChange = () => {
      const variantId = localStorage.getItem('selectedVariantId')
      if (variantId) {
        setSelectedVariantId(variantId)
      }
    }
    
    // Check if there's already a selected variant
    handleStorageChange()
    
    // Listen for changes
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])
  
  // Get the selected variant
  const selectedVariant = product.variants?.find(v => v.id === selectedVariantId) || product.variants?.[0]
  
  // Get variant-specific or product-level metadata
  const getDimensionValue = (key: string): string => {
    // First try to get from selected variant metadata
    if (selectedVariant?.metadata && selectedVariant.metadata[key]) {
      return String(selectedVariant.metadata[key])
    }
    
    // Then try the variant itself
    if (selectedVariant && (selectedVariant as any)[key]) {
      return String((selectedVariant as any)[key])
    }
    
    // Then try product metadata
    if (product.metadata && product.metadata[key]) {
      return String(product.metadata[key])
    }
    
    // Then try product
    if ((product as any)[key]) {
      return String((product as any)[key])
    }
    
    return "Variable"
  }
  
  // Get product details from metadata
  const getProductDetails = () => {
    const details = []
    
    // Get materials from metadata
    if (product.metadata?.materials) {
      try {
        // Try to parse JSON array if it's stored as a string
        const materialsData = typeof product.metadata.materials === 'string'
          ? JSON.parse(String(product.metadata.materials))
          : product.metadata.materials
          
        if (Array.isArray(materialsData)) {
          details.push({
            title: "Materials",
            items: materialsData.map(item => String(item))
          })
        }
      } catch (e) {
        // If parsing fails, try to use as is
        details.push({
          title: "Materials",
          items: [String(product.metadata.materials)]
        })
      }
    } else {
      // Fallback to default materials
      details.push({
        title: "Materials",
        items: [
          "Premium quality marble",
          "Natural stone with unique veining",
          "Non-toxic sealant finish",
          product.type?.value
        ].filter(Boolean)
      })
    }
    
    // Get features from metadata
    if (product.metadata?.features) {
      try {
        const featuresData = typeof product.metadata.features === 'string'
          ? JSON.parse(String(product.metadata.features))
          : product.metadata.features
          
        if (Array.isArray(featuresData)) {
          details.push({
            title: "Features",
            items: featuresData.map(item => String(item))
          })
        }
      } catch (e) {
        details.push({
          title: "Features",
          items: [String(product.metadata.features)]
        })
      }
    } else {
      // Fallback to default features
      details.push({
        title: "Features",
        items: [
          "Handcrafted by master artisans",
          "One-of-a-kind piece",
          "Durable and long-lasting",
          "Easy to clean and maintain"
        ]
      })
    }
    
    return details
  }
  
  // Get shipping info from metadata
  const getShippingInfo = () => {
    if (product.metadata?.shipping) {
      try {
        const shippingData = typeof product.metadata.shipping === 'string'
          ? JSON.parse(String(product.metadata.shipping))
          : product.metadata.shipping
          
        if (Array.isArray(shippingData)) {
          return shippingData.map(item => String(item))
        }
        return [String(product.metadata.shipping)]
      } catch (e) {
        return [String(product.metadata.shipping)]
      }
    }
    
    // Fallback to default shipping info
    return [
      "All our marble pieces are carefully packaged and shipped with insurance.",
      "Standard shipping: 5-7 business days",
      "Express shipping: 2-3 business days",
      "International shipping available to select countries.",
      "For custom shipping arrangements or questions, please contact our customer service team."
    ]
  }
  
  const productDetails = getProductDetails()
  const shippingInfo = getShippingInfo()

  return (
    <div>
      <div className="flex border-b border-ui-border-base mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`relative px-6 py-3 text-sm font-medium ${
              activeTab === tab.id
                ? "text-ui-fg-base"
                : "text-ui-fg-subtle hover:text-ui-fg-base"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                layoutId="activeTab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          {activeTab === "description" && (
            <motion.div
              key="description"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Text className="text-ui-fg-base">
                {product.description || "No description available."}
              </Text>
            </motion.div>
          )}

          {activeTab === "details" && (
            <motion.div
              key="details"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {productDetails.map((section, idx) => (
                  <div key={idx}>
                    <Heading level="h3" className="text-lg mb-3">{section.title}</Heading>
                    <ul className="list-disc pl-5 space-y-2 text-ui-fg-subtle">
                      {section.items.map((item, itemIdx) => 
                        item && <li key={itemIdx}>{item}</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "dimensions" && (
            <motion.div
              key="dimensions"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Heading level="h3" className="text-lg mb-3">
                    {selectedVariant ? "Variant Dimensions" : "Product Dimensions"}
                  </Heading>
                  <div className="space-y-2 text-ui-fg-subtle">
                    <p><strong>Height:</strong> {getDimensionValue("height")} cm</p>
                    <p><strong>Width:</strong> {getDimensionValue("width")} cm</p>
                    <p><strong>Length:</strong> {getDimensionValue("length")} cm</p>
                    <p><strong>Weight:</strong> {getDimensionValue("weight")} kg</p>
                    
                    {/* Display variant-specific information if available */}
                    {selectedVariant && (
                      <div className="mt-4 pt-4 border-t border-ui-border-base">
                        <p className="italic text-sm">
                          These dimensions are specific to the selected variant: {selectedVariant.title}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Heading level="h3" className="text-lg mb-3">Packaging</Heading>
                  <div className="space-y-2 text-ui-fg-subtle">
                    {product.metadata?.packaging ? (
                      <p>{String(product.metadata.packaging)}</p>
                    ) : (
                      <>
                        <p>Each piece is carefully packaged in custom protective materials to ensure safe delivery.</p>
                        <p>Includes certificate of authenticity and care instructions.</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "shipping" && (
            <motion.div
              key="shipping"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="space-y-4 text-ui-fg-subtle">
                {shippingInfo.map((info, idx) => (
                  <p key={idx}>{info}</p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ProductTabs
