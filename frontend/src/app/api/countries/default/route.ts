import { NextResponse } from "next/server"
import { getDefaultCountry } from "@lib/util/get-default-country"

export async function GET() {
  try {
    const defaultCountry = await getDefaultCountry()
    
    return NextResponse.json({ defaultCountry })
  } catch (error) {
    console.error("Error getting default country:", error)
    return NextResponse.json({ defaultCountry: "us" }, { status: 500 })
  }
} 