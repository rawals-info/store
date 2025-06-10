"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import React from "react"
import { normalizeCountryPath } from "@lib/util/normalize-country-path"

type LocalizedClientLinkProps = {
  children?: React.ReactNode
  href: string
  className?: string
  country?: string
  onClick?: () => void
  passHref?: true
  replace?: boolean
  [x: string]: any
}

/**
 * A client-side link component that automatically adds the country code to the URL
 * and allows overriding the country code with a prop
 */
const LocalizedClientLink = ({
  children,
  href,
  country,
  replace = false,
  ...props
}: LocalizedClientLinkProps) => {
  const { countryCode } = useParams()
  
  // Use provided country or fallback to the current country from params
  const code = country || (countryCode as string)
  
  // Handle absolute URLs (starting with http:// or https://)
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }
  
  // For empty hrefs, just go to the country root
  if (!href || href === '') {
    return (
      <Link href={`/${code}`} replace={replace} {...props}>
        {children}
      </Link>
    )
  }
  
  // If we're changing countries, always go to the root of that country
  if (country && country !== countryCode) {
    return (
      <Link href={`/${country}`} replace={true} {...props}>
        {children}
      </Link>
    )
  }
  
  // Normalize the path to handle country codes correctly
  const normalizedPath = normalizeCountryPath(href, code)
  
  return (
    <Link href={normalizedPath} replace={replace} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
