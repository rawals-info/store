const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    // Disable ESLint during builds to prevent non-critical issues from blocking deployment
    ignoreDuringBuilds: true,
  },
  experimental: {
    //optimizeCss: true,
    optimizePackageImports: ['@medusajs/ui', 'lucide-react', 'framer-motion']
  },
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [25, 50, 60, 65, 70, 75, 80, 85, 90, 95, 100],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-production-de80.up.railway.app",
      },
    ],
  },

  async headers() {
    return [
      // Security headers
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
          }
        ]
      },
      // Image optimization cache (/_next/image)
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, s-maxage=31536000, immutable'
          }
        ]
      },
      // Image caching headers (non-SVG images don't need indexing)
      {
        source: '/(.*)\\.(jpg|jpeg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, s-maxage=31536000, immutable'
          },
          {
            key: 'Expires',
            value: new Date(Date.now() + 31536000000).toUTCString()
          },
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          }
        ]
      },
      // Favicon caching headers (allow indexing)
      {
        source: '/(.*)\\.(ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, s-maxage=31536000, immutable'
          },
          {
            key: 'Expires',
            value: new Date(Date.now() + 31536000000).toUTCString()
          }
        ]
      },
      // SVG caching headers (without noindex since some SVGs might be content)
      {
        source: '/(.*)\\.(svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, s-maxage=31536000, immutable'
          },
          {
            key: 'Expires',
            value: new Date(Date.now() + 31536000000).toUTCString()
          }
        ]
      },
      // Explicitly prevent indexing of internal payment icon SVGs
      {
        source: '/payment-icons/(.*)\\.(svg)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, s-maxage=31536000, immutable' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' }
        ]
      },
      // Static assets caching
      {
        source: '/(.*)\\.(js|css|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, s-maxage=31536000, immutable'
          },
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          }
        ]
      },
      // API routes
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300'
          }
        ]
      },
      // Ensure service worker is always fetched fresh
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' }
        ]
      },
      // City pages with SEO headers
      {
        source: '/city/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600'
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
          }
        ]
      }
    ]
  },

  async redirects() {
    return [
      // Force www to apex to avoid duplicate host indexing
      {
        source: '/:path*',
        has: [
          { type: 'host', value: 'www.tajpetha.in' }
        ],
        destination: 'https://tajpetha.in/:path*',
        permanent: true,
      },
      // Redirect non-country paths to canonical /in paths to fix GSC issues
      { source: '/about', destination: '/in/about', permanent: true },
      { source: '/contact', destination: '/in/contact', permanent: true },
      { source: '/shipping', destination: '/in/shipping', permanent: true },
      { source: '/terms', destination: '/in/terms', permanent: true },
      { source: '/privacy', destination: '/in/privacy', permanent: true },
      { source: '/returns', destination: '/in/returns', permanent: true },
      { source: '/faqs', destination: '/in/faqs', permanent: true },
      { source: '/collections', destination: '/in/collections', permanent: true },
      { source: '/categories', destination: '/in/categories', permanent: true },
      { source: '/categories/:slug', destination: '/in/categories/:slug', permanent: true },
      { source: '/products/:slug', destination: '/in/products/:slug', permanent: true },
      { source: '/city/:city', destination: '/in/city/:city', permanent: true },
      // Marketing aliases
      { source: '/petha', destination: '/in/categories/petha', permanent: true },
      { source: '/namkeen', destination: '/in/categories/namkeen', permanent: true },
      { source: '/agra-petha', destination: '/in/categories/petha', permanent: true },
      
      // Fix soft 404: redirect /store to /products (both with and without country code)
      { source: '/store', destination: '/in/products', permanent: true },
      { source: '/in/store', destination: '/in/products', permanent: true },
    ]
  },

  async rewrites() {
    // Keep only essential rewrites that don't cause SEO conflicts
    return [
      // Home page rewrite (keep this as it's the main entry point)
      { source: '/', destination: '/in' },
      { source: '/hi', destination: '/in' },
      { source: '/in/hi', destination: '/in' },
    ]
  },

  webpack: (config, { dev, isServer }) => {
    // Optimize bundle for SEO-critical resources
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // SEO-critical chunk
          seo: {
            name: 'seo',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](@medusajs|next)[\\/]/,
            priority: 10,
            enforce: true,
          },
          // UI components chunk
          ui: {
            name: 'ui',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](framer-motion|lucide-react)[\\/]/,
            priority: 5,
          }
        }
      }
    }
    return config
  }
}

module.exports = nextConfig
