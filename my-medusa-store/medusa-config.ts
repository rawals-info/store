// my-medusa-store/medusa-config.ts
import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

export default defineConfig({
  projectConfig: {
    // Database
    databaseUrl: process.env.DATABASE_URL!,

    // HTTP / CORS / Secrets
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },

    // Worker mode (“server” | “worker” | “shared”)
    workerMode:
      (process.env.MEDUSA_WORKER_MODE as "server" | "worker" | "shared") ||
      "server",
  },

  // Admin UI settings (enable/disable via env)
  admin: {
    // When true, Medusa will NOT serve the Admin
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    // For server mode: tell the built Admin where the backend lives
    backendUrl: process.env.MEDUSA_BACKEND_URL,
    path: "../packages/admin", 
  },

  // Redis‑backed Event Bus & Cache
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
