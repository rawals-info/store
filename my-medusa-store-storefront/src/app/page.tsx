import { redirect } from "next/navigation"
import { getDefaultCountry } from "@lib/util/get-default-country"

export default async function RootPage() {
  try {
    // Get the default country code from the backend
    const defaultCountryCode = await getDefaultCountry()
    
    // Redirect to the default country store
    redirect(`/${defaultCountryCode}`)
  } catch (error) {
    console.error("Error determining default region:", error)
    // Fallback to US if there's an error
    redirect("/us")
  }
  
  // This will never be rendered
  return null
} 