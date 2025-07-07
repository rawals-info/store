import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Force dynamic behavior since this route uses cookies
export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.set("_medusa_jwt", "", {
      maxAge: -1,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    )
  }
} 