"use client"

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, Suspense } from 'react'

// Configuration & IDs
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NFH57XTD'
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '123456789'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
    fbq?: (...args: any[]) => void
    clarity?: (...args: any[]) => void
  }
}

/**
 * Determines whether real production analytics and session recording should fire.
 * Returns TRUE only when:
 * 1. process.env.NODE_ENV is 'production'
 * 2. Hostname is NOT localhost, 127.0.0.1, private LAN, or test preview.
 */
export const isProductionTrackingEnabled = (): boolean => {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production'
  }
  const hostname = window.location.hostname
  const isLocal =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.endsWith('.local')

  return process.env.NODE_ENV === 'production' && !isLocal
}

// First-touch attribution helper
export interface AttributionData {
  firstLandingPage?: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  landingTime?: string
}

export const getAttributionData = (): AttributionData => {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem('tp_attribution') || localStorage.getItem('tp_attribution')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export const recordFirstTouch = (pathname: string, searchParams: URLSearchParams) => {
  if (typeof window === 'undefined') return
  try {
    const existing = sessionStorage.getItem('tp_attribution')
    if (!existing) {
      const data: AttributionData = {
        firstLandingPage: pathname,
        referrer: document.referrer || 'direct',
        utmSource: searchParams.get('utm_source') || undefined,
        utmMedium: searchParams.get('utm_medium') || undefined,
        utmCampaign: searchParams.get('utm_campaign') || undefined,
        utmTerm: searchParams.get('utm_term') || undefined,
        utmContent: searchParams.get('utm_content') || undefined,
        landingTime: new Date().toISOString(),
      }
      sessionStorage.setItem('tp_attribution', JSON.stringify(data))
      localStorage.setItem('tp_attribution', JSON.stringify(data))
    }
  } catch {}
}

// DataLayer Dispatcher Helper
export const pushDataLayer = (payload: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    if (!isProductionTrackingEnabled()) {
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 [Dev Mock dataLayer]', payload)
      }
      return
    }
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(payload)
  }
}

// SPA Route Change Tracker Listener
function NavigationListener() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastTrackedUrl = useRef<string>('')

  useEffect(() => {
    if (!pathname) return
    const queryString = searchParams?.toString()
    const fullUrl = queryString ? `${pathname}?${queryString}` : pathname

    if (fullUrl === lastTrackedUrl.current) return
    lastTrackedUrl.current = fullUrl

    // Record First Touch & UTM attribution
    if (searchParams) {
      recordFirstTouch(pathname, searchParams)
    }

    if (!isProductionTrackingEnabled()) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🧭 [Dev Mock Navigation]', fullUrl)
      }
      return
    }

    const attribution = getAttributionData()

    // Push GA4 page_view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: fullUrl,
        page_title: document.title,
        first_touch_landing: attribution.firstLandingPage,
        utm_source: attribution.utmSource,
        utm_campaign: attribution.utmCampaign,
      })
    }

    // Push GTM dataLayer page view
    pushDataLayer({
      event: 'virtual_page_view',
      page_path: fullUrl,
      page_title: document.title,
      first_landing_page: attribution.firstLandingPage,
      referrer: document.referrer || 'direct',
      utm_source: attribution.utmSource,
      utm_medium: attribution.utmMedium,
      utm_campaign: attribution.utmCampaign,
    })

    // Meta Pixel PageView
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView')
    }
  }, [pathname, searchParams])

  return null
}

// E-Commerce Tracking Events
export const trackProductView = (product: {
  id?: string
  title: string
  handle?: string
  category?: string
  price: number
  city?: string
}) => {
  if (!isProductionTrackingEnabled()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 [Dev Mock trackProductView]', product.title, product.price)
    }
    return
  }

  const attribution = getAttributionData()

  // Google Analytics view_item
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'INR',
      value: product.price,
      items: [{
        item_id: product.id || product.handle || product.title,
        item_name: product.title,
        item_category: product.category || 'Agra Petha',
        price: product.price,
      }],
      first_touch_landing: attribution.firstLandingPage,
    })
  }

  // GTM DataLayer
  pushDataLayer({
    event: 'view_item',
    ecommerce: {
      currency: 'INR',
      value: product.price,
      items: [{
        item_id: product.id || product.handle || product.title,
        item_name: product.title,
        item_category: product.category || 'Agra Petha',
        price: product.price,
      }],
    },
    viewing_city: product.city,
  })

  // Meta Pixel ViewContent
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: product.title,
      content_ids: [product.id || product.handle || 'petha'],
      content_type: 'product',
      value: product.price,
      currency: 'INR',
    })
  }
}

export const trackAddToCart = (item: {
  id?: string
  title: string
  price: number
  quantity: number
  category?: string
}) => {
  if (!isProductionTrackingEnabled()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 [Dev Mock trackAddToCart]', item.title, item.price, 'qty:', item.quantity)
    }
    return
  }

  const totalValue = item.price * item.quantity
  const attribution = getAttributionData()

  // Google Analytics add_to_cart
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'INR',
      value: totalValue,
      items: [{
        item_id: item.id || item.title,
        item_name: item.title,
        item_category: item.category || 'Agra Petha',
        quantity: item.quantity,
        price: item.price,
      }],
      first_touch_landing: attribution.firstLandingPage,
    })
  }

  // GTM DataLayer
  pushDataLayer({
    event: 'add_to_cart',
    ecommerce: {
      currency: 'INR',
      value: totalValue,
      items: [{
        item_id: item.id || item.title,
        item_name: item.title,
        item_category: item.category || 'Agra Petha',
        quantity: item.quantity,
        price: item.price,
      }],
    },
  })

  // Meta Pixel AddToCart
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: item.title,
      content_ids: [item.id || item.title],
      content_type: 'product',
      value: totalValue,
      currency: 'INR',
    })
  }
}

export const trackBeginCheckout = (cart: {
  total: number
  items: Array<{
    id?: string
    title: string
    quantity: number
    price: number
  }>
  coupon?: string
}) => {
  if (!isProductionTrackingEnabled()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 [Dev Mock trackBeginCheckout]', cart.total, 'items:', cart.items.length)
    }
    return
  }

  const attribution = getAttributionData()

  // Google Analytics begin_checkout
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'INR',
      value: cart.total,
      coupon: cart.coupon,
      items: cart.items.map((i) => ({
        item_id: i.id || i.title,
        item_name: i.title,
        item_category: 'Agra Petha',
        quantity: i.quantity,
        price: i.price,
      })),
      first_touch_landing: attribution.firstLandingPage,
      utm_source: attribution.utmSource,
      utm_campaign: attribution.utmCampaign,
    })
  }

  // GTM DataLayer
  pushDataLayer({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'INR',
      value: cart.total,
      coupon: cart.coupon,
      items: cart.items.map((i) => ({
        item_id: i.id || i.title,
        item_name: i.title,
        item_category: 'Agra Petha',
        quantity: i.quantity,
        price: i.price,
      })),
    },
    attribution,
  })

  // Meta Pixel InitiateCheckout
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: cart.total,
      currency: 'INR',
      num_items: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    })
  }
}

export const trackPurchase = (transaction: {
  transaction_id: string
  value: number
  currency?: string
  shipping?: number
  coupon?: string
  items: Array<{
    item_id: string
    item_name: string
    category?: string
    quantity: number
    price: number
  }>
  city?: string
  state?: string
}) => {
  if (!isProductionTrackingEnabled()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 [Dev Mock trackPurchase]', transaction.transaction_id, transaction.value)
    }
    return
  }

  const attribution = getAttributionData()

  // Google Analytics purchase
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transaction.transaction_id,
      value: transaction.value,
      currency: transaction.currency || 'INR',
      shipping: transaction.shipping || 0,
      coupon: transaction.coupon,
      items: transaction.items.map((i) => ({
        item_id: i.item_id,
        item_name: i.item_name,
        item_category: i.category || 'Agra Petha',
        quantity: i.quantity,
        price: i.price,
      })),
      first_touch_landing: attribution.firstLandingPage,
      utm_source: attribution.utmSource,
      utm_campaign: attribution.utmCampaign,
      delivery_city: transaction.city,
    })
  }

  // GTM DataLayer
  pushDataLayer({
    event: 'purchase',
    ecommerce: {
      transaction_id: transaction.transaction_id,
      value: transaction.value,
      currency: transaction.currency || 'INR',
      shipping: transaction.shipping || 0,
      coupon: transaction.coupon,
      items: transaction.items.map((i) => ({
        item_id: i.item_id,
        item_name: i.item_name,
        item_category: i.category || 'Agra Petha',
        quantity: i.quantity,
        price: i.price,
      })),
    },
    attribution,
    customer_city: transaction.city,
    customer_state: transaction.state,
  })

  // Meta Pixel Purchase
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: transaction.value,
      currency: transaction.currency || 'INR',
      content_type: 'product',
      content_ids: transaction.items.map((i) => i.item_id),
      num_items: transaction.items.reduce((sum, item) => sum + item.quantity, 0),
    })
  }
}

export const trackCityPageView = (cityName: string, region: string) => {
  if (!isProductionTrackingEnabled()) {
    return
  }

  pushDataLayer({
    event: 'city_page_view',
    city_name: cityName,
    city_region: region,
  })
}

// Master Analytics Scripts Component
export function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (isProductionTrackingEnabled()) {
      setEnabled(true)
    } else if (process.env.NODE_ENV === 'development') {
      console.log(
        '🛡️ [Analytics] Localhost/Development environment detected — Google Analytics, GTM, and Microsoft Clarity scripts are disabled to prevent test pollution.'
      )
    }
  }, [])

  if (!enabled) {
    return null
  }

  return (
    <>
      <Suspense fallback={null}>
        <NavigationListener />
      </Suspense>

      {/* Google Tag Manager - Async load */}
      {/* Google Analytics 4 - gtag.js */}
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              send_page_view: false // Managed dynamically by NavigationListener
            });
          `,
        }}
      />

      {/* Microsoft Clarity */}
      <Script
        id="microsoft-clarity"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "yacrhanzm7");
          `,
        }}
      />
    </>
  )
}

export default {
  GoogleAnalytics,
  trackProductView,
  trackAddToCart,
  trackBeginCheckout,
  trackPurchase,
  trackCityPageView,
  getAttributionData,
  pushDataLayer,
  isProductionTrackingEnabled,
}