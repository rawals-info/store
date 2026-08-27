import { Metadata } from "next"
import { notFound } from "next/navigation"
import { generateCityPageMetadata, MAJOR_INDIAN_CITIES } from "@lib/seo"
import { getHomepageProducts } from "@lib/data/products"
import { getActivePromotion } from "@lib/data/promotions"
import CityLandingClient from "@modules/city/templates/city-landing-client"

interface CityPageProps {
  params: Promise<{
    countryCode: string
    citySlug: string
  }>
  searchParams?: Promise<{
    product?: string
  }>
}

export const dynamic = "force-static"
export const revalidate = 86400

export async function generateStaticParams() {
  const countries = ["in"]
  return countries.flatMap((countryCode) =>
    MAJOR_INDIAN_CITIES.map((c) => ({ countryCode, citySlug: c.slug }))
  )
}

export async function generateMetadata({
  params,
  searchParams,
}: CityPageProps): Promise<Metadata> {
  const { citySlug, countryCode } = await params
  const sParams = searchParams ? await searchParams : {}
  const productType = sParams?.product || "petha"

  const city = MAJOR_INDIAN_CITIES.find((c) => c.slug === citySlug)
  if (!city) {
    return {
      title: "City Delivery Not Found | Taj Petha",
      description: "The requested city delivery page was not found.",
    }
  }

  const canonical = `https://tajpetha.in/${countryCode}/city/${citySlug}`
  const title = `Buy Original Agra Petha Online in ${city.name} | Fresh Sweets Home Delivery - Taj Petha`
  const description = `Order fresh original Agra Petha, famous Dalmoth, and Namkeen online in ${city.name}. Handcrafted daily in Agra, vacuum packed for 30-day freshness, express delivered to your doorstep. Free shipping on orders above ₹500.`

  return {
    title,
    description,
    keywords: city.keywords.concat([
      `buy petha online in ${city.name}`,
      `agra petha in ${city.name}`,
      `best petha to buy ${city.name}`,
      `${city.name} petha delivery`,
      `buy agra petha in ${city.name}`,
      `best sweet shop in ${city.name}`,
      `fresh dalmoth online ${city.name}`,
      `agra sweets home delivery ${city.name}`,
      `order petha online in ${city.name}`,
      `original agra petha home delivery ${city.name}`,
      `famous agra petha near me ${city.name}`,
      `kesar petha delivery ${city.name}`,
      `pan petha delivery ${city.name}`,
      `agra namkeen online ${city.name}`,
    ]),
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      images: [
        {
          url: "/hero_image.webp",
          width: 1200,
          height: 630,
          alt: `Authentic Agra Petha Express Delivery in ${city.name} - Taj Petha`,
        },
      ],
    },
    alternates: {
      canonical,
    },
  }
}

export default async function CityPage({ params }: CityPageProps) {
  const { citySlug, countryCode } = await params
  const city = MAJOR_INDIAN_CITIES.find((c) => c.slug === citySlug)

  if (!city) {
    notFound()
  }

  const { featuredProducts } = await getHomepageProducts(countryCode)
  const products = featuredProducts || []

  const activePromo = await getActivePromotion()

  // City-specific LocalBusiness Schema
  const citySchema = {
    "@context": "https://schema.org",
    "@type": "SweetShop",
    "@id": `https://tajpetha.in/${countryCode}/city/${citySlug}#sweetshop`,
    "name": `Taj Petha Express Delivery - ${city.name}`,
    "description": `Fresh authentic Agra Petha and sweets delivery across ${city.name} (${city.state}) with 24–48 hour express air cargo.`,
    "url": `https://tajpetha.in/${countryCode}/city/${citySlug}`,
    "image": "https://tajpetha.in/hero_image.webp",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city.name,
      "addressRegion": city.state,
      "addressCountry": "IN"
    },
    "areaServed": {
      "@type": "City",
      "name": city.name,
      "addressCountry": "IN"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `Agra Sweets Delivery in ${city.name}`,
      "itemListElement": products.map((prod: any, i: number) => {
        const rawAmount = Number(prod.variants?.[0]?.calculated_price?.calculated_amount || (prod.variants?.[0] as any)?.prices?.[0]?.amount || 0)
        const hasPromo = Boolean(activePromo && activePromo.discountPercent > 0 && rawAmount > 0)
        const discounted = hasPromo ? Math.round(rawAmount * (1 - activePromo!.discountPercent / 100) * 100) / 100 : rawAmount

        return {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": prod.title,
            "description": prod.description || `Fresh Agra ${prod.title} delivered to ${city.name}`,
            "url": `https://tajpetha.in/${countryCode}/products/${prod.handle}`
          },
          "price": discounted > 0 ? discounted.toFixed(2) : "0.00",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          ...(hasPromo ? { "description": `Save ${activePromo!.discountPercent}% with code ${activePromo!.code}` } : {}),
          "priceSpecification": hasPromo
            ? [
              {
                "@type": "UnitPriceSpecification",
                "priceType": "https://schema.org/ListPrice",
                "price": rawAmount.toFixed(2),
                "priceCurrency": "INR"
              },
              {
                "@type": "UnitPriceSpecification",
                "priceType": "https://schema.org/Discount",
                "price": discounted.toFixed(2),
                "priceCurrency": "INR",
                "description": `with code ${activePromo!.code}`
              }
            ]
            : {
              "@type": "PriceSpecification",
              "price": rawAmount.toFixed(2),
              "priceCurrency": "INR"
            }
        }
      })
    }
  }

  const cityFAQSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Do you deliver fresh authentic Agra Petha to ${city.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes! We deliver fresh, authentic Agra Petha across ${city.name} with same-day dispatch and Express Shipping.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the delivery time for sweets in ${city.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Delivery to ${city.name} takes ${city.deliveryTime}. Orders are freshly prepared and dispatched daily.`
        }
      },
      {
        "@type": "Question",
        "name": `Is there free delivery available in ${city.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, we offer free shipping across ${city.name} for all orders above ₹500.`
        }
      }
    ]
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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": city.name,
        "item": `https://tajpetha.in/${countryCode}/city/${citySlug}`
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(citySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityFAQSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <CityLandingClient
        city={city}
        allCities={MAJOR_INDIAN_CITIES}
        countryCode={countryCode}
        products={products}
      />
    </>
  )
}