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
  generateIndexSitemap: false, // Disable index sitemap to avoid conflicts
  exclude: excludedPaths,
  
  // Generate multiple sitemaps for better SEO organization
  additionalPaths: async (config) => {
    const paths = []
    
    // Static important pages
    const staticPages = [
      // Remove root '/' to avoid canonical alternates; use '/in' as the main homepage
      { loc: '/in', priority: 1.0, changefreq: 'daily' },
      { loc: '/in/products', priority: 0.9, changefreq: 'daily' },
      { loc: '/in/categories', priority: 0.9, changefreq: 'weekly' },
      { loc: '/in/collections', priority: 0.8, changefreq: 'weekly' },
      { loc: '/in/store', priority: 0.8, changefreq: 'daily' },
      { loc: '/in/blog', priority: 0.9, changefreq: 'weekly' },
      { loc: '/in/about', priority: 0.9, changefreq: 'monthly' },
      { loc: '/in/contact', priority: 0.8, changefreq: 'monthly' },
      { loc: '/in/shipping', priority: 0.7, changefreq: 'monthly' },
      { loc: '/in/terms', priority: 0.6, changefreq: 'yearly' },
      { loc: '/in/privacy', priority: 0.6, changefreq: 'yearly' },
      { loc: '/in/returns', priority: 0.7, changefreq: 'monthly' },
      { loc: '/in/faqs', priority: 0.8, changefreq: 'monthly' },
    ]

    // Blog posts
    const blogPosts = [
      { loc: '/in/blog/authentic-agra-petha-recipe', priority: 0.8, changefreq: 'monthly' },
      { loc: '/in/blog/health-benefits-petha-namkeen', priority: 0.8, changefreq: 'monthly' },
      { loc: '/in/blog/history-agra-petha-heritage', priority: 0.7, changefreq: 'monthly' },
      { loc: '/in/blog/seasonal-namkeen-guide', priority: 0.7, changefreq: 'monthly' },
      { loc: '/in/blog/preservation-techniques-traditional-sweets', priority: 0.7, changefreq: 'monthly' },
    ]

    // SEO City Landing pages
    const cityPages = [
      { loc: '/in/city/delhi', priority: 0.8, changefreq: 'weekly' },
      { loc: '/in/city/mumbai', priority: 0.8, changefreq: 'weekly' },
      { loc: '/in/city/bangalore', priority: 0.8, changefreq: 'weekly' },
      { loc: '/in/city/hyderabad', priority: 0.8, changefreq: 'weekly' },
      { loc: '/in/city/chennai', priority: 0.8, changefreq: 'weekly' },
      { loc: '/in/city/pune', priority: 0.7, changefreq: 'weekly' },
      { loc: '/in/city/kolkata', priority: 0.7, changefreq: 'weekly' },
      { loc: '/in/city/ahmedabad', priority: 0.7, changefreq: 'weekly' },
    ]

    // Product category pages (these will be dynamically generated)
    const categoryPages = [
      { loc: '/in/categories/petha', priority: 0.9, changefreq: 'daily' },
      { loc: '/in/categories/namkeen', priority: 0.9, changefreq: 'daily' },
      { loc: '/in/categories/traditional-sweets', priority: 0.8, changefreq: 'weekly' },
      { loc: '/in/categories/gift-boxes', priority: 0.8, changefreq: 'weekly' },
    ]

    return [
      ...staticPages.map(page => ({
        loc: page.loc,
        priority: page.priority,
        changefreq: page.changefreq,
        lastmod: new Date().toISOString(),
      })),
      ...blogPosts.map(page => ({
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
      })),
      ...categoryPages.map(page => ({
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
    // Remove problematic additional sitemaps that were causing HTML errors
    host: 'https://tajpetha.in',
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
