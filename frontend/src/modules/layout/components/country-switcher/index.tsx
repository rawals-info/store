"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { listRegions } from "@lib/data/regions"
import ReactCountryFlag from "react-country-flag"
import Link from "next/link"

const CountrySwitcher = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [countries, setCountries] = useState<Record<string, string>>({})
  const [defaultCountry, setDefaultCountry] = useState<string | null>(null)
  const { countryCode } = useParams() as { countryCode?: string }
  const codeParam = countryCode ?? ""

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regions = await listRegions()
        
        // Create a map of country codes to country names
        const countriesMap: Record<string, string> = {}
        regions.forEach(region => {
          region.countries?.forEach(country => {
            if (country.iso_2) {
              countriesMap[country.iso_2.toLowerCase()] = country.display_name || country.iso_2
            }
          })
        })
        
        setCountries(countriesMap)
      } catch (error) {
        console.error("Error fetching regions:", error)
      }
    }
    
    const getDefaultCountry = async () => {
      try {
        // Use the countries API endpoint to get both valid countries and default country
        const response = await fetch("/api/countries")
        const data = await response.json()
        setDefaultCountry(data.defaultCountry || null)
      } catch (error) {
        console.error("Error getting default country:", error)
      }
    }
    
    fetchRegions()
    getDefaultCountry()
  }, [])
  
  return (
    <div className="relative">
      <button
        className="flex items-center gap-1.5 text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ReactCountryFlag 
          svg 
          countryCode={codeParam} 
          style={{ width: '16px', height: '16px' }}
        />
        <span className="hidden md:block">{countries[codeParam] || codeParam}</span>
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
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md border border-gray-100 z-50">
          <div className="py-1">
            {Object.entries(countries).map(([code, name]) => (
              <Link
                key={code}
                href={`/${code}`}
                className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 ${
                  code === codeParam ? "bg-gray-50" : ""
                }`}
                onClick={() => setIsOpen(false)}
                replace={true}
              >
                <ReactCountryFlag 
                  svg 
                  countryCode={code} 
                  style={{ width: '16px', height: '16px' }}
                />
                <div className="flex items-center justify-between w-full">
                  <span>{name}</span>
                  {code === defaultCountry && (
                    <span className="text-xs text-gray-500">(Default)</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CountrySwitcher 