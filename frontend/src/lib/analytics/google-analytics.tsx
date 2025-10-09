"use client"

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

// Google Analytics tracking ID
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'

// Google Tag Manager ID
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NFH57XTD'

// Facebook Pixel ID
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '123456789'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
    fbq: (...args: any[]) => void
  }
}

// Google Analytics helper functions
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      custom_map: {
        custom_parameter_1: 'petha_category',
        custom_parameter_2: 'city_location'
      }
    })
  }
}

export const event = ({
  action,
  category,
  label,
  value,
  custom_parameters = {}
}: {
  action: string
  category: string
  label?: string
  value?: number
  custom_parameters?: Record<string, any>
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...custom_parameters
    })
  }
}

// Enhanced e-commerce tracking for petha sales
export const trackPurchase = (transactionData: {
  transaction_id: string
  value: number
  currency: string
  items: Array<{
    item_id: string
    item_name: string
    category: string
    quantity: number
    price: number
  }>
  city?: string
  customer_type?: string
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionData.transaction_id,
      value: transactionData.value,
      currency: transactionData.currency,
      items: transactionData.items.map(item => ({
        item_id: item.item_id,
        item_name: item.item_name,
        item_category: item.category,
        quantity: item.quantity,
        price: item.price
      })),
      custom_parameters: {
        delivery_city: transactionData.city,
        customer_type: transactionData.customer_type,
        business_type: 'petha_ecommerce'
      }
    })

    // Track Facebook Pixel purchase
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: transactionData.value,
        currency: transactionData.currency,
        content_ids: transactionData.items.map(item => item.item_id),
        content_type: 'product',
        content_category: 'Indian Sweets'
      })
    }
  }
}

export const trackProductView = (productData: {
  item_id: string
  item_name: string
  category: string
  price: number
  city?: string
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'INR',
      value: productData.price,
      items: [{
        item_id: productData.item_id,
        item_name: productData.item_name,
        item_category: productData.category,
        price: productData.price
      }],
      custom_parameters: {
        viewing_from_city: productData.city,
        product_type: 'traditional_sweets'
      }
    })

    // Track Facebook Pixel view
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_ids: [productData.item_id],
        content_type: 'product',
        content_name: productData.item_name,
        content_category: productData.category,
        value: productData.price,
        currency: 'INR'
      })
    }
  }
}

export const trackAddToCart = (itemData: {
  item_id: string
  item_name: string
  category: string
  price: number
  quantity: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'INR',
      value: itemData.price * itemData.quantity,
      items: [{
        item_id: itemData.item_id,
        item_name: itemData.item_name,
        item_category: itemData.category,
        quantity: itemData.quantity,
        price: itemData.price
      }]
    })

    // Track Facebook Pixel add to cart
    if (window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [itemData.item_id],
        content_type: 'product',
        content_name: itemData.item_name,
        value: itemData.price * itemData.quantity,
        currency: 'INR'
      })
    }
  }
}

export const trackCityPageView = (cityData: {
  city_name: string
  product_type: string
  page_type: 'city_landing'
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'city_page_view', {
      event_category: 'Local SEO',
      event_label: cityData.city_name,
      custom_parameters: {
        city_name: cityData.city_name,
        product_type: cityData.product_type,
        page_type: cityData.page_type,
        local_seo_intent: true
      }
    })
  }
}

export const trackBlogEngagement = (blogData: {
  article_id: string
  article_title: string
  category: string
  reading_time: number
  scroll_depth?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'blog_engagement', {
      event_category: 'Content Marketing',
      event_label: blogData.article_title,
      custom_parameters: {
        article_id: blogData.article_id,
        content_category: blogData.category,
        estimated_reading_time: blogData.reading_time,
        scroll_depth: blogData.scroll_depth,
        content_type: 'educational_blog'
      }
    })
  }
}

export const trackSearchQuery = (searchData: {
  search_term: string
  results_count: number
  category_filter?: string
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchData.search_term,
      custom_parameters: {
        results_count: searchData.results_count,
        category_filter: searchData.category_filter,
        search_type: 'product_search'
      }
    })
  }
}

// Enhanced conversion tracking for different user journeys
export const trackConversionFunnel = (funnelData: {
  step: 'homepage' | 'category' | 'product' | 'cart' | 'checkout' | 'purchase'
  user_type: 'new' | 'returning'
  source_page?: string
  city?: string
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion_funnel', {
      event_category: 'User Journey',
      event_label: funnelData.step,
      custom_parameters: {
        funnel_step: funnelData.step,
        user_type: funnelData.user_type,
        source_page: funnelData.source_page,
        user_city: funnelData.city,
        business_vertical: 'traditional_sweets'
      }
    })
  }
}

// Component for tracking page views
export function usePageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + (searchParams ? searchParams.toString() : '')
    pageview(url)
  }, [pathname, searchParams])
}

// Google Analytics Script Component
// ✅ Optimized with deferred loading for better performance
export function GoogleAnalytics() {
  const isProd = process.env.NODE_ENV === 'production'
  if (!isProd) {
    return null
  }
  return (
    <>
      {/* Google Analytics - Deferred loading after user interaction */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              custom_map: {
                'custom_parameter_1': 'petha_category',
                'custom_parameter_2': 'city_location'
              },
              // Enhanced ecommerce settings
              send_page_view: true,
              enhanced_ecommerce: true,
              // User properties for better segmentation
              user_properties: {
                business_type: 'indian_sweets_ecommerce',
                primary_product: 'agra_petha'
              }
            });

            // ✅ Throttled scroll depth tracking for better performance
            let scrollDepth = 0;
            let scrollTimeout;
            window.addEventListener('scroll', function() {
              if (scrollTimeout) clearTimeout(scrollTimeout);
              scrollTimeout = setTimeout(function() {
                const scrolled = Math.floor((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                if (scrolled > scrollDepth && scrolled % 25 === 0) {
                  scrollDepth = scrolled;
                  gtag('event', 'scroll_depth', {
                    event_category: 'Engagement',
                    event_label: scrollDepth + '%',
                    value: scrollDepth
                  });
                }
              }, 100); // Throttle to 100ms
            }, { passive: true });

            // Track time on page (only for engaged sessions > 10s)
            let startTime = Date.now();
            window.addEventListener('beforeunload', function() {
              const timeOnPage = Math.floor((Date.now() - startTime) / 1000);
              if (timeOnPage >= 10) { // Only track if user spent at least 10s
                gtag('event', 'time_on_page', {
                  event_category: 'Engagement',
                  value: timeOnPage,
                  custom_parameters: {
                    page_type: document.title.includes('Petha') ? 'product_page' : 'content_page'
                  }
                });
              }
            });
          `,
        }}
      />

      {/* Google Tag Manager - Deferred */}
      <Script
        id="google-tag-manager"
        strategy="worker"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.defer=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />

      {/* Facebook Pixel - Deferred */}
      <Script
        id="facebook-pixel"
        strategy="worker"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* Microsoft Clarity - Loaded on idle */}
      <Script
        id="microsoft-clarity"
        strategy="worker"
        dangerouslySetInnerHTML={{
          __html: `
            // ✅ Load Clarity only when browser is idle
            if ('requestIdleCallback' in window) {
              requestIdleCallback(function() {
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "n8n8n8n8n8");
              });
            }
          `,
        }}
      />

      {/* Hotjar - Loaded on idle (only if enabled) */}
      <Script
        id="hotjar"
        strategy="worker"
        dangerouslySetInnerHTML={{
          __html: `
            // ✅ Load Hotjar only when browser is idle
            if ('requestIdleCallback' in window) {
              requestIdleCallback(function() {
                (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:3507234,hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              });
            }
          `,
        }}
      />
    </>
  )
}

// Enhanced tracking for A/B testing and conversion optimization
export const trackABTest = (testData: {
  experiment_id: string
  variant: string
  conversion_goal: string
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ab_test_view', {
      event_category: 'A/B Testing',
      event_label: testData.experiment_id,
      custom_parameters: {
        experiment_id: testData.experiment_id,
        variant: testData.variant,
        conversion_goal: testData.conversion_goal
      }
    })
  }
}

export default {
  GoogleAnalytics,
  usePageView,
  pageview,
  event,
  trackPurchase,
  trackProductView,
  trackAddToCart,
  trackCityPageView,
  trackBlogEngagement,
  trackSearchQuery,
  trackConversionFunnel,
  trackABTest
} 