import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { MAJOR_INDIAN_CITIES, CityDeliveryInfo } from "@lib/seo"
import { getHomepageProducts } from "@lib/data/products"
import CityDirectoryClient from "@modules/city/templates/city-directory-client"

export const dynamic = "force-static"
export const revalidate = 86400

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params
  const canonical = `https://tajpetha.in/${countryCode}/city`

  return {
    title: "Agra Petha & Dalmoth Express Delivery in 200+ Cities Across India | Taj Petha",
    description:
      "Order authentic GI-heritage Agra Petha, crunchy Dalmoth, and royal sweets delivered fresh to your city across India in 24–48 hours. 100% pure vegetarian, hygienic vacuum packaging.",
    keywords: [
      "agra petha delivery india",
      "buy petha online all cities",
      "petha home delivery",
      "authentic agra sweets express delivery",
      "order agra petha delhi mumbai bangalore hyderabad"
    ],
    openGraph: {
      title: "Agra Petha Express Delivery Across India | Taj Petha",
      description:
        "Fresh authentic Agra Petha & Dalmoth air-delivered to Delhi NCR, Mumbai, Bangalore, Hyderabad, Pune, Chennai, Kolkata and 200+ Indian cities.",
      url: canonical,
      type: "website",
      images: [
        {
          url: "/hero_image.webp",
          width: 1200,
          height: 630,
          alt: "Taj Petha Nationwide Express Delivery Across India",
        },
      ],
    },
    alternates: {
      canonical,
    },
  }
}

export default async function CityDirectoryPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const { featuredProducts } = await getHomepageProducts(countryCode)
  const products = featuredProducts || []

  // Directory Schema Markup
  const directorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Taj Petha Express Delivery Locations Across India",
    "description": "Authentic Agra Petha and sweets delivery network covering all major Indian cities with 24–48 hour express air shipping.",
    "url": `https://tajpetha.in/${countryCode}/city`,
    "provider": {
      "@type": "SweetShop",
      "name": "Taj Petha",
      "url": "https://tajpetha.in",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Agra",
        "addressRegion": "Uttar Pradesh",
        "addressCountry": "IN"
      }
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Major Cities Served by Taj Petha",
      "numberOfItems": MAJOR_INDIAN_CITIES.length,
      "itemListElement": MAJOR_INDIAN_CITIES.map((city, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": `Agra Petha Delivery in ${city.name}`,
        "url": `https://tajpetha.in/${countryCode}/city/${city.slug}`
      }))
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `https://tajpetha.in/${countryCode}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Delivery Locations",
        "item": `https://tajpetha.in/${countryCode}/city`
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(directorySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <CityDirectoryClient
        cities={MAJOR_INDIAN_CITIES}
        countryCode={countryCode}
        products={products}
      />
    </>
  )
}
