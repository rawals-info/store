import { NextResponse } from "next/server"
import { sdk } from "@lib/config"

export async function GET() {
  try {
    const storeData = await sdk.client.fetch(`/store`, {
      method: "GET",
      cache: "no-store",
    })
    
    return NextResponse.json(storeData)
  } catch (error) {
    console.error("Error getting store info:", error)
    return NextResponse.json({ error: "Failed to fetch store information" }, { status: 500 })
  }
} 