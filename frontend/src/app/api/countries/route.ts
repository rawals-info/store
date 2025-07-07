import { NextResponse } from "next/server"
import { getValidCountries } from "@lib/util/get-valid-countries"
import { getDefaultCountry } from "@lib/util/get-default-country"

export async function GET() {
  try {
    const [validCountries, defaultCountry] = await Promise.all([
      getValidCountries(),
      getDefaultCountry()
    ])
    
    return NextResponse.json({ 
      countries: validCountries,
      defaultCountry
    })
  } catch (error) {
    console.error("Error getting countries:", error)
    return NextResponse.json({ 
      error: "Failed to fetch countries",
      countries: [],
      defaultCountry: "us"
    }, { status: 500 })
  }
} 