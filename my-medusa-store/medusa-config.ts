// my-medusa-store/medusa-config.ts
import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

export default defineConfig({
  projectConfig: {
    // Database
    databaseUrl: process.env.DATABASE_URL!,

    // Root Redis connection used by session store and other internals
    redisUrl:
      process.env.REDIS_URL ||
      process.env.EVENTS_REDIS_URL ||
      process.env.CACHE_REDIS_URL!,

    // Additional driver and pool settings for production deployments
    databaseDriverOptions:
      process.env.NODE_ENV !== "development"
        ? {
            // Enable SSL for hosted Postgres providers (Render, Fly.io, Railway, etc.)
            connection: {
              ssl: { rejectUnauthorized: false },
            },
            // Fine-tuned pool to avoid "Connection terminated unexpectedly" on PaaS DBs
            pool: {
              min: 0,
              max: 7,
              idleTimeoutMillis: 30_000,
              createTimeoutMillis: 300_000,
              destroyTimeoutMillis: 50_000,
              reapIntervalMillis: 10_000,
              createRetryIntervalMillis: 2_000,
            },
          }
        : {},

    // HTTP / CORS / Secrets
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },

    // Worker mode ("server" | "worker" | "shared")
    workerMode:
      (process.env.MEDUSA_WORKER_MODE as "server" | "worker" | "shared") ||
      "server",
  },

  // Admin UI settings (enable/disable via env)
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  // Redis-backed Event Bus & Cache
  modules: {
    eventBus: {
      resolve: "@medusajs/event-bus-redis",
      options: {
        redisUrl: process.env.EVENTS_REDIS_URL || process.env.REDIS_URL!,
      },
    },
    cacheService: {
      resolve: "@medusajs/cache-redis",
      options: {
        redisUrl: process.env.CACHE_REDIS_URL || process.env.REDIS_URL!,
      },
    },
  },

  // Plugins (e.g. PayPal)
  plugins: [
    {
      resolve: "medusa-payment-paypal",
      options: {
        sandbox: process.env.PAYPAL_SANDBOX === "true",
        client_id: process.env.PAYPAL_CLIENT_ID,
        client_secret: process.env.PAYPAL_CLIENT_SECRET,
        auth_webhook_id: process.env.PAYPAL_AUTH_WEBHOOK_ID,
      },
    },
    // …any other plugins
  ],
})
