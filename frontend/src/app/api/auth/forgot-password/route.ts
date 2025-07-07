import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  const backend = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
  const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  const res = await fetch(`${backend}/auth/customer/emailpass/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": apiKey as string,
    },
    body: JSON.stringify({
      identifier: email,
    }),
  })

  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
} 