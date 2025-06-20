import { sdk } from "@lib/config"
import { getCacheTag, getAuthHeaders } from "@lib/data/cookies"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

// Force dynamic behavior since this route uses cookies
export const dynamic = "force-dynamic"

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const headers = await getAuthHeaders()
    
    if (!Object.keys(headers).length) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const customer = await sdk.store.customer.update(body, {}, headers)
    
    // Revalidate cache
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    return NextResponse.json({ success: true, customer })
  } catch (error: unknown) {
    console.error("Error updating customer:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    )
  }
} 