import { Metadata } from "next";

import { listCollections } from "@lib/data/collections";
import { getIndiaRegion } from "@lib/constants/india-region";
import { getCachedCategories } from "@modules/home/components/categories";
import { getHomepageProducts } from "@lib/data/products";
import HomeClientWrapper from "@modules/home/components/home-client-wrapper";

export const metadata: Metadata = {
  title: "Taj Petha | India's Best Authentic Agra Petha & Fresh Namkeen Online Store",
  description: "🍬 Buy India's finest authentic Agra petha & fresh namkeen online. ✅ Hygienic preparation ✅ Traditional recipes ✅ Premium ingredients ✅ Same-day dispatch across India ✅ 50,000+ happy customers since 2013. Free shipping on orders above ₹500!",
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
    title: "Taj Petha | India's Best Authentic Agra Petha & Fresh Namkeen Online",
    description: "🍬 Buy India's finest authentic Agra petha & fresh namkeen online. Hygienic preparation, traditional recipes, premium ingredients. Same-day dispatch across India!",
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
    title: "Taj Petha | India's Best Authentic Agra Petha & Fresh Namkeen Online",
    description: "🍬 Buy India's finest authentic Agra petha & fresh namkeen online. Hygienic preparation, traditional recipes, premium ingredients. Same-day dispatch!",
    images: ["/hero_image.webp"],
  },
  alternates: {
    canonical: "https://tajpetha.in",
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
          "name": product.title || `Premium ${product.category || 'Petha'}`,
          "description": product.description || `Authentic ${product.category || 'Agra petha'} made with traditional recipes and premium ingredients`,
          "image": product.thumbnail || `${baseUrl}/placeholder-image.jpg`,
          "brand": {
            "@type": "Brand",
            "name": "Taj Petha"
          },
          "category": product.category || "Indian Sweets"
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
    </>
  );
} 