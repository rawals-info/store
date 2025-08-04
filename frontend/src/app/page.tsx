import { redirect } from "next/navigation"
import { getDefaultCountry } from "@lib/util/get-default-country"

export default async function RootPage() {
  // Determine default country code, fallback to 'in' for India
  let defaultCountryCode = 'in'
  try {
    defaultCountryCode = await getDefaultCountry()
  } catch (error) {
    console.error("Error determining default region:", error)
    // Fallback to India since this is a petha website
    defaultCountryCode = 'in'
  }
  
  // Redirect to the default country store
  redirect(`/${defaultCountryCode}`)
} 