import { HttpTypes } from "@medusajs/types"

// Base URL configuration
export const getBaseURL = () => {
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://tajpetha.in'
}

// SEO Constants
export const SEO_CONSTANTS = {
  siteName: "Taj Petha",
  defaultTitle: "Buy Authentic Agra Petha Online | Fresh Namkeen | Taj Petha India",
  defaultDescription: "Buy authentic Agra petha online at India's #1 trusted store. Fresh, hygienic, traditional recipes. Same-day dispatch, free delivery ₹500+. Order now!",
  defaultKeywords: [
    // High-intent commercial keywords
    "buy petha online",
    "buy agra petha",
    "order petha online",
    "agra petha online",
    "authentic petha buy",
    // Brand keywords
    "taj petha",
    "taj petha agra",
    "taj petha online",
    // Location keywords
    "best petha in India",
    "authentic Agra petha online",
    "fresh petha delivery India",
    // Product keywords
    "buy dry petha online",
    "buy kesar petha online",
    "buy namkeen online",
    // Quality keywords
    "hygienic Indian sweets",
    "traditional namkeen online",
    "premium petha online",
    // Delivery keywords
    "petha home delivery",
    "petha same day delivery"
  ],
  companyInfo: {
    name: "Taj Petha",
    foundingDate: "2013",
    founder: "Siddharth Rawal",
    phone: "+91-92594-18994",
    email: "orders@tajpetha.in",
    address: {
      streetAddress: "Pratap Nagar",
      addressLocality: "Agra",
      addressRegion: "Uttar Pradesh",
      postalCode: "282010",
      addressCountry: "IN"
    },
    geo: {
      latitude: "27.1767",
      longitude: "78.0081"
    }
  }
}

// Schema Markup Generators
export const generateOrganizationSchema = () => {
  const baseUrl = getBaseURL()
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": SEO_CONSTANTS.companyInfo.name,
    "alternateName": ["Taj Petha Store", "India's Best Petha"],
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/logo.png`,
      "width": "300",
      "height": "100"
    },
    "image": `${baseUrl}/hero_image.webp`,
    "description": SEO_CONSTANTS.defaultDescription,
    "foundingDate": SEO_CONSTANTS.companyInfo.foundingDate,
    "founder": {
      "@type": "Person",
      "name": SEO_CONSTANTS.companyInfo.founder
    },
    "address": {
      "@type": "PostalAddress",
      ...SEO_CONSTANTS.companyInfo.address
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": SEO_CONSTANTS.companyInfo.phone,
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["Hindi", "English"]
      }
    ],
    "sameAs": [
      "https://www.facebook.com/tajpethaagra",
      "https://www.instagram.com/tajpethaagra",
      "https://www.youtube.com/tajpethaagra",
      "https://twitter.com/tajpethaagra"
    ]
  }
}

export const generateWebsiteSchema = () => {
  const baseUrl = getBaseURL()
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "url": baseUrl,
    "name": SEO_CONSTANTS.siteName,
    "alternateName": [
      "Taj Petha Store",
      "Taj Petha Official",
      "Taj Petha India"
    ],
    "description": SEO_CONSTANTS.defaultDescription,
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    ],
    "inLanguage": "en-IN"
  }
}

export const generateLocalBusinessSchema = () => {
  const baseUrl = getBaseURL()
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#localbusiness`,
    "name": SEO_CONSTANTS.companyInfo.name,
    "image": `${baseUrl}/hero_image.webp`,
    "description": "India's premier authentic Agra petha and fresh namkeen online store with same-day dispatch and hygienic preparation.",
    "url": baseUrl,
    "telephone": SEO_CONSTANTS.companyInfo.phone,
    "address": {
      "@type": "PostalAddress",
      ...SEO_CONSTANTS.companyInfo.address
    },
    "geo": {
      "@type": "GeoCoordinates",
      ...SEO_CONSTANTS.companyInfo.geo
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "09:00",
        "closes": "21:00"
      }
    ],
    "servesCuisine": ["Indian Sweets", "Traditional Namkeen", "Agra Specialties"],
    "priceRange": "₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking"]
  }
}

export const generateProductSchema = (
  product: HttpTypes.StoreProduct,
  region: HttpTypes.StoreRegion,
  countryCode: string,
  reviewData?: { average_rating: number; count: number },
  reviews?: import("../../types/global").StoreProductReview[]
) => {
  const baseUrl = getBaseURL()
  const toAbsoluteUrl = (url: string) =>
    url && (url.startsWith("http://") || url.startsWith("https://"))
      ? url
      : `${baseUrl}${url?.startsWith("/") ? "" : "/"}${url || ""}`
  // Determine the most accurate price in region currency from variants
  const findBestVariantAmountMinorUnits = () => {
    const variants = Array.isArray(product.variants) ? product.variants : []
    const wantedCurrency = (region?.currency_code || "INR").toUpperCase()

    // Collect amounts that match the wanted currency exactly
    const matchingAmounts: number[] = []
    for (const v of variants as any[]) {
      const cp = v?.calculated_price
      if (cp && cp.currency_code && cp.currency_code.toUpperCase() === wantedCurrency) {
        const amt = Number(cp.calculated_amount)
        if (!Number.isNaN(amt)) matchingAmounts.push(amt)
        continue
      }
      const prices = v?.prices || []
      const matchInPrices = prices.find((p: any) => p?.currency_code && p.currency_code.toUpperCase() === wantedCurrency)
      if (matchInPrices && matchInPrices.amount !== undefined) {
        const amt = Number(matchInPrices.amount)
        if (!Number.isNaN(amt)) matchingAmounts.push(amt)
      }
    }

    if (matchingAmounts.length > 0) {
      return Math.min(...matchingAmounts)
    }

    // Fallback: any calculated_amount across variants regardless of currency
    const anyAmounts: number[] = []
    for (const v of variants as any[]) {
      const cp = v?.calculated_price
      if (cp && cp.calculated_amount !== undefined) {
        const amt = Number(cp.calculated_amount)
        if (!Number.isNaN(amt)) anyAmounts.push(amt)
      } else if (Array.isArray(v?.prices) && v.prices.length > 0) {
        const amt = Number(v.prices[0]?.amount)
        if (!Number.isNaN(amt)) anyAmounts.push(amt)
      }
    }
    return anyAmounts.length > 0 ? Math.min(...anyAmounts) : null
  }

  const amountMinorUnits = findBestVariantAmountMinorUnits()
  // Align stock logic with storefront/cart behavior:
  // In stock if ANY variant either doesn't manage inventory, allows backorder,
  // or has a positive inventory quantity.
  const isInStock = (product.variants || []).some((variant: any) => {
    if (!variant) return false
    if (variant.allow_backorder) return true
    if (variant.manage_inventory === false) return true
    const qty = typeof variant.inventory_quantity === 'number' ? variant.inventory_quantity : 0
    return qty > 0
  })
  const productCategory = product.categories?.[0]?.name || product.collection?.title || "Indian Sweets"
  const primaryVariant = product.variants?.[0]

  // Use dynamic review data if available; avoid fake defaults that can trigger warnings
  const ratingValue = typeof reviewData?.average_rating === 'number' ? reviewData.average_rating : 0
  const reviewCount = typeof reviewData?.count === 'number' ? reviewData.count : 0

  // Convert to major units for schema.org price
  const finalPrice = typeof amountMinorUnits === 'number' && !Number.isNaN(amountMinorUnits)
    ? Number(amountMinorUnits).toFixed(2)
    : "0.00"

  // Format priceValidUntil properly (30 days from now)
  const priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Build additionalProperty from metadata (optional)
  const metadata: Record<string, any> | undefined = (product as any)?.metadata
  const additionalProperty: Array<any> = [
    {
      "@type": "PropertyValue",
      "name": "Freshness",
      "value": "Made fresh daily"
    },
    {
      "@type": "PropertyValue",
      "name": "Packaging",
      "value": "Hygienic packaging"
    }
  ]

  if (metadata && typeof metadata === 'object') {
    const mdMap: Array<{ key: string; name: string }> = [
      { key: 'shelf_life', name: 'Shelf life' },
      { key: 'ingredients', name: 'Ingredients' },
      { key: 'packaging', name: 'Packaging' },
      { key: 'origin', name: 'Origin' },
      { key: 'storage', name: 'Storage instructions' },
      { key: 'serving', name: 'Serving suggestions' },
      { key: 'weight_grams', name: 'Weight (g)' },
      { key: 'flavor', name: 'Flavor' },
    ]

    for (const { key, name } of mdMap) {
      const val = (metadata as any)[key]
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        additionalProperty.push({
          "@type": "PropertyValue",
          "name": name,
          "value": String(val)
        })
      }
    }
  }

  const rawImages: string[] = (product.images?.map(img => img.url) || (product.thumbnail ? [product.thumbnail] : [])) as string[]
  const imageUrls: string[] = (rawImages && rawImages.length > 0)
    ? rawImages.map(toAbsoluteUrl)
    : [`${baseUrl}/placeholder-image.jpg`]

  const sku = primaryVariant?.sku || `TAJ-${product.id}`

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseUrl}/${countryCode}/products/${product.handle}#product`,
    "name": product.title,
    "description": product.description || `Authentic ${product.title} from Taj Petha. Premium quality ${productCategory.toLowerCase()} made with traditional recipes and hygienic preparation.`,
    "image": imageUrls,
    "url": `${baseUrl}/${countryCode}/products/${product.handle}`,
    "sku": sku,
    ...(primaryVariant?.barcode ? { "gtin": String(primaryVariant.barcode) } : {}),
    "mpn": sku,
    "brand": {
      "@type": "Brand",
      "name": "Taj Petha",
      "url": baseUrl
    },
    "category": productCategory,
    "offers": {
      "@type": "Offer",
      "price": finalPrice,
      "priceCurrency": region?.currency_code?.toUpperCase() || "INR",
      "availability": isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "validFrom": new Date().toISOString().split('T')[0],
      "priceValidUntil": priceValidUntil,
      "itemCondition": "https://schema.org/NewCondition",
      "url": `${baseUrl}/${countryCode}/products/${product.handle}`,
      "seller": {
        "@type": "Organization",
        "name": "Taj Petha",
        "@id": `${baseUrl}/#organization`
      },
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": finalPrice,
        "priceCurrency": region?.currency_code?.toUpperCase() || "INR"
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "IN",
        "merchantReturnLink": `${baseUrl}/${countryCode}/returns`,
        "url": `${baseUrl}/${countryCode}/returns`,
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 7,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn",
        "refundType": "https://schema.org/StoreCreditRefund",
        "inStoreReturnsOffered": false
      },

      "shippingDetails": [
        {
          "@type": "OfferShippingDetails",
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "IN"
          },
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0.00",
            "currency": region?.currency_code?.toUpperCase() || "INR"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 1,
              "unitCode": "d"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 1,
              "maxValue": 4,
              "unitCode": "d"
            }
          }
        }
      ]
    },
    ...(reviewCount > 0 && ratingValue > 0
      ? {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": ratingValue.toFixed(1),
          "reviewCount": reviewCount.toString(),
          "bestRating": "5",
          "worstRating": "1"
        }
      }
      : {}),
    // Add review array with proper itemReviewed if provided
    ...(reviews && reviews.length > 0
      ? {
        "review": reviews.slice(0, 10).map(r => ({
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": r.rating.toString(),
            "bestRating": "5",
            "worstRating": "1"
          },
          "author": {
            "@type": "Person",
            "name": `${r.first_name} ${r.last_name}`.trim() || "Anonymous"
          },
          "name": r.title || `${product.title} review`,
          "reviewBody": r.content,
          "datePublished": new Date().toISOString().split('T')[0]
        }))
      }
      : {}),
    // Add additional properties for better SEO
    ...(product.weight ? { "weight": `${product.weight}g` } : {}),
    "material": "Premium ingredients with traditional recipe",
    "additionalProperty": additionalProperty
  }

  return productSchema
}

export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string, url: string }>) => {
  const baseUrl = getBaseURL()
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${baseUrl}${crumb.url}`
    }))
  }
}

export const generateFAQSchema = (faqs: Array<{ question: string, answer: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

// Meta Tag Generators
export const generateMetaTitle = (pageTitle: string, includeDefault = true) => {
  if (includeDefault) {
    return `${pageTitle} | ${SEO_CONSTANTS.siteName} - India's Premium Sweet Store`
  }
  return pageTitle
}

export const generateMetaDescription = (customDescription?: string) => {
  return customDescription || SEO_CONSTANTS.defaultDescription
}

export const generateKeywords = (pageKeywords: string[] = []) => {
  return [...SEO_CONSTANTS.defaultKeywords, ...pageKeywords]
}

// URL Generators for SEO
export const generateCanonicalUrl = (path: string) => {
  const baseUrl = getBaseURL()
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export const generateOpenGraphUrl = (path: string) => {
  return generateCanonicalUrl(path)
}

// City-specific SEO helpers
export const MAJOR_INDIAN_CITIES = [
  { name: "Delhi", slug: "delhi", keywords: ["buy petha delhi", "agra petha delivery delhi", "order petha online delhi", "petha home delivery delhi ncr"] },
  { name: "Mumbai", slug: "mumbai", keywords: ["buy agra petha mumbai", "fresh petha mumbai", "order petha online mumbai", "petha delivery mumbai"] },
  { name: "Bangalore", slug: "bangalore", keywords: ["buy petha bangalore", "agra petha online bangalore", "petha delivery bangalore", "namkeen bangalore"] },
  { name: "Hyderabad", slug: "hyderabad", keywords: ["buy petha hyderabad", "order petha online hyderabad", "agra sweets delivery hyderabad"] },
  { name: "Chennai", slug: "chennai", keywords: ["buy petha online chennai", "agra sweets chennai", "petha delivery chennai"] },
  { name: "Pune", slug: "pune", keywords: ["buy agra petha pune", "order petha pune", "traditional sweets pune"] },
  { name: "Kolkata", slug: "kolkata", keywords: ["buy petha kolkata", "agra petha delivery kolkata", "order petha online kolkata"] },
  { name: "Ahmedabad", slug: "ahmedabad", keywords: ["buy petha ahmedabad", "fresh namkeen ahmedabad", "agra petha delivery ahmedabad"] }
]

export const generateCityPageMetadata = (citySlug: string, productType: string = "petha") => {
  const city = MAJOR_INDIAN_CITIES.find(c => c.slug === citySlug)
  if (!city) return null

  const title = `Fresh ${productType.charAt(0).toUpperCase() + productType.slice(1)} Delivery in ${city.name} | Taj Petha`
  const description = `Order authentic Agra ${productType} online in ${city.name}. Hygienic preparation, traditional recipes, same-day dispatch. Free delivery above ₹500 in ${city.name}.`
  const keywords = city.keywords.concat([
    `${productType} ${city.slug}`,
    `authentic agra ${productType} ${city.slug}`,
    `fresh ${productType} delivery ${city.slug}`,
    `hygienic ${productType} ${city.slug}`
  ])

  return {
    title,
    description,
    keywords,
    canonical: `/petha-delivery-${city.slug}`
  }
}

// SEO-friendly slug generator
export const generateSEOSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Analytics and tracking helpers
export const generateGTMDataLayer = (
  event: string,
  data: Record<string, any> = {}
) => {
  return {
    event,
    ...data,
    timestamp: new Date().toISOString(),
    page_title: document?.title || '',
    page_location: window?.location?.href || ''
  }
}

export default {
  SEO_CONSTANTS,
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateLocalBusinessSchema,
  generateProductSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateMetaTitle,
  generateMetaDescription,
  generateKeywords,
  generateCanonicalUrl,
  generateCityPageMetadata,
  generateSEOSlug,
  generateGTMDataLayer,
  getBaseURL
} 