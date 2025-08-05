"use client"

import Head from "next/head"
import { usePathname } from "next/navigation"

export default function CanonicalLink({ baseUrl }: { baseUrl: string }) {
  const pathname = usePathname()
  const href = `${baseUrl}${pathname === "/" ? "" : pathname}`
  return (
    <Head>
      <link rel="canonical" href={href} />
    </Head>
  )
} 