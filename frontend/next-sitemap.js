const excludedPaths = [
  "/checkout", 
  "/account/*", 
  "/cart",
  "/admin/*",
  "/_next/*",
  "/api/*",
  "/reset-password",
  "/forgot-password",
  "/payment-icons/*"
]

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://tajpetha.in',
  generateRobotsTxt: true,
  generateIndexSitemap: false, // Disable index sitemap to avoid conflicts
  // Exclude only private/internal paths that shouldn't be indexed
  exclude: [
    ...excludedPaths,
    '/in/store', // Exclude store page since it redirects to /in/products
    // Don't exclude public pages - include canonical /in/* versions only
  ],
  
  // Generate multiple sitemaps for better SEO organization
  additionalPaths: async () => {
    // Keep sitemap minimalist to avoid GSC redirect/canonical conflicts
    const basePaths = [
      { loc: '/in', priority: 1.0, changefreq: 'daily' },
      { loc: '/in/products', priority: 0.9, changefreq: 'daily' },
      { loc: '/in/categories', priority: 0.9, changefreq: 'weekly' },
      { loc: '/in/collections', priority: 0.8, changefreq: 'weekly' },
      { loc: '/in/blog', priority: 0.9, changefreq: 'weekly' },
      { loc: '/in/about', priority: 0.9, changefreq: 'monthly' },
      { loc: '/in/contact', priority: 0.8, changefreq: 'monthly' },
      { loc: '/in/shipping', priority: 0.7, changefreq: 'monthly' },
      { loc: '/in/terms', priority: 0.6, changefreq: 'yearly' },
      { loc: '/in/privacy', priority: 0.6, changefreq: 'yearly' },
      { loc: '/in/returns', priority: 0.7, changefreq: 'monthly' },
      // Frequently crawled but not indexed — explicitly include to boost signals
      { loc: '/in/products', priority: 0.8, changefreq: 'daily' },
      { loc: '/in/city/delhi', priority: 0.8, changefreq: 'weekly' },
      { loc: '/in/city/mumbai', priority: 0.8, changefreq: 'weekly' },
      { loc: '/in/city/bangalore', priority: 0.8, changefreq: 'weekly' },
      { loc: '/in/categories/gift-boxes', priority: 0.8, changefreq: 'weekly' },
      { loc: '/in/categories/traditional-sweets', priority: 0.8, changefreq: 'weekly' },
      { loc: '/in/blog/seasonal-namkeen-guide', priority: 0.7, changefreq: 'monthly' },
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
