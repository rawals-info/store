"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import ProductTabs from "../product-tabs"

type ProductTabsWrapperProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabsWrapper = ({ product }: ProductTabsWrapperProps) => {
  const [activeTab, setActiveTab] = useState("description")

  return (
    <ProductTabs 
      product={product}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  )
}

export default ProductTabsWrapper 