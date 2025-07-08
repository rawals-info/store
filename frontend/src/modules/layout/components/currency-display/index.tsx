"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ReactCountryFlag from "react-country-flag"
import { listRegions } from "@lib/data/regions"
import { DEFAULT_CURRENCY, DEFAULT_COUNTRY } from "@lib/config/defaults"

const CurrencyDisplay = () => {
  const [currencies, setCurrencies] = useState<Record<string, string>>({})
  const [currentCurrency, setCurrentCurrency] = useState<string | null>(null)
  const params = useParams<{ countryCode?: string }>()
  const countryCode = params?.countryCode as string | undefined
  
  useEffect(() => {
    const fetchRegionData = async () => {
      try {
        const regions = await listRegions()
        
        // Create a map of country codes to currencies
        const currencyMap: Record<string, string> = {}
        
        regions.forEach(region => {
          if (region.currency_code) {
            region.countries?.forEach(country => {
              if (country.iso_2) {
                currencyMap[country.iso_2.toLowerCase()] = region.currency_code.toUpperCase()
              }
            })
          }
        })
        
        setCurrencies(currencyMap)
        
        // Set current currency based on country code
        if (countryCode && currencyMap[countryCode as string]) {
          setCurrentCurrency(currencyMap[countryCode as string])
        } else {
          // Default to backend default currency if country not found
          setCurrentCurrency(DEFAULT_CURRENCY)
        }
      } catch (error) {
        console.error("Error fetching region data:", error)
        // Default to backend default currency if there's an error
        setCurrentCurrency(DEFAULT_CURRENCY)
      }
    }
    
    fetchRegionData()
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
    [DEFAULT_CURRENCY]: DEFAULT_COUNTRY,
    // Add more currency to country mappings as needed
  }
  
  const flagCountry = currencyToCountry[currentCurrency] || "us"
  
  return (
    <div className="flex items-center gap-1.5">
      <ReactCountryFlag 
        svg 
        countryCode={flagCountry}
        style={{ width: '16px', height: '16px' }}
      />
      <span className="text-sm font-medium">{currentCurrency}</span>
    </div>
  )
}

export default CurrencyDisplay 