"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { StoreRegion } from "@medusajs/types"
import { motion, AnimatePresence } from "framer-motion"
import { listRegions } from "@lib/data/regions"
import ReactCountryFlag from "react-country-flag"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CountryRedirect = () => {
  const [userCountry, setUserCountry] = useState<string | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [regions, setRegions] = useState<StoreRegion[]>([])
  const [availableCountries, setAvailableCountries] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const { countryCode } = useParams()
  
  // Get all available regions/countries
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regionsData = await listRegions()
        setRegions(regionsData)
        
        // Create a map of country codes to region IDs
        const countries: Record<string, string> = {}
        regionsData.forEach(region => {
          region.countries?.forEach(country => {
            if (country.iso_2) {
              countries[country.iso_2.toLowerCase()] = country.display_name || country.iso_2
            }
          })
        })
        setAvailableCountries(countries)
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
          
          // Check if the detected country is actually available in our regions
          const countryHasRegion = regions.some(region => 
            region.countries?.some(country => 
              country.iso_2?.toLowerCase() === detectedCountry
            )
          )
          
          // Get the default country and valid countries from the API
          const countryResponse = await fetch("/api/countries")
          const countryData = await countryResponse.json()
          const defaultCountry = countryData.defaultCountry
          const validCountries = countryData.countries || []
          
          // Only show popup if:
          // 1. We detected a country
          // 2. The detected country is available in our regions
          // 3. The detected country is different from current country
          // 4. We haven't shown this popup before (check localStorage)
          // 5. The current country is not the default country
          // 6. The detected country is in the list of valid countries
          const hasSeenPopup = localStorage.getItem("country_redirect_seen")
          const hasSeenPopupForCountry = localStorage.getItem(`country_redirect_seen_${detectedCountry}`)
          
          if (
            detectedCountry && 
            availableCountries[detectedCountry] && 
            detectedCountry !== countryCode &&
            countryHasRegion &&
            countryCode !== defaultCountry && // Don't show popup if already on default country
            validCountries.includes(detectedCountry) && // Make sure the detected country is valid
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
    
    if (!loading && Object.keys(availableCountries).length > 0) {
      detectCountry()
    }
  }, [loading, availableCountries, countryCode, regions])
  
  const handleClose = () => {
    setShowPopup(false)
    // Remember that user has seen this popup
    localStorage.setItem("country_redirect_seen", "true")
    
    // Also remember for this specific country
    if (userCountry) {
      localStorage.setItem(`country_redirect_seen_${userCountry}`, "true")
    }
  }
  
  const handleStay = () => {
    handleClose()
  }
  
  if (!showPopup || !userCountry || !availableCountries[userCountry]) {
    return null
  }
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
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
                countryCode={userCountry} 
                style={{ width: '24px', height: '24px' }}
              />
              <h3 className="font-display text-luxury-charcoal text-lg">We noticed you're from {availableCountries[userCountry]}</h3>
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
            Would you like to view prices in your local currency?
          </p>
          
          <div className="flex justify-end gap-3">
            <button 
              onClick={handleStay}
              className="px-4 py-2 text-sm font-serif text-luxury-charcoal hover:text-luxury-gold transition-colors"
            >
              Stay with current currency
            </button>
            
            <LocalizedClientLink
              href="/"
              className="px-4 py-2 text-sm font-serif bg-luxury-gold text-white rounded-sm hover:bg-luxury-gold/90 transition-colors"
              country={userCountry}
              onClick={handleClose}
              replace={true}
            >
              Switch to local currency
            </LocalizedClientLink>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CountryRedirect 