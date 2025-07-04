"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { StoreRegion } from "@medusajs/types"
import { motion, AnimatePresence } from "framer-motion"
import { listRegions } from "@lib/data/regions"
import ReactCountryFlag from "react-country-flag"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CurrencyRedirect = () => {
  const [userCountry, setUserCountry] = useState<string | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [regions, setRegions] = useState<StoreRegion[]>([])
  const [currencies, setCurrencies] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const params = useParams<{ countryCode?: string }>()
  const currentCountry = params?.countryCode as string | undefined
  
  // Get all available regions/countries
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regionsData = await listRegions()
        setRegions(regionsData)
        
        // Create a map of country codes to currencies
        const currencyMap: Record<string, string> = {}
        regionsData.forEach(region => {
          if (region.currency_code) {
            region.countries?.forEach(country => {
              if (country.iso_2) {
                currencyMap[country.iso_2.toLowerCase()] = region.currency_code.toUpperCase()
              }
            })
          }
        })
        
        setCurrencies(currencyMap)
      } catch (error) {
        console.error("Error fetching regions:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRegions()
  }, [])
  
  // Detect user's country using geolocation API
  useEffect(() => {
    const detectCountry = async () => {
      try {
        // Use a free geolocation API
        const response = await fetch("https://ipapi.co/json/")
        const data = await response.json()
        
        if (data.country_code) {
          const detectedCountry = data.country_code.toLowerCase()
          setUserCountry(detectedCountry)
          
          // Check if the detected country has a different currency than current country
          const userCurrency = currencies[detectedCountry]
          const currentCurrency = currencies[currentCountry as string]
          
          // Get the default country and valid countries from the API
          const countryResponse = await fetch("/api/countries")
          const countryData = await countryResponse.json()
          const defaultCountry = countryData.defaultCountry
          const validCountries = countryData.countries || []
          
          // Only show popup if:
          // 1. We detected a country
          // 2. The detected country has a currency
          // 3. The current country has a different currency
          // 4. We haven't shown this popup before (check localStorage)
          // 5. The detected country is in the list of valid countries
          const hasSeenPopup = localStorage.getItem("currency_redirect_seen")
          const hasSeenPopupForCountry = localStorage.getItem(`currency_redirect_seen_${detectedCountry}`)
          
          if (
            detectedCountry && 
            userCurrency && 
            currentCurrency &&
            userCurrency !== currentCurrency &&
            validCountries.includes(detectedCountry) &&
            !hasSeenPopup &&
            !hasSeenPopupForCountry
          ) {
            setShowPopup(true)
          }
        }
      } catch (error) {
        console.error("Error detecting country:", error)
      }
    }
    
    if (!loading && Object.keys(currencies).length > 0) {
      detectCountry()
    }
  }, [loading, currencies, currentCountry, regions])
  
  const handleClose = () => {
    setShowPopup(false)
    // Remember that user has seen this popup
    localStorage.setItem("currency_redirect_seen", "true")
    
    // Also remember for this specific country
    if (userCountry) {
      localStorage.setItem(`currency_redirect_seen_${userCountry}`, "true")
    }
  }
  
  const handleStay = () => {
    handleClose()
  }
  
  if (!showPopup || !userCountry || !currencies[userCountry]) {
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
  
  const userCurrency = currencies[userCountry]
  const currentCurrency = currencies[currentCountry as string]
  const flagCountry = currencyToCountry[userCurrency] || userCountry
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed bottom-4 left-0 right-0 mx-4 sm:left-1/2 sm:right-auto sm:mx-0 sm:-translate-x-1/2 sm:transform z-50 max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="bg-luxury-ivory border border-luxury-gold/30 shadow-lg rounded-md p-4 mx-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <ReactCountryFlag 
                svg 
                countryCode={flagCountry} 
                style={{ width: '24px', height: '24px' }}
              />
              <h3 className="font-display text-luxury-charcoal text-lg">We detected your currency is {userCurrency}</h3>
            </div>
            <button 
              onClick={handleClose}
              className="text-luxury-charcoal/60 hover:text-luxury-gold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <p className="text-sm text-luxury-charcoal/80 mb-4">
            Would you like to view prices in your local currency ({userCurrency})?
          </p>
          
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button 
              onClick={handleStay}
              className="px-4 py-2 text-sm font-serif text-luxury-charcoal hover:text-luxury-gold transition-colors"
            >
              Stay with {currentCurrency}
            </button>
            
            <LocalizedClientLink
              href="/"
              className="px-4 py-2 text-sm font-serif bg-luxury-gold text-white rounded-sm hover:bg-luxury-gold/90 transition-colors"
              country={userCountry}
              onClick={handleClose}
              replace={true}
            >
              Switch to {userCurrency}
            </LocalizedClientLink>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CurrencyRedirect 