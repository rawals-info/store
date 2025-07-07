"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ReactCountryFlag from "react-country-flag"

const CountryDebug = () => {
  const [userCountry, setUserCountry] = useState<string | null>(null)
  const [ipData, setIpData] = useState<any>(null)
  const [defaultCountry, setDefaultCountry] = useState<string | null>(null)
  const [storeInfo, setStoreInfo] = useState<any>(null)
  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const { countryCode } = useParams()
  
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/")
        const data = await response.json()
        setUserCountry(data.country_code?.toLowerCase() || null)
        setIpData(data)
      } catch (error) {
        console.error("Error detecting country:", error)
      }
    }
    
    const getCountryData = async () => {
      try {
        const response = await fetch("/api/countries")
        const data = await response.json()
        setDefaultCountry(data.defaultCountry || null)
        setAvailableCountries(data.countries || [])
      } catch (error) {
        console.error("Error getting country data:", error)
      }
    }
    
    const getStoreInfo = async () => {
      try {
        const response = await fetch("/api/store")
        const data = await response.json()
        setStoreInfo(data.store || null)
      } catch (error) {
        console.error("Error getting store info:", error)
      }
    }
    
    detectCountry()
    getCountryData()
    getStoreInfo()
  }, [])
  
  if (process.env.NODE_ENV === "production") {
    return null
  }
  
  return (
    <div className="fixed top-2 right-2 z-50 bg-white p-2 border border-gray-300 rounded shadow-md text-xs max-w-xs">
      <div className="flex items-center gap-1">
        <strong>Current country:</strong> 
        {countryCode && <ReactCountryFlag countryCode={countryCode as string} svg />} 
        {countryCode}
      </div>
      <div className="flex items-center gap-1">
        <strong>Default country:</strong> 
        {defaultCountry && <ReactCountryFlag countryCode={defaultCountry} svg />} 
        {defaultCountry}
      </div>
      <div className="flex items-center gap-1">
        <strong>Detected country:</strong> 
        {userCountry && <ReactCountryFlag countryCode={userCountry} svg />} 
        {userCountry}
      </div>
      <div className="text-xs truncate"><strong>IP data:</strong> {ipData ? JSON.stringify(ipData).substring(0, 50) + "..." : "Loading..."}</div>
      {storeInfo && (
        <div className="text-xs mt-1">
          <div><strong>Store:</strong> {storeInfo.name}</div>
          <div><strong>Default region:</strong> {storeInfo.default_region_id}</div>
        </div>
      )}
      <div className="mt-2">
        <div><strong>Available countries ({availableCountries.length}):</strong></div>
        <div className="flex flex-wrap gap-1 mt-1 max-h-24 overflow-y-auto">
          {availableCountries.map(code => (
            <a 
              key={code}
              href={`/${code}`}
              className="flex items-center gap-1 text-blue-500 hover:underline px-1.5 py-0.5 bg-gray-100 rounded"
            >
              <ReactCountryFlag countryCode={code} svg style={{ width: '12px', height: '12px' }} />
              {code}
            </a>
          ))}
          <a href="/" className="text-blue-500 hover:underline px-1.5 py-0.5 bg-gray-100 rounded">Default</a>
        </div>
      </div>
    </div>
  )
}

export default CountryDebug 