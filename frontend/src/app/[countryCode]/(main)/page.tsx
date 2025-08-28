import { Metadata } from "next";

import { listCollections } from "@lib/data/collections";
import { getIndiaRegion } from "@lib/constants/india-region";
import { getCachedCategories } from "@modules/home/components/categories";
import { getHomepageProducts, getProductReviewSummary, getProductReviews } from "@lib/data/products";
import HomeClientWrapper from "@modules/home/components/home-client-wrapper";
import Link from "next/link"
import { MAJOR_INDIAN_CITIES } from "@lib/seo"

const baseMetadata: Metadata = {
  title: "Taj Petha | Authentic Agra Petha & Namkeen Online",
  description: "🍬 Buy India's finest authentic Agra petha & fresh namkeen online. ✅ Hygienic ✅ Traditional recipes ✅ Same-day dispatch ✅ Free shipping ₹500+",
  keywords: [
    "best petha in India",
    "authentic Agra petha online",
    "fresh petha delivery India",
    "hygienic Indian sweets online",
    "traditional namkeen buy online",
    "Taj Petha official store",
    "Agra sweets home delivery",
    "premium Indian sweets online",
    "fresh petha same day delivery",
    "best namkeen brand India online",
    "authentic petha Agra taste",
    "hygienic sweet shop online India"
  ],
  openGraph: {
    title: "Taj Petha | Authentic Agra Petha & Namkeen Online",
    description: "🍬 Buy India's finest authentic Agra petha & fresh namkeen online. Hygienic preparation, traditional recipes, same-day dispatch across India!",
    url: "https://tajpetha.in",
    images: [
      {
        url: "/hero_image.webp",
        width: 1200,
        height: 630,
        alt: "Taj Petha - India's Best Authentic Agra Petha Collection",
      }
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taj Petha | Authentic Agra Petha & Namkeen Online",
    description: "🍬 Buy India's finest authentic Agra petha & fresh namkeen online. Hygienic preparation, traditional recipes, same-day dispatch!",
    images: ["/hero_image.webp"],
  },
  other: {
    "geo.region": "IN-UP",
    "geo.placename": "Agra",
    "geo.position": "27.1767;78.0081",
    "ICBM": "27.1767, 78.0081",
    "DC.title": "Taj Petha - India's Best Authentic Agra Petha & Fresh Namkeen Online",
    "DC.description": "Premium authentic Agra petha and fresh namkeen online store with hygienic preparation and traditional recipes",
    "DC.subject": "Indian Sweets, Agra Petha, Namkeen, Traditional Sweets",
    "DC.creator": "Taj Petha",
    "DC.publisher": "Taj Petha",
    "DC.language": "en-IN",
    "DC.coverage": "India",
    "rating": "General",
    "distribution": "Global",
    "revisit-after": "1 days",
  }
}

export async function generateMetadata({ params }: { params: Promise<{ countryCode: string }> }): Promise<Metadata> {
  const { countryCode } = await params
  return {
    ...baseMetadata,
    robots: {
      index: true,
      follow: true,
      "max-image-preview": 'large',
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    alternates: {
      canonical: `https://tajpetha.in/${countryCode}`,
    },
  }
}

interface HomeProps {
  params: {
    countryCode: string;
  };
}

// Enhanced Product Schema for homepage featured products
const createHomepageSchema = (
  featuredProducts: any[],
  countryCode: string,
  reviewDataById: Record<string, { average_rating: number; count: number; review?: { rating: number; content: string; author: string; date: string } }>
) => {
  const baseUrl = "https://tajpetha.in";
  const priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]
  
  // Determine price (major units) for a product using its variants
  const computeProductPrice = (product: any): string => {
    try {
      const wantedCurrency = 'INR'
      const variants = Array.isArray(product?.variants) ? product.variants : []
      const amounts: number[] = []
      for (const v of variants as any[]) {
        const cp = v?.calculated_price
        if (cp && cp.currency_code && String(cp.currency_code).toUpperCase() === wantedCurrency && cp.calculated_amount !== undefined) {
          const amt = Number(cp.calculated_amount)
          if (!Number.isNaN(amt)) amounts.push(amt)
          continue
        }
        const matchInPrices = (v?.prices || []).find((p: any) => p?.currency_code && String(p.currency_code).toUpperCase() === wantedCurrency)
        if (matchInPrices && matchInPrices.amount !== undefined) {
          const amt = Number(matchInPrices.amount)
          if (!Number.isNaN(amt)) amounts.push(amt)
        }
      }
      let minorUnits: number | null = null
      if (amounts.length > 0) {
        minorUnits = Math.min(...amounts)
      } else {
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
        if (anyAmounts.length > 0) minorUnits = Math.min(...anyAmounts)
      }
      return typeof minorUnits === 'number' ? (minorUnits / 100).toFixed(2) : '0.00'
    } catch {
      return '0.00'
    }
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${baseUrl}/#store`,
    "name": "Taj Petha - India's Best Petha Store",
    "description": "Premium authentic Agra petha and fresh namkeen online store with hygienic preparation, traditional recipes, and same-day dispatch across India.",
    "url": baseUrl,
    "image": `${baseUrl}/hero_image.webp`,
    "logo": `${baseUrl}/logo.png`,
    "telephone": "+91-92594-18994",
    "email": "orders@tajpetha.in",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sadar Bazaar",
      "addressLocality": "Agra",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "282001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "27.1767",
      "longitude": "78.0081"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "09:00",
        "closes": "21:00"
      }
    ],
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking", "Razorpay", "PayPal"],
    "currenciesAccepted": "INR",
    "priceRange": "₹₹",
    "servesCuisine": ["Indian Sweets", "Traditional Namkeen", "Agra Specialties"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Taj Petha Product Catalog",
      "itemListElement": featuredProducts?.map((product, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "@id": `${baseUrl}/in/products/${product.handle}#product`,
          "name": product.title || `Premium ${product.category || 'Petha'}`,
          "description": product.description || `Authentic ${product.category || 'Agra petha'} made with traditional recipes and premium ingredients`,
          "image": product.thumbnail || `${baseUrl}/placeholder-image.jpg`,
          "url": `${baseUrl}/${countryCode}/products/${product.handle}`,
          "brand": {
            "@type": "Brand",
            "name": "Taj Petha"
          },
          "category": product.category || "Indian Sweets",
          ...(function () {
            const summary = reviewDataById[product.id]
            if (!summary || !(summary.count > 0)) return {}
            const agg: any = {
              "@type": "AggregateRating",
              "ratingValue": summary.average_rating.toFixed(2),
              "reviewCount": String(summary.count),
              "bestRating": "5",
              "worstRating": "1",
            }
            const rev = summary.review
            return {
              "aggregateRating": agg,
              ...(rev
                ? {
                    "review": [
                      {
                        "@type": "Review",
                        "reviewRating": {
                          "@type": "Rating",
                          "ratingValue": String(rev.rating),
                          "bestRating": "5",
                          "worstRating": "1",
                        },
                        "author": { "@type": "Person", "name": rev.author },
                        "reviewBody": rev.content,
                        "datePublished": rev.date,
                      },
                    ],
                  }
                : {}),
            }
          })(),
          // Ensure each Product has a direct Offer for rich-result eligibility
          "offers": {
            "@type": "Offer",
            "price": computeProductPrice(product),
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "priceValidUntil": priceValidUntil,
            "url": `${baseUrl}/${countryCode}/products/${product.handle}`,
            "seller": {
              "@id": `${baseUrl}/#organization`
            },
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": computeProductPrice(product),
              "priceCurrency": "INR"
            }
          }
        },
        "price": computeProductPrice(product),
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": `${baseUrl}/#organization`
        }
      })) || []
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Rajesh Kumar"
        },
        "reviewBody": "Outstanding quality petha! Tastes exactly like what you get in Agra. Fresh delivery and excellent packaging. Highly recommended for authentic taste.",
        "datePublished": "2024-01-20"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Meera Sharma"
        },
        "reviewBody": "Best online petha store! Hygienic packaging, fresh products, and quick delivery. The kesar petha is absolutely delicious. Will order again!",
        "datePublished": "2024-01-18"
      }
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Free Home Delivery",
          "description": "Free delivery across India for orders above ₹500"
        },
        "price": "0",
        "priceCurrency": "INR"
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Same Day Dispatch",
          "description": "Same day dispatch for all orders placed before 2 PM"
        }
      }
    ]
  };
};

// FAQ Schema for homepage
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What makes Taj Petha the best petha in India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Taj Petha uses authentic Agra recipes passed down through generations, premium ingredients, hygienic preparation methods, and same-day fresh dispatch. We've been serving 50,000+ satisfied customers since 2013 with consistently high quality."
      }
    },
    {
      "@type": "Question",
      "name": "Do you deliver fresh petha across India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! We provide fresh petha delivery across India with same-day dispatch for orders placed before 2 PM. Free shipping on orders above ₹500. We ensure freshness through proper packaging and quick delivery."
      }
    },
    {
      "@type": "Question",
      "name": "How do you ensure hygiene in petha preparation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We follow strict hygiene protocols including sanitized preparation areas, quality-checked ingredients, sealed packaging, and regular health inspections. Our modern facilities combine traditional recipes with contemporary hygiene standards."
      }
    },
    {
      "@type": "Question",
      "name": "What is your return and exchange policy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Due to the perishable nature of our products, we cannot accept returns on opened items. For transit damage, please contact us within 2 business days with order details and photos. We may offer replacement at our discretion after verification."
      }
    }
  ]
};

export default async function Home({ params }: HomeProps) {
  const { countryCode } = await params;

  const [collectionsResp, categories, homepageProducts] = await Promise.all([
    listCollections({ fields: "id, handle, title" }),
    getCachedCategories().catch(() => []),
    getHomepageProducts(countryCode).catch(() => ({ featuredProducts: [] })),
  ]);

  const region = getIndiaRegion();
  const { collections } = collectionsResp;
  const { featuredProducts } = homepageProducts;

  if (!collections || !region) {
    return null;
  }

  // Pull lightweight review summaries for the first few featured products to satisfy GSC product snippet enhancements on homepage entities
  const reviewDataById: Record<string, { average_rating: number; count: number; review?: { rating: number; content: string; author: string; date: string } }> = {}
  try {
    for (const p of (featuredProducts || []).slice(0, 8)) {
      try {
        const summary = await getProductReviewSummary(p.id)
        const reviewsResp = await getProductReviews({ productId: p.id, limit: 1, offset: 0 })
        const list: any[] = (reviewsResp as any).reviews || []
        reviewDataById[p.id] = {
          average_rating: typeof summary?.average_rating === 'number' ? summary.average_rating : (typeof (reviewsResp as any).average_rating === 'number' ? (reviewsResp as any).average_rating : 0),
          count: typeof summary?.count === 'number' ? summary.count : (typeof (reviewsResp as any).count === 'number' ? (reviewsResp as any).count : (Array.isArray(list) ? list.length : 0)),
          review: list && list.length > 0 ? {
            rating: Number(list[0]?.rating) || 0,
            content: String(list[0]?.content || ''),
            author: `${list[0]?.first_name || ''} ${list[0]?.last_name || ''}`.trim() || 'Customer',
            date: new Date(list[0]?.created_at || Date.now()).toISOString().split('T')[0],
          } : undefined,
        }
      } catch {}
    }
  } catch {}

  // Generate dynamic schema based on actual products (with review data)
  const homepageSchema = createHomepageSchema(featuredProducts, countryCode, reviewDataById);

  return (
    <>
      {/* Enhanced Schema Markup for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      
      <HomeClientWrapper
        featuredProducts={featuredProducts}
        categories={categories}
        region={region}
        countryCode={countryCode}
      />
      
      {/* Quick links to all products (SEO: reduce orphans) */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl font-serif text-luxury-charcoal mb-4">Explore All Products</h2>
            <div className="flex flex-wrap gap-3">
              {featuredProducts.slice(0, 50).map((p) => (
                <Link
                  key={p.id}
                  href={`/${countryCode}/products/${p.handle}`}
                  className="text-sm text-luxury-charcoal/80 hover:text-luxury-gold underline-offset-2 hover:underline"
                >
                  {p.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Major Cities we deliver to (SEO: give inlinks to city pages) */}
      <section className="py-10 bg-luxury-ivory">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-serif text-luxury-charcoal mb-4">Fresh Petha Delivery in Major Cities</h2>
          <div className="flex flex-wrap gap-3">
            {MAJOR_INDIAN_CITIES.slice(0, 16).map((c) => (
              <Link
                key={c.slug}
                href={`/${countryCode}/city/${c.slug}`}
                className="text-sm text-luxury-charcoal/80 hover:text-luxury-gold underline-offset-2 hover:underline"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* From our blog (SEO: add canonical inlinks to articles) */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-serif text-luxury-charcoal mb-4">From Our Blog</h2>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${countryCode}/blog/authentic-agra-petha-recipe`} className="text-sm text-luxury-charcoal/80 hover:text-luxury-gold underline-offset-2 hover:underline">Authentic Agra Petha Recipe</Link>
            <Link href={`/${countryCode}/blog/health-benefits-petha-namkeen`} className="text-sm text-luxury-charcoal/80 hover:text-luxury-gold underline-offset-2 hover:underline">Health Benefits of Petha & Namkeen</Link>
            <Link href={`/${countryCode}/blog/history-agra-petha-heritage`} className="text-sm text-luxury-charcoal/80 hover:text-luxury-gold underline-offset-2 hover:underline">History of Agra Petha</Link>
            <Link href={`/${countryCode}/blog/seasonal-namkeen-guide`} className="text-sm text-luxury-charcoal/80 hover:text-luxury-gold underline-offset-2 hover:underline">Seasonal Namkeen Guide</Link>
            <Link href={`/${countryCode}/blog/preservation-techniques-traditional-sweets`} className="text-sm text-luxury-charcoal/80 hover:text-luxury-gold underline-offset-2 hover:underline">Traditional Preservation Techniques</Link>
          </div>
        </div>
      </section>
    </>
  );
} 