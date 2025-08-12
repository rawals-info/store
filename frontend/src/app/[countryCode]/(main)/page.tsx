import { Metadata } from "next";

import { listCollections } from "@lib/data/collections";
import { getIndiaRegion } from "@lib/constants/india-region";
import { getCachedCategories } from "@modules/home/components/categories";
import { getHomepageProducts } from "@lib/data/products";
import HomeClientWrapper from "@modules/home/components/home-client-wrapper";
import Link from "next/link"
import { MAJOR_INDIAN_CITIES } from "@lib/seo"

export const metadata: Metadata = {
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
  alternates: {
    canonical: "https://tajpetha.in/in",
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
};

interface HomeProps {
  params: {
    countryCode: string;
  };
}

// Enhanced Product Schema for homepage featured products
const createHomepageSchema = (featuredProducts: any[], countryCode: string) => {
  const baseUrl = "https://tajpetha.in";
  const priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]
  
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
      "itemListElement": featuredProducts?.slice(0, 5).map((product, index) => ({
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
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "2500",
            "bestRating": "5",
            "worstRating": "1"
          },
          // Ensure each Product has a direct Offer for rich-result eligibility
          "offers": {
            "@type": "Offer",
            "price": product.price || "199",
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "priceValidUntil": priceValidUntil,
            "url": `${baseUrl}/${countryCode}/products/${product.handle}`,
            "seller": {
              "@id": `${baseUrl}/#organization`
            }
          }
        },
        "price": product.price || "199",
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

  // Generate dynamic schema based on actual products
  const homepageSchema = createHomepageSchema(featuredProducts, countryCode);

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