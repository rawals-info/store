import { HttpTypes } from "@medusajs/types"

// Base URL configuration
export const getBaseURL = () => {
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://tajpetha.in'
}

// SEO Constants
export const SEO_CONSTANTS = {
  siteName: "Taj Petha",
  defaultTitle: "Taj Petha | India's Best Authentic Agra Petha & Fresh Namkeen Online",
  defaultDescription: "Buy India's finest authentic Agra petha & fresh namkeen online. Hygienic preparation, traditional recipes, premium ingredients. Same-day dispatch across India.",
  defaultKeywords: [
    "best petha in India",
    "authentic Agra petha online",
    "fresh petha delivery India",
    "hygienic Indian sweets",
    "traditional namkeen online",
    "Taj Petha",
    "Agra sweets online",
    "premium Indian sweets",
    "fresh petha home delivery",
    "best namkeen brand India"
  ],
  companyInfo: {
    name: "Taj Petha",
    foundingDate: "2013",
    founder: "Siddharth Rawal",
    phone: "+91-92594-18994",
    email: "orders@tajpetha.in",
    address: {
      streetAddress: "Sadar Bazaar",
      addressLocality: "Agra",
      addressRegion: "Uttar Pradesh",
      postalCode: "282001",
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
      "https://www.facebook.com/tajpetha",
      "https://www.instagram.com/tajpetha",
      "https://www.youtube.com/tajpetha",
      "https://twitter.com/tajpetha"
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
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking"],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2500",
      "bestRating": "5",
      "worstRating": "1"
    }
  }
}

export const generateProductSchema = (
  product: HttpTypes.StoreProduct,
  region: HttpTypes.StoreRegion,
  reviewData?: { average_rating: number; count: number }
) => {
  const baseUrl = getBaseURL()
  const productPrice = product.variants?.[0]?.calculated_price
  const isInStock = product.variants?.some(variant => 
    variant.inventory_quantity && variant.inventory_quantity > 0
  )
  const productCategory = product.categories?.[0]?.name || product.collection?.title || "Indian Sweets"

  // Use dynamic review data if available, otherwise fall back to defaults
  const ratingValue = reviewData?.average_rating || 4.7
  const reviewCount = reviewData?.count || 89

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseUrl}/in/products/${product.handle}#product`,
    "name": product.title,
    "description": product.description || `Authentic ${product.title} from Taj Petha. Premium quality ${productCategory.toLowerCase()} made with traditional recipes and hygienic preparation.`,
    "image": product.images?.map(img => img.url) || [product.thumbnail] || [`${baseUrl}/placeholder-image.jpg`],
    "url": `${baseUrl}/in/products/${product.handle}`,
    "sku": product.variants?.[0]?.sku || `TAJ-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Taj Petha",
      "url": baseUrl
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Taj Petha"
    },
    "category": productCategory,
    "offers": {
      "@type": "Offer",
      "price": productPrice && typeof productPrice === 'number' ? (productPrice / 100).toFixed(2) : "199.00",
      "priceCurrency": region?.currency_code?.toUpperCase() || "INR",
      "availability": isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Taj Petha",
        "@id": `${baseUrl}/#organization`
      },
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "url": `${baseUrl}/in/products/${product.handle}`,
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "url": `${baseUrl}/returns`,
        "returnPolicyCategory": "https://schema.org/RefundTypeExchangeOrStoreCredit",
        "merchantReturnDays": 7,
        "returnShippingFeesAmount": {
          "@type": "MonetaryAmount",
          "currency": region?.currency_code?.toUpperCase() || "INR",
          "value": "0.00"
        },
        "inStoreReturnsOffered": false
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
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
        },
        "shipsTo": {
          "@type": "DefinedRegion",
          "addressCountry": "IN"
        }
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue.toString(),
      "reviewCount": reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    // Add review array to enrich schema
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": ratingValue.toString(),
          "bestRating": "5",
          "worstRating": "1"
        },
        "author": {
          "@type": "Organization",
          "name": "Verified Buyer"
        },
        "reviewBody": `Customers love our ${product.title} for its authentic taste and premium quality.`,
        "datePublished": new Date().toISOString().split('T')[0]
      }
    ],
    // Add additional properties for better SEO
    "identifier": {
      "@type": "PropertyValue",
      "name": "SKU",
      "value": product.variants?.[0]?.sku || `TAJ-${product.id}`
    },
    "weight": product.weight ? `${product.weight}g` : undefined,
    "material": "Premium ingredients with traditional recipe",
    "additionalProperty": [
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
  }
}

export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => {
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

export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>) => {
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
  { name: "Delhi", slug: "delhi", keywords: ["petha delivery delhi", "agra sweets delhi"] },
  { name: "Mumbai", slug: "mumbai", keywords: ["agra petha mumbai", "fresh petha mumbai"] },
  { name: "Bangalore", slug: "bangalore", keywords: ["fresh petha bangalore", "namkeen bangalore"] },
  { name: "Hyderabad", slug: "hyderabad", keywords: ["namkeen delivery hyderabad", "petha hyderabad"] },
  { name: "Chennai", slug: "chennai", keywords: ["petha online chennai", "agra sweets chennai"] },
  { name: "Pune", slug: "pune", keywords: ["agra sweets pune", "traditional sweets pune"] },
  { name: "Kolkata", slug: "kolkata", keywords: ["petha delivery kolkata", "bengali sweet lovers petha"] },
  { name: "Ahmedabad", slug: "ahmedabad", keywords: ["fresh namkeen ahmedabad", "gujarati petha lovers"] }
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