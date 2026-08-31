import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    
    if (!body || !body.secret || body.secret !== (process.env.REVALIDATE_SECRET || "supersecret")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rawTags = body.tags || body.tag
    const tags: string[] = Array.isArray(rawTags) ? rawTags : [rawTags].filter(Boolean)

    if (!tags.length) {
      return NextResponse.json({ error: "No tags provided" }, { status: 400 })
    }

    for (const tag of tags) {
      if (typeof tag === "string" && tag.trim()) {
        revalidateTag(tag.trim())
      }
    }

    return NextResponse.json({ revalidated: true, tags, timestamp: Date.now() })
  } catch (error: any) {
    console.error("[POST /api/revalidate] Error:", error)
    return NextResponse.json({ error: error.message || "Failed to revalidate" }, { status: 500 })
  }
}
