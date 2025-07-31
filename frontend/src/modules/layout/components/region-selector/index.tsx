"use client"

import React, { useEffect, useState } from "react"
import { StoreRegion } from "@medusajs/types"
import { useParams, usePathname } from "next/navigation"
import { updateRegion } from "@lib/data/cart"
import ReactCountryFlag from "react-country-flag"
import { motion, AnimatePresence } from "framer-motion"
import { listRegions } from "@lib/data/regions"
import { listIndiaRegions } from "@lib/constants/india-region"

interface RegionSelectorProps {
  regions: StoreRegion[]
  variant?: "header" | "footer" | "mobile"
}

interface CountryOption {
  country: string
  region: string
  label: string
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ 
  regions: initialRegions, 
  variant = "header" 
}) => {
  const [currentCountry, setCurrentCountry] = useState<CountryOption | null>(null)
  const [regions, setRegions] = useState<StoreRegion[]>(initialRegions || [])
  
  const [isOpen, setIsOpen] = useState(false)
  const params = useParams() as Record<string, string | string[] | undefined>
  const countryCode = (params?.countryCode as string | undefined) || ''

  const fullPath = usePathname() || ''
  const currentPath = fullPath.replace(new RegExp(`^/${countryCode}`), '')
  
  // Force refresh regions data from backend
  useEffect(() => {
    const refreshRegions = async () => {
      try {
        const freshRegions = listIndiaRegions()
        if (freshRegions && freshRegions.length > 0) {
          setRegions(freshRegions)
        }
      } catch (error) {
        console.error("Error refreshing regions:", error)
      }
    }
    
    refreshRegions()
  }, [])
  
  // Create an array of country options from the regions
  const countryOptions = React.useMemo(() => {
    return regions
      ?.flatMap((region) =>
        region.countries?.map((country) => ({
          country: country.iso_2,
          region: region.id,
          label: country.display_name,
        }))
      )
      .filter((option): option is CountryOption => 
        Boolean(option && option.country && option.label)
      )
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [regions])

  // Set the current country based on the URL param
  useEffect(() => {
    if (countryCode && countryOptions?.length) {
      const option = countryOptions.find((opt) => opt.country === countryCode)
      if (option) {
        setCurrentCountry(option)
      }
    }
  }, [countryCode, countryOptions])

  // Handle selecting a new country
  const handleSelectCountry = (option: CountryOption) => {
    updateRegion(option.country, currentPath)
    setIsOpen(false)
  }

  // For mobile variant
  if (variant === "mobile") {
    return (
      <div className="w-full max-w-xs">
        <div className="flex flex-col gap-y-3 items-center">
          <span className="font-display text-base text-luxury-gold border-b border-luxury-gold/20 pb-1 w-full text-center">
            Select Region
          </span>
          <button
            className="flex items-center justify-center gap-x-2 focus:outline-none group w-full bg-luxury-cream/20 py-2 px-4 rounded-sm"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            {currentCountry && (
              <span className="flex items-center gap-x-2">
                <ReactCountryFlag
                  svg
                  style={{
                    width: "18px",
                    height: "18px",
                  }}
                  countryCode={currentCountry.country}
                />
                <span className="text-sm font-medium">{currentCountry.label}</span>
              </span>
            )}
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mt-2 w-full rounded-md bg-white shadow-lg ring-1 ring-luxury-gold/5 focus:outline-none"
            >
              <div className="max-h-60 overflow-y-auto py-1">
                {countryOptions?.map((option, index) => (
                  <button
                    key={index}
                    className={`flex w-full items-center gap-x-2 px-4 py-2 text-sm ${
                      currentCountry?.country === option.country
                        ? "bg-luxury-cream/50 text-luxury-gold"
                        : "text-luxury-charcoal hover:bg-luxury-cream/20"
                    }`}
                    onClick={() => handleSelectCountry(option)}
                  >
                    <ReactCountryFlag
                      svg
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                      countryCode={option.country}
                    />
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // For header variant
  if (variant === "header") {
    return (
      <div className="relative">
        <button
          className="flex items-center gap-x-2 focus:outline-none group"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="text-sm font-medium text-luxury-charcoal/80 group-hover:text-luxury-gold transition-colors duration-200">
            Shipping to:
          </span>
          {currentCountry && (
            <span className="flex items-center gap-x-2">
              <ReactCountryFlag
                svg
                style={{
                  width: "16px",
                  height: "16px",
                }}
                countryCode={currentCountry.country}
              />
              <span className="text-sm">{currentCountry.label}</span>
            </span>
          )}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
          <span className="absolute -bottom-px left-0 w-0 h-0.5 bg-luxury-gold group-hover:w-full transition-all duration-300 ease-in-out"></span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-luxury-gold/5 focus:outline-none"
            >
              <div className="max-h-60 overflow-y-auto py-1">
                {countryOptions?.map((option, index) => (
                  <button
                    key={index}
                    className={`flex w-full items-center gap-x-2 px-4 py-2 text-sm ${
                      currentCountry?.country === option.country
                        ? "bg-luxury-cream/50 text-luxury-gold"
                        : "text-luxury-charcoal hover:bg-luxury-cream/20"
                    }`}
                    onClick={() => handleSelectCountry(option)}
                  >
                    <ReactCountryFlag
                      svg
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                      countryCode={option.country}
                    />
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // For footer variant
  return (
    <div className="relative">
      <div className="flex flex-col gap-y-2">
        <span className="font-display text-base text-luxury-gold border-b border-luxury-gold/20 pb-1 mb-1">
          Shipping
        </span>
        <button
          className="flex items-center gap-x-2 focus:outline-none group text-left"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="text-sm text-luxury-charcoal/80">Shipping to:</span>
          {currentCountry && (
            <span className="flex items-center gap-x-2">
              <ReactCountryFlag
                svg
                style={{
                  width: "16px",
                  height: "16px",
                }}
                countryCode={currentCountry.country}
              />
              <span className="text-sm">{currentCountry.label}</span>
            </span>
          )}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-luxury-gold/5 focus:outline-none"
          >
            <div className="max-h-60 overflow-y-auto py-1">
              {countryOptions?.map((option, index) => (
                <button
                  key={index}
                  className={`flex w-full items-center gap-x-2 px-4 py-2 text-sm ${
                    currentCountry?.country === option.country
                      ? "bg-luxury-cream/50 text-luxury-gold"
                      : "text-luxury-charcoal hover:bg-luxury-cream/20"
                  }`}
                  onClick={() => handleSelectCountry(option)}
                >
                  <ReactCountryFlag
                    svg
                    style={{
                      width: "16px",
                      height: "16px",
                    }}
                    countryCode={option.country}
                  />
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RegionSelector 