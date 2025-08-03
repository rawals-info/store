const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 3600,
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
  experimental: {
    scrollRestoration: true,
    webpackBuildWorker: false,
    optimizeCss: true,
    optimizePackageImports: ['@medusajs/ui', 'framer-motion', 'lucide-react'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Surrogate-Control',
            value: 'public, max-age=3600'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300'
          }
        ]
      },
      {
        source: '/(.*).(jpg|jpeg|png|webp|avif|ico|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/(.*).(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300'
          }
        ]
      },
      {
        source: '/categories/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600'
          }
        ]
      },
      {
        source: '/products/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600'
          }
        ]
      },
      // SEO-specific headers for better crawling
      {
        source: '/(sitemap.xml|robots.txt|manifest.json)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate'
          }
        ]
      },
      // Headers for city landing pages
      {
        source: '/(petha-delivery-|agra-petha-|fresh-petha-|namkeen-delivery-)(.+)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=1800, stale-while-revalidate=3600'
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow'
          }
        ]
      }
    ]
  },
  // Enhanced redirects for SEO
  async redirects() {
    return [
      // Redirect common misspellings and variations
      {
        source: '/petha',
        destination: '/in/products?category=petha',
        permanent: true,
      },
      {
        source: '/namkeen',
        destination: '/in/products?category=namkeen',
        permanent: true,
      },
      {
        source: '/sweets',
        destination: '/in/products',
        permanent: true,
      },
      {
        source: '/agra-petha',
        destination: '/in/products?category=petha',
        permanent: true,
      },
      // Redirect old URLs if any
      {
        source: '/shop',
        destination: '/in/store',
        permanent: true,
      },
      {
        source: '/products',
        destination: '/in/products',
        permanent: true,
      }
    ]
  },
  // Enhanced rewrites for SEO-friendly URLs
  async rewrites() {
    return [
      // City-specific landing pages
      {
        source: '/petha-delivery-delhi',
        destination: '/in/city/delhi?product=petha',
      },
      {
        source: '/agra-petha-mumbai',
        destination: '/in/city/mumbai?product=petha',
      },
      {
        source: '/fresh-petha-bangalore',
        destination: '/in/city/bangalore?product=petha',
      },
      {
        source: '/namkeen-delivery-hyderabad',
        destination: '/in/city/hyderabad?product=namkeen',
      },
      {
        source: '/petha-online-chennai',
        destination: '/in/city/chennai?product=petha',
      },
      {
        source: '/agra-sweets-pune',
        destination: '/in/city/pune?product=sweets',
      },
      {
        source: '/petha-delivery-kolkata',
        destination: '/in/city/kolkata?product=petha',
      },
      {
        source: '/fresh-namkeen-ahmedabad',
        destination: '/in/city/ahmedabad?product=namkeen',
      },
      // SEO-friendly product URLs
      {
        source: '/best-petha-india',
        destination: '/in/products?featured=true&category=petha',
      },
      {
        source: '/authentic-agra-petha',
        destination: '/in/products?authentic=true&category=petha',
      },
      {
        source: '/fresh-namkeen-online',
        destination: '/in/products?fresh=true&category=namkeen',
      }
    ]
  },
  staticPageGenerationTimeout: 300,
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 10,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  generateEtags: true,
  poweredByHeader: false,
  // Enhanced compression for better performance
  compress: true,
  // Webpack optimizations for SEO
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add bundle analyzer in development
    if (!dev && !isServer) {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.BUILD_ID': JSON.stringify(buildId),
        })
      )
    }
    
    // Optimize for SEO-critical resources
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          seo: {
            name: 'seo',
            test: /[\\/]node_modules[\\/](next-seo|next-sitemap)[\\/]/,
            chunks: 'all',
            priority: 30,
          },
        },
      },
    }

    return config
  },
}

module.exports = nextConfig
