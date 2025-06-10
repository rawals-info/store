"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { listRegions } from "@lib/data/regions"
import ReactCountryFlag from "react-country-flag"
import Link from "next/link"

interface CurrencySwitcherProps {
  variant?: "header" | "footer"
}

const CurrencySwitcher = ({ variant = "header" }: CurrencySwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currencies, setCurrencies] = useState<Record<string, string[]>>({}) // currency -> country codes
  const [currentCurrency, setCurrentCurrency] = useState<string | null>(null)
  const { countryCode } = useParams()
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const fetchRegionData = async () => {
      try {
        const regions = await listRegions()
        
        // Create a map of currencies to country codes
        const currencyMap: Record<string, string[]> = {}
        const countryToCurrency: Record<string, string> = {}
        
        regions.forEach(region => {
          if (region.currency_code) {
            const currency = region.currency_code.toUpperCase()
            
            // Initialize the currency entry if it doesn't exist
            if (!currencyMap[currency]) {
              currencyMap[currency] = []
            }
            
            // Add all countries for this currency
            region.countries?.forEach(country => {
              if (country.iso_2) {
                const code = country.iso_2.toLowerCase()
                currencyMap[currency].push(code)
                countryToCurrency[code] = currency
              }
            })
          }
        })
        
        setCurrencies(currencyMap)
        
        // Set current currency based on country code
        if (countryCode && countryToCurrency[countryCode as string]) {
          setCurrentCurrency(countryToCurrency[countryCode as string])
        } else {
          // Default to USD if country not found
          setCurrentCurrency("USD")
        }
      } catch (error) {
        console.error("Error fetching region data:", error)
        // Default to USD if there's an error
        setCurrentCurrency("USD")
      }
    }
    
    fetchRegionData()
    
    // Add click outside listener to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [countryCode])
  
  if (!currentCurrency) {
    return null
  }
  
  // Map currency to a representative country for the flag
  const currencyToCountry: Record<string, string> = {
    USD: "us",
    EUR: "eu",
    GBP: "gb",
    JPY: "jp",
    CAD: "ca",
    AUD: "au",
    INR: "in",
    CNY: "cn",
    AED: "ae",
    // Add more currency to country mappings as needed
  }

  const isFooter = variant === "footer"
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center gap-1.5 ${
          isFooter 
            ? "text-luxury-charcoal/80 hover:text-luxury-gold transition-colors duration-300" 
            : "text-sm"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <ReactCountryFlag 
          svg 
          countryCode={currencyToCountry[currentCurrency] || "us"} 
          style={{ width: '16px', height: '16px' }}
        />
        <span className={isFooter ? "" : "hidden md:block"}>{currentCurrency}</span>
        <svg 
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className={`absolute ${isFooter ? "left-0" : "right-0"} mt-2 w-40 bg-luxury-ivory shadow-md rounded-sm border border-luxury-lightgold z-[60]`}>
          <div className="py-1">
            {Object.entries(currencies).map(([currency, countryCodes]) => {
              // Use the first country code for this currency as the target
              const targetCountry = countryCodes[0]
              
              return (
                <Link
                  key={currency}
                  href={`/${targetCountry}`}
                  className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-luxury-cream/50 transition-colors duration-300 ${
                    currency === currentCurrency ? "bg-luxury-cream/30 text-luxury-gold" : "text-luxury-charcoal/80"
                  }`}
                  onClick={() => setIsOpen(false)}
                  replace={true}
                >
                  <ReactCountryFlag 
                    svg 
                    countryCode={currencyToCountry[currency] || targetCountry} 
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>{currency}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default CurrencySwitcher 