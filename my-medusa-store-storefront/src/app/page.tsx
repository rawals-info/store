import { redirect } from "next/navigation"
import { getDefaultCountry } from "@lib/util/get-default-country"

export default async function RootPage() {
  // Determine default country code, fallback to 'us'
  let defaultCountryCode = 'us'
  try {
    defaultCountryCode = await getDefaultCountry()
  } catch (error) {
    console.error("Error determining default region:", error)
  }
  
  // Redirect to the default country store
  redirect(`/${defaultCountryCode}`)
} 