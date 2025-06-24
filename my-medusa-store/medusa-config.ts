import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    redisUrl: process.env.REDIS_URL,
  },
  /**
   * Register additional infrastructure modules
   * – Event Bus powered by Redis (BullMQ under the hood)
   *   See docs: https://docs.medusajs.com/v1/development/events/modules/redis
   */
  modules: {
    eventBus: {
      resolve: "@medusajs/event-bus-redis",
      options: {
        redisUrl: process.env.EVENTS_REDIS_URL || process.env.REDIS_URL,
      },
    },
    // cacheService: {
    //   resolve: "@medusajs/medusa/cache-redis",
    //   options: {
    //     redisUrl: process.env.CACHE_REDIS_URL || process.env.REDIS_URL,
    //   },
    // },
  },
})
