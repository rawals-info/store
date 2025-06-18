import { redirect } from "next/navigation"
import { Metadata } from "next"
import { CATEGORIES } from "@lib/config/categories"

export const metadata: Metadata = {
  title: "Chess Products",
  description: "Redirecting to chess products",
}

export default function ChessRedirectPage({ params }: { params: { countryCode: string } }) {
  // Get the chess board category from our configuration
  // Or fall back to the hardcoded value if not yet in config
  const chessCategory = Object.values(CATEGORIES).find(cat => 
    cat.displayName.toLowerCase().includes("chess")
  ) || { handle: "marble-chess-board" }
  
  // Redirect to the categories page with the correct handle
  redirect(`/${params.countryCode}/categories/${chessCategory.handle}`)
} 