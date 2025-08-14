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
  countryCode: string,
  reviewData?: { average_rating: number; count: number },
  reviews?: import("../../types/global").StoreProductReview[]
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

  // Calculate price properly - handle both number and object types
  let finalPrice = "199.00"
  if (productPrice) {
    if (typeof productPrice === 'number') {
      finalPrice = (productPrice / 100).toFixed(2)
    } else if (productPrice.calculated_amount) {
      const amount = typeof productPrice.calculated_amount === 'number' 
        ? productPrice.calculated_amount 
        : Number(productPrice.calculated_amount)
      finalPrice = (amount / 100).toFixed(2)
    }
  }

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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseUrl}/${countryCode}/products/${product.handle}#product`,
    "name": product.title,
    "description": product.description || `Authentic ${product.title} from Taj Petha. Premium quality ${productCategory.toLowerCase()} made with traditional recipes and hygienic preparation.`,
    "image": product.images?.map(img => img.url) || [product.thumbnail] || [`${baseUrl}/placeholder-image.jpg`],
    "url": `${baseUrl}/${countryCode}/products/${product.handle}`,
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
      "price": finalPrice,
      "priceCurrency": region?.currency_code?.toUpperCase() || "INR",
      "availability": isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "priceValidUntil": priceValidUntil,
      "itemCondition": "https://schema.org/NewCondition",
      "url": `${baseUrl}/${countryCode}/products/${product.handle}`,
      "seller": {
        "@type": "Organization",
        "name": "Taj Petha",
        "@id": `${baseUrl}/#organization`
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "merchantReturnLink": `${baseUrl}/${countryCode}/returns`,
        "returnPolicyCategory": "https://schema.org/RefundTypeExchangeOrStoreCredit",
        "merchantReturnDays": 7,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn",
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
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "IN"
        }
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue.toFixed(1),
      "reviewCount": reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
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
            "datePublished": new Date().toISOString().split('T')[0],
            "itemReviewed": {
              "@type": "Product",
              "@id": `${baseUrl}/${countryCode}/products/${product.handle}#product`,
              "name": product.title
            }
          }))
        }
      : {}),
    // Add additional properties for better SEO
    "identifier": {
      "@type": "PropertyValue",
      "name": "SKU",
      "value": product.variants?.[0]?.sku || `TAJ-${product.id}`
    },
    ...(product.weight ? { "weight": `${product.weight}g` } : {}),
    "material": "Premium ingredients with traditional recipe",
    "additionalProperty": additionalProperty
  }

  return productSchema
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