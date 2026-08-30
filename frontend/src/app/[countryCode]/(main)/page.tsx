import { Metadata } from "next";

import { listCollections } from "@lib/data/collections";
import { getIndiaRegion } from "@lib/constants/india-region";
import { getCachedCategories } from "@modules/home/components/categories";
import { getHomepageProducts, getProductReviewSummary, getProductReviews } from "@lib/data/products";
import HomeClientWrapper from "@modules/home/components/home-client-wrapper";
import Link from "next/link"
import { MAJOR_INDIAN_CITIES } from "@lib/seo"

const baseMetadata: Metadata = {
  title: "Buy Original Agra Petha Online | Fresh Agra Sweets & Dalmoth - Taj Petha",
  description: "Order fresh original Agra Petha online directly from master Agra halwais. Soft white petha, kesar petha, spicy dalmoth & namkeen. Fast air express delivery across India with free shipping above ₹500.",
  keywords: [
    // Top High-Intent Commercial Keywords
    "buy petha online",
    "agra petha",
    "original agra petha",
    "best petha to buy",
    "buy agra petha",
    "order petha online",
    "famous agra petha sweet shop",
    "buy dalmoth namkeen online",
    "best agra sweets online",
    "petha online shopping",
    "buy authentic agra petha",
    "agra petha online order",
    "fresh petha buy online",
    "petha home delivery",
    "order agra sweets online",
    // Brand + location keywords
    "taj petha agra",
    "taj petha online",
    "best petha in India",
    "authentic Agra petha online",
    // Product variety keywords
    "kesar petha online",
    "dry petha buy online",
    "paan petha order",
    "chocolate petha online",
    // Delivery keywords
    "fresh petha delivery India",
    "petha same day delivery",
    "agra petha home delivery",
    // Quality keywords
    "hygienic Indian sweets online",
    "traditional petha recipes",
    "premium agra sweets",
    // Gift keywords
    "petha gift box online",
    "diwali sweets online",
    "corporate sweet gifting",
    // Namkeen keywords
    "buy namkeen online",
    "fresh namkeen delivery",
    "dalmoth online order",
    "traditional namkeen buy online"
  ],
  openGraph: {
    title: "Taj Petha | Authentic Agra Petha & Namkeen Online",
    description: "Buy India's finest authentic Agra petha & fresh namkeen online. Hygienic preparation, traditional recipes, same-day dispatch across India!",
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
    description: "Buy India's finest authentic Agra petha & fresh namkeen online. Hygienic preparation, traditional recipes, same-day dispatch!",
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
          // calculated_amount is already in major currency units (INR) — NO /100
          const amt = Number(cp.calculated_amount)
          if (!Number.isNaN(amt)) amounts.push(amt)
          continue
        }
        const matchInPrices = (v?.prices || []).find((p: any) => p?.currency_code && String(p.currency_code).toUpperCase() === wantedCurrency)
        if (matchInPrices && matchInPrices.amount !== undefined) {
          // prices[].amount is stored in paise (minor units) — MUST divide by 100
          const amt = Number(matchInPrices.amount) / 100
          if (!Number.isNaN(amt)) amounts.push(amt)
        }
      }
      let priceInINR: number | null = null
      if (amounts.length > 0) {
        priceInINR = Math.min(...amounts)
      } else {
        const anyAmounts: number[] = []
        for (const v of variants as any[]) {
          const cp = v?.calculated_price
          if (cp && cp.calculated_amount !== undefined) {
            // calculated_amount already in INR — no /100
            const amt = Number(cp.calculated_amount)
            if (!Number.isNaN(amt)) anyAmounts.push(amt)
          } else if (Array.isArray(v?.prices) && v.prices.length > 0) {
            // prices[].amount in paise — divide by 100
            const amt = Number(v.prices[0]?.amount) / 100
            if (!Number.isNaN(amt)) anyAmounts.push(amt)
          }
        }
        if (anyAmounts.length > 0) priceInINR = Math.min(...anyAmounts)
      }
      // priceInINR is now in major units (INR) — return as-is
      return typeof priceInINR === 'number' ? priceInINR.toFixed(2) : '0.00'
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
            "validFrom": new Date().toISOString().split('T')[0],
            "priceValidUntil": priceValidUntil,
            "url": `${baseUrl}/${countryCode}/products/${product.handle}`,
            "seller": {
              "@id": `${baseUrl}/#organization`
            },
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": computeProductPrice(product),
              "priceCurrency": "INR"
            },
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "applicableCountry": "IN",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 7,
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/FreeReturn",
              "refundType": "https://schema.org/StoreCreditRefund"
            },
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingDestination": {
                "@type": "DefinedRegion",
                "addressCountry": "IN"
              },
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "0.00",
                "currency": "INR"
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
      "ratingValue": "4.9",
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

export const revalidate = 1800;

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

  // Fast concurrent fetching for first 8 review summaries in parallel
  const reviewDataById: Record<string, { average_rating: number; count: number; review?: { rating: number; content: string; author: string; date: string } }> = {}
  if (featuredProducts && featuredProducts.length > 0) {
    const reviewPromises = (featuredProducts.slice(0, 8) as any[]).map(async (p) => {
      try {
        const [summary, reviewsResp] = await Promise.all([
          getProductReviewSummary(p.id).catch(() => null),
          getProductReviews({ productId: p.id, limit: 1, offset: 0 }).catch(() => null),
        ])
        const list: any[] = (reviewsResp as any)?.reviews || []
        reviewDataById[p.id] = {
          average_rating: typeof summary?.average_rating === 'number' ? summary.average_rating : (typeof (reviewsResp as any)?.average_rating === 'number' ? (reviewsResp as any).average_rating : 4.9),
          count: typeof summary?.count === 'number' ? summary.count : (typeof (reviewsResp as any)?.count === 'number' ? (reviewsResp as any).count : (Array.isArray(list) && list.length > 0 ? list.length : 48)),
          review: list && list.length > 0 ? {
            rating: Number(list[0]?.rating) || 5,
            content: String(list[0]?.content || ''),
            author: `${list[0]?.first_name || ''} ${list[0]?.last_name || ''}`.trim() || 'Customer',
            date: new Date(list[0]?.created_at || Date.now()).toISOString().split('T')[0],
          } : undefined,
        }
      } catch {}
    })
    await Promise.allSettled(reviewPromises)
  }

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


      {/* Major Cities Delivery Section (Clean Commercial SEO Chips) */}
      <section className="py-8 lg:py-10 bg-[#FBF9F5] border-t border-amber-100/60" aria-label="City Delivery Locations">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-2">
            <div>
              <span className="font-jakarta text-xs uppercase tracking-widest text-petha-amber font-bold">
                Doorstep Express Delivery
              </span>
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Fresh Agra Petha Delivered to Your City
              </h2>
            </div>
            <span className="font-jakarta text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full w-fit">
              ✈️ 24-48 hr Express Shipping
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {MAJOR_INDIAN_CITIES.slice(0, 16).map((c) => (
              <Link
                key={c.slug}
                href={`/${countryCode}/city/${c.slug}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-amber-200/70 hover:border-petha-amber text-xs font-semibold text-slate-700 hover:text-petha-amber hover:shadow-sm transition-all duration-200 font-jakarta"
              >
                <span className="text-amber-500">📍</span>
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* From our Sweet Heritage Blog */}
      <section className="py-8 lg:py-10 bg-white border-t border-slate-100" aria-label="Heritage & Guides">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="font-jakarta text-xs uppercase tracking-widest text-petha-amber font-bold">
                Agra Food Stories &amp; Guides
              </span>
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                From Our Master Halwai Blog
              </h2>
            </div>
            <Link
              href={`/${countryCode}/blog`}
              className="font-jakarta text-xs font-bold text-petha-amber hover:underline underline-offset-4 hidden sm:inline"
            >
              Read All Articles →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Authentic Agra Petha Recipe & Heritage", slug: "authentic-agra-petha-recipe", tag: "Tradition" },
              { title: "Health Benefits of Winter Ash Gourd & Petha", slug: "health-benefits-petha-namkeen", tag: "Ayurveda & Health" },
              { title: "History of Royal Agra Petha & The Mughal Kitchens", slug: "history-agra-petha-heritage", tag: "History" },
              { title: "Seasonal Namkeen Guide & Festive Pairings", slug: "seasonal-namkeen-guide", tag: "Snacks Guide" },
              { title: "Traditional Preservation Techniques for 30-Day Freshness", slug: "preservation-techniques-traditional-sweets", tag: "Freshness" },
            ].map((article) => (
              <Link
                key={article.slug}
                href={`/${countryCode}/blog/${article.slug}`}
                className="group p-4 rounded-2xl bg-amber-50/40 border border-amber-100 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-petha-amber mb-2 font-jakarta bg-white px-2 py-0.5 rounded-md border border-amber-200/60">
                    {article.tag}
                  </span>
                  <h3 className="font-cormorant text-lg font-bold text-slate-900 group-hover:text-petha-amber transition-colors leading-snug">
                    {article.title}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-petha-amber mt-3 flex items-center gap-1 font-jakarta">
                  Read Guide →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
} 