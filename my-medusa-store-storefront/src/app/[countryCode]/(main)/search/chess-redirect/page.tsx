import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chess Products",
  description: "Redirecting to chess products",
}

export default function ChessRedirectPage({ params }: { params: { countryCode: string } }) {
  // Redirect to the categories page with 'chess' in the URL
  // This is a direct fallback in case the regular search doesn't work
  redirect(`/${params.countryCode}/categories/marble-chess-board`)
} 