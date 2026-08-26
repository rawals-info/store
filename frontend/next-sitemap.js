const excludedPaths = [
  "/checkout",
  "/*/checkout",
  "/account/*",
  "/*/account/*",
  "/cart",
  "/*/cart",
  "/admin/*",
  "/_next/*",
  "/api/*",
  // Auth pages — must exclude BOTH the root and the /in/ prefixed versions
  "/reset-password",
  "/*/reset-password",
  "/forgot-password",
  "/*/forgot-password",
  "/payment-icons/*",
  "/opengraph-image*",
  // Search pages should not be indexed
  "/search/*",
  "/*/search/*",
]

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://tajpetha.in', // Standardized to non-www
  generateRobotsTxt: true,
  generateIndexSitemap: false, // Disable index sitemap to avoid conflicts
  // Exclude only private/internal paths that shouldn't be indexed
  exclude: [
    ...excludedPaths,
    '/', // Exclude root path since it 308 redirects to /in
    '/in/store', // Exclude store page since it redirects to /in/products
    // Don't exclude public pages - include canonical /in/* versions only
  ],

  // Generate multiple sitemaps for better SEO organization
  additionalPaths: async () => {
    const fs = require('fs')
    const path = require('path')

    // Extract all 159 city slugs dynamically from cities.ts
    let citySlugs = []
    try {
      const citiesFile = fs.readFileSync(path.join(__dirname, 'src/lib/seo/cities.ts'), 'utf8')
      citySlugs = [...citiesFile.matchAll(/slug:\s*["']([^"']+)["']/g)].map(m => m[1])
    } catch (e) {
      console.warn("Could not read cities.ts for sitemap:", e)
      citySlugs = ['delhi', 'noida', 'gurgaon', 'mumbai', 'bangalore', 'hyderabad', 'chennai', 'pune', 'kolkata', 'ahmedabad', 'kanpur', 'lucknow', 'jaipur', 'surat', 'patna']
    }

    const cityPaths = citySlugs.map(slug => ({
      loc: `/in/city/${slug}`,
      priority: 0.85,
      changefreq: 'weekly',
    }))

    const basePaths = [
      { loc: '/in', priority: 1.0, changefreq: 'daily' },
      { loc: '/in/products', priority: 0.95, changefreq: 'daily' },
      { loc: '/in/categories', priority: 0.9, changefreq: 'weekly' },
      { loc: '/in/collections', priority: 0.8, changefreq: 'weekly' },
      { loc: '/in/blog', priority: 0.9, changefreq: 'weekly' },
      { loc: '/in/about', priority: 0.9, changefreq: 'monthly' },
      { loc: '/in/contact', priority: 0.8, changefreq: 'monthly' },
      { loc: '/in/shipping', priority: 0.7, changefreq: 'monthly' },
      { loc: '/in/terms', priority: 0.6, changefreq: 'yearly' },
      { loc: '/in/privacy', priority: 0.6, changefreq: 'yearly' },
      { loc: '/in/returns', priority: 0.7, changefreq: 'monthly' },
      { loc: '/in/city', priority: 0.9, changefreq: 'daily' },
      ...cityPaths,
    ]

    return basePaths.map(p => ({
      loc: p.loc,
      priority: p.priority,
      changefreq: p.changefreq,
      lastmod: new Date().toISOString(),
    }))
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
    // Primary host and sitemaps list
    host: 'https://tajpetha.in',
    additionalSitemaps: [
      'https://tajpetha.in/server-sitemap.xml',
      'https://tajpetha.in/blog-sitemap.xml'
    ],
  },

  // Transform function to modify URLs
  transform: async (config, path) => {
    // Custom priority and changefreq based on page type
    let priority = 0.7
    let changefreq = 'weekly'

    // Main homepage is '/in'
    if (path === '/in') {
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
    else if (['/in/about', '/in/contact', '/in/shipping', '/in/faqs'].includes(path)) {
      priority = 0.7
      changefreq = 'monthly'
    }
    // Legal pages
    else if (['/in/terms', '/in/privacy', '/in/returns'].includes(path)) {
      priority = 0.5
      changefreq = 'yearly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    }
  },

  // Custom options for sitemap generation
  sitemapSize: 5000, // Split large sitemaps
  autoLastmod: true,

  // Additional sitemap configurations
  outDir: './public',
}
