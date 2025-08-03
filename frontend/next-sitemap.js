const excludedPaths = [
  "/checkout", 
  "/account/*", 
  "/cart",
  "/admin/*",
  "/_next/*",
  "/api/*",
  "/reset-password",
  "/forgot-password"
]

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://tajpetha.in',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: excludedPaths.concat(["/sitemap.xml", "/server-sitemap.xml"]),
  
  // Generate multiple sitemaps for better SEO organization
  additionalPaths: async (config) => {
    const paths = []
    
    // Static important pages
    const staticPages = [
      { loc: '/', priority: 1.0, changefreq: 'daily' },
      { loc: '/about', priority: 0.9, changefreq: 'monthly' },
      { loc: '/contact', priority: 0.8, changefreq: 'monthly' },
      { loc: '/shipping', priority: 0.7, changefreq: 'monthly' },
      { loc: '/terms', priority: 0.6, changefreq: 'yearly' },
      { loc: '/privacy', priority: 0.6, changefreq: 'yearly' },
      { loc: '/returns', priority: 0.7, changefreq: 'monthly' },
      { loc: '/faqs', priority: 0.8, changefreq: 'monthly' },
    ]

    // Country-specific pages (focusing on India regions)
    const countryPages = [
      { loc: '/in', priority: 1.0, changefreq: 'daily' },
      { loc: '/in/products', priority: 0.9, changefreq: 'daily' },
      { loc: '/in/categories', priority: 0.9, changefreq: 'weekly' },
      { loc: '/in/collections', priority: 0.8, changefreq: 'weekly' },
      { loc: '/in/store', priority: 0.8, changefreq: 'daily' },
    ]

    // SEO Landing pages for major cities
    const cityPages = [
      { loc: '/petha-delivery-delhi', priority: 0.8, changefreq: 'weekly' },
      { loc: '/agra-petha-mumbai', priority: 0.8, changefreq: 'weekly' },
      { loc: '/fresh-petha-bangalore', priority: 0.8, changefreq: 'weekly' },
      { loc: '/namkeen-delivery-hyderabad', priority: 0.8, changefreq: 'weekly' },
      { loc: '/petha-online-chennai', priority: 0.8, changefreq: 'weekly' },
      { loc: '/agra-sweets-pune', priority: 0.7, changefreq: 'weekly' },
      { loc: '/petha-delivery-kolkata', priority: 0.7, changefreq: 'weekly' },
      { loc: '/fresh-namkeen-ahmedabad', priority: 0.7, changefreq: 'weekly' },
    ]

    return [
      ...staticPages.map(page => ({
        loc: page.loc,
        priority: page.priority,
        changefreq: page.changefreq,
        lastmod: new Date().toISOString(),
      })),
      ...countryPages.map(page => ({
        loc: page.loc,
        priority: page.priority,
        changefreq: page.changefreq,
        lastmod: new Date().toISOString(),
      })),
      ...cityPages.map(page => ({
        loc: page.loc,
        priority: page.priority,
        changefreq: page.changefreq,
        lastmod: new Date().toISOString(),
      }))
    ]
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: excludedPaths,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/checkout', '/account', '/cart', '/admin'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/checkout', '/account', '/cart', '/admin'],
      }
    ],
    additionalSitemaps: [
      'https://tajpetha.in/server-sitemap.xml', // For dynamic products/categories
      'https://tajpetha.in/blog-sitemap.xml',   // For blog posts (when implemented)
    ],
    // Add crawl delay for different bots
    crawlDelay: 10,
    host: 'https://tajpetha.in',
  },

  // Transform function to modify URLs
  transform: async (config, path) => {
    // Custom priority and changefreq based on page type
    let priority = 0.7
    let changefreq = 'weekly'

    // Homepage gets highest priority
    if (path === '/') {
      priority = 1.0
      changefreq = 'daily'
    }
    // Product pages
    else if (path.includes('/products/')) {
      priority = 0.8
      changefreq = 'daily'
    }
    // Category pages
    else if (path.includes('/categories/')) {
      priority = 0.9
      changefreq = 'weekly'
    }
    // Collection pages
    else if (path.includes('/collections/')) {
      priority = 0.8
      changefreq = 'weekly'
    }
    // City landing pages
    else if (path.includes('petha-delivery') || path.includes('agra-petha') || path.includes('fresh-petha')) {
      priority = 0.8
      changefreq = 'weekly'
    }
    // Static informational pages
    else if (['/about', '/contact', '/shipping', '/faqs'].includes(path)) {
      priority = 0.7
      changefreq = 'monthly'
    }
    // Legal pages
    else if (['/terms', '/privacy', '/returns'].includes(path)) {
      priority = 0.5
      changefreq = 'yearly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      // Add hreflang for India-specific pages
      alternateRefs: path.startsWith('/in') ? [
        {
          href: `https://tajpetha.in${path}`,
          hreflang: 'en-IN',
        },
        {
          href: `https://tajpetha.in${path}`,
          hreflang: 'x-default',
        }
      ] : undefined,
    }
  },

  // Custom options for sitemap generation
  sitemapSize: 5000, // Split large sitemaps
  autoLastmod: true,
  
  // Additional sitemap configurations
  outDir: './public',
}
