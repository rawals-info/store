"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export interface ActivePromo {
  id: string
  code: string
  discountPercent: number
  type: string
  status: string
}

interface PromotionContextType {
  activePromo: ActivePromo | null
  isLoading: boolean
  calculatePrice: (rawPrice: number) => {
    rawPrice: number
    discountedPrice: number
    savings: number
    discountPercent: number
    isDiscounted: boolean
    promoCode: string | null
  }
}

const PromotionContext = createContext<PromotionContextType>({
  activePromo: null,
  isLoading: false,
  calculatePrice: (rawPrice: number) => ({
    rawPrice,
    discountedPrice: rawPrice,
    savings: 0,
    discountPercent: 0,
    isDiscounted: false,
    promoCode: null,
  }),
})

export function PromotionProvider({ children }: { children: React.ReactNode }) {
  const [activePromo, setActivePromo] = useState<ActivePromo | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetch("/api/promotions/active")
      .then((res) => res.json())
      .then((data) => {
        if (data?.promotion && data.promotion.code && data.promotion.discountPercent > 0) {
          setActivePromo(data.promotion)
        } else {
          setActivePromo(null)
        }
      })
      .catch((err) => {
        console.error("Failed to fetch active promotion:", err)
        setActivePromo(null)
      })
  }, [])

  const calculatePrice = (rawPrice: number) => {
    const safeRaw = isNaN(rawPrice) || rawPrice <= 0 ? 0 : rawPrice

    if (!activePromo || activePromo.discountPercent <= 0 || !activePromo.code) {
      return {
        rawPrice: safeRaw,
        discountedPrice: safeRaw,
        savings: 0,
        discountPercent: 0,
        isDiscounted: false,
        promoCode: null,
      }
    }

    const multiplier = 1 - activePromo.discountPercent / 100
    const discounted = Math.round(safeRaw * multiplier * 100) / 100
    const savings = Math.round((safeRaw - discounted) * 100) / 100

    return {
      rawPrice: safeRaw,
      discountedPrice: discounted,
      savings,
      discountPercent: activePromo.discountPercent,
      isDiscounted: savings > 0,
      promoCode: activePromo.code,
    }
  }

  return (
    <PromotionContext.Provider value={{ activePromo, isLoading, calculatePrice }}>
      {children}
    </PromotionContext.Provider>
  )
}

export function usePromotion() {
  return useContext(PromotionContext)
}
