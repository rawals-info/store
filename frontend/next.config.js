const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during builds to prevent non-critical issues from blocking deployment
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@medusajs/ui', 'lucide-react', 'framer-motion']
  },
  compress: true,
  i18n: {
    locales: ['in'],
    defaultLocale: 'in',
    localeDetection: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
      // Image caching headers
      {
        source: '/(.*)\\.(jpg|jpeg|png|webp|avif|ico|svg)',
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
      // Static assets caching
      {
        source: '/(.*)\\.(js|css|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, s-maxage=31536000, immutable'
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
            value: 'index, follow'
          }
        ]
      }
    ]
  },

  async redirects() {
    return [
      // SEO redirects for common misspellings
      {
        source: '/',
        destination: '/in',
        permanent: true,    
      },
      {
        source: '/petha',
        destination: '/in/categories/petha',
        permanent: true,
      },
      {
        source: '/namkeen',
        destination: '/in/categories/namkeen',
        permanent: true,
      },
      {
        source: '/agra-petha',
        destination: '/in/categories/petha',
        permanent: true,
      }
    ]
  },

  async rewrites() {
    return [
      // SEO-friendly rewrites
      {
        source: '/city/:city',
        destination: '/in/city/:city'
      },
      {
        source: '/product/:slug',
        destination: '/in/products/:slug'
      }
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
