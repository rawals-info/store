import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { token, password } = await req.json()
  const backend = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
  const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  const res = await fetch(`${backend}/auth/customer/emailpass/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": apiKey as string,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  })

  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
} 