"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export interface ActivePromo {
  id: string
  code: string
  discountPercent: number
  type: string
  status: string
  minOrderThreshold?: number
}

interface PriceCalculation {
  rawPrice: number
  discountedPrice: number
  savings: number
  discountPercent: number
  isDiscounted: boolean
  promoCode: string | null
}

interface PromotionContextType {
  activePromo: ActivePromo | null
  threshold: number
  isLoading: boolean
  isThresholdMet: (itemsSubtotal: number) => boolean
  getRemainingAmount: (itemsSubtotal: number) => number
  calculatePrice: (rawPrice: number, unlocked?: boolean) => PriceCalculation
  calculatePotentialDiscount: (rawPrice: number) => PriceCalculation
}

const DEFAULT_THRESHOLD = 500

const defaultPriceCalc = (rawPrice: number): PriceCalculation => ({
  rawPrice,
  discountedPrice: rawPrice,
  savings: 0,
  discountPercent: 0,
  isDiscounted: false,
  promoCode: null,
})

const PromotionContext = createContext<PromotionContextType>({
  activePromo: null,
  threshold: DEFAULT_THRESHOLD,
  isLoading: false,
  isThresholdMet: (itemsSubtotal: number) => itemsSubtotal >= DEFAULT_THRESHOLD,
  getRemainingAmount: (itemsSubtotal: number) => Math.max(0, DEFAULT_THRESHOLD - itemsSubtotal),
  calculatePrice: defaultPriceCalc,
  calculatePotentialDiscount: defaultPriceCalc,
})

export function PromotionProvider({ children }: { children: React.ReactNode }) {
  const [activePromo, setActivePromo] = useState<ActivePromo | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
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
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const threshold = activePromo?.minOrderThreshold && activePromo.minOrderThreshold > 0
    ? activePromo.minOrderThreshold
    : DEFAULT_THRESHOLD

  const isThresholdMet = (itemsSubtotal: number) => {
    return (Number(itemsSubtotal) || 0) >= threshold
  }

  const getRemainingAmount = (itemsSubtotal: number) => {
    return Math.max(0, threshold - Math.round(Number(itemsSubtotal) || 0))
  }

  // Calculates potential discount (what price will be when threshold is unlocked)
  const calculatePotentialDiscount = (rawPrice: number): PriceCalculation => {
    const safeRaw = isNaN(rawPrice) || rawPrice <= 0 ? 0 : rawPrice

    if (!activePromo || activePromo.discountPercent <= 0 || !activePromo.code) {
      return defaultPriceCalc(safeRaw)
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

  // If unlocked is false (e.g. cart subtotal < threshold), returns base price without discount
  const calculatePrice = (rawPrice: number, unlocked: boolean = true): PriceCalculation => {
    const safeRaw = isNaN(rawPrice) || rawPrice <= 0 ? 0 : rawPrice

    if (!unlocked || !activePromo || activePromo.discountPercent <= 0 || !activePromo.code) {
      return defaultPriceCalc(safeRaw)
    }

    return calculatePotentialDiscount(safeRaw)
  }

  return (
    <PromotionContext.Provider
      value={{
        activePromo,
        threshold,
        isLoading,
        isThresholdMet,
        getRemainingAmount,
        calculatePrice,
        calculatePotentialDiscount,
      }}
    >
      {children}
    </PromotionContext.Provider>
  )
}

export function usePromotion() {
  return useContext(PromotionContext)
}
