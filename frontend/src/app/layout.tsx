import { getBaseURL } from "@lib/util/env"
import { Metadata, Viewport } from "next"
import { GoogleAnalytics } from "@lib/analytics/google-analytics"
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import Script from "next/script";
import "styles/globals.css"
import { Poppins, DM_Serif_Display, Inter, Playfair_Display } from "next/font/google"

// ✅ Optimized font loading with display: 'swap', preload, and adjustFontFallback
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300","400","500","600","700"], 
  display: "swap", 
  variable: "--font-poppins",
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial']
})

const dmSerif = DM_Serif_Display({ 
  subsets: ["latin"], 
  weight: "400", 
  style: "normal", 
  display: "swap", 
  variable: "--font-dm-serif",
  preload: true,
  adjustFontFallback: true,
  fallback: ['Georgia', 'serif']
})

const interFont = Inter({ 
  subsets: ["latin"], 
  weight: ["400","500","600","700"], 
  display: "swap", 
  variable: "--font-inter",
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial']
})

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  weight: ["400","500","600","700"], 
  display: "swap", 
  variable: "--font-playfair",
  preload: false, // Only loaded on-demand for specific components
  adjustFontFallback: true,
  fallback: ['Georgia', 'Times New Roman', 'serif']
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Taj Petha | India's Best Authentic Agra Petha & Fresh Namkeen Online",
    template: "%s | Taj Petha - India's Premium Sweet Store"
  },
  description: "Buy India's finest authentic Agra petha & fresh namkeen online. Hygienic, traditional recipes, premium ingredients. Same-day dispatch across India. Trusted by 50,000+ customers since 2013.",
  keywords: [
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
  authors: [{ name: "Taj Petha", url: "https://tajpetha.in" }],
  creator: "Taj Petha - India's Premium Sweet Store",
  publisher: "Taj Petha",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: getBaseURL(),
    title: "Taj Petha | India's Best Authentic Agra Petha & Fresh Namkeen Online",
    description: "Buy India's finest authentic Agra petha & fresh namkeen online. Hygienic, traditional recipes, premium ingredients. Same-day dispatch across India.",
    siteName: "Taj Petha",
    images: [
      {
        url: "/hero_image.webp",
        width: 1200,
        height: 630,
        alt: "Taj Petha - India's Best Authentic Agra Petha & Fresh Namkeen",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taj Petha | India's Best Authentic Agra Petha & Fresh Namkeen Online",
    description: "Buy India's finest authentic Agra petha & fresh namkeen online. Hygienic, traditional recipes, premium ingredients. Same-day dispatch across India.",
    images: ["/hero_image.webp"],
    creator: "@tajpetha",
    site: "@tajpetha",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Remove global canonical to avoid overriding per-page canonicals
  // alternates: {
  //   canonical: getBaseURL(),
  //   languages: {
  //     'en-IN': getBaseURL(),
  //     'hi-IN': `${getBaseURL()}/hi`,
  //   },
  // },
  verification: {
    google: "google-verification-code", // Add your Google Search Console verification code
    other: {
      'facebook-domain-verification': 'facebook-domain-verification-code',
    },
  },
  category: 'food',
  classification: 'Indian Sweets and Snacks',
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d4af37" },
    { media: "(prefers-color-scheme: dark)", color: "#b8941f" },
  ],
}

// Organization Schema for entire site
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${getBaseURL()}/#organization`,
  "name": "Taj Petha",
  "alternateName": ["Taj Petha Store", "India's Best Petha"],
  "url": getBaseURL(),
  "logo": {
    "@type": "ImageObject",
    "url": `${getBaseURL()}/logo.png`,
    "width": "300",
    "height": "100"
  },
  "image": `${getBaseURL()}/hero_image.webp`,
  "description": "India's premier authentic Agra petha and fresh namkeen online store. Serving hygienic, traditional sweets made with premium ingredients since 2013.",
  "foundingDate": "2013",
  "founder": {
    "@type": "Person",
    "name": "Siddharth Rawal"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Sadar Bazaar",
    "addressLocality": "Agra",
    "addressRegion": "Uttar Pradesh",
    "postalCode": "282001",
    "addressCountry": "IN"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+91-92594-18994",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["Hindi", "English"]
    }
  ],
  "sameAs": [
    "https://www.facebook.com/tajpethaagra",
    "https://www.instagram.com/tajpethaagra",
    "https://www.youtube.com/tajpethaagra"
  ],
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${getBaseURL()}/search?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
}

// Website Schema
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${getBaseURL()}/#website`,
  "url": getBaseURL(),
  "name": "Taj Petha",
  "description": "India's best authentic Agra petha and fresh namkeen online store",
  "publisher": {
    "@id": `${getBaseURL()}/#organization`
  },
  "potentialAction": [
    {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${getBaseURL()}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  ],
  "inLanguage": "en-IN"
}

// LocalBusiness Schema
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${getBaseURL()}/#localbusiness`,
  "name": "Taj Petha",
  "image": `${getBaseURL()}/hero_image.webp`,
  "description": "India's premier authentic Agra petha and fresh namkeen online store with same-day dispatch and hygienic preparation.",
  "url": getBaseURL(),
  "telephone": "+91-92594-18994",
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
  "servesCuisine": ["Indian Sweets", "Traditional Namkeen", "Agra Specialties"],
  "priceRange": "₹₹",
  "currenciesAccepted": "INR",
  "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking"],
  // Removed site-level fixed ratings/reviews to avoid misleading structured data
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const baseUrl = getBaseURL()
  const enableServiceWorker = process.env.NEXT_PUBLIC_ENABLE_SW === 'true'
  const isProd = process.env.NODE_ENV === 'production'
  return (
    <html lang="en-IN" data-mode="light" className={`${poppins.variable} ${dmSerif.variable} ${interFont.variable} ${playfair.variable}`}>
      <head>
        {/* Preload critical resources to reduce HTTP requests */}
        <link rel="preload" href="/hero_image.webp" as="image" />
        <meta property="og:site_name" content="Taj Petha" />
        
        {/* Critical DNS prefetch for external analytics */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        {/* Preconnects removed to avoid unnecessary 3rd-party warmups unless scripts are used */}
        
        {/* Optimized favicon and app icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Service Worker Registration (gated by env + prod) */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var enableSW = ${enableServiceWorker && isProd ? 'true' : 'false'};
              if ('serviceWorker' in navigator) {
                if (enableSW) {
                  window.addEventListener('load', function () {
                    // Use buildId param to force updates when a new deployment happens
                    var buildId = (window.__NEXT_DATA__ && window.__NEXT_DATA__.buildId) || Date.now();
                    var swUrl = '/sw.js?build=' + encodeURIComponent(buildId);
                    navigator.serviceWorker.register(swUrl)
                      .then(function (registration) {
                        console.log('[SW] registered', registration.scope);
                        // Proactively check for updates on first load and when tab becomes visible
                        try { registration.update(); } catch (e) {}
                        document.addEventListener('visibilitychange', function() {
                          if (document.visibilityState === 'visible') {
                            try { registration.update(); } catch (e) {}
                          }
                        });
                      })
                      .catch(function (err) {
                        console.warn('[SW] registration failed', err);
                      });
                  });
                } else {
                  // Ensure any previously installed SW is removed and stale caches are cleared
                  navigator.serviceWorker.getRegistrations().then(function (regs) {
                    regs.forEach(function (r) { r.unregister(); });
                  });
                  if (window.caches && caches.keys) {
                    caches.keys().then(function (keys) {
                      keys.filter(function (k) { return k.indexOf('taj-petha') === 0; })
                        .forEach(function (k) { caches.delete(k); });
                    });
                  }
                }
              }
            })();
          `
        }} />

        {/* External analytics scripts are loaded centrally in GoogleAnalytics component */}
        
        {/* Enhanced Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body suppressHydrationWarning={true}>
        {/* Google Tag Manager (noscript) */}
        <noscript dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NFH57XTD"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>`
        }} />
        
        {/* Analytics Scripts */}
        <GoogleAnalytics />
        
        {/* Vercel Analytics and Speed Insights */}
        <Analytics />
        <SpeedInsights />
        
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
