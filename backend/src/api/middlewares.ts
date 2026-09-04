import {
  defineMiddlewares,
  authenticate,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http"

import { PostStoreReviewSchema } from "./store/reviews/route"
import { GetStoreReviewsSchema } from "./store/products/[id]/reviews/route"
import { GetAdminReviewsSchema } from "./admin/reviews/route"
import { PostAdminUpdateReviewsStatusSchema } from "./admin/reviews/status/route"
import { GetAdminAbandonedCartsSchema } from "./admin/abandoned-carts/route"
import { PostAdminAbandonedCartNotifySchema } from "./admin/abandoned-carts/notify/route"

export default defineMiddlewares({
  routes: [
    {
      method: ["GET"],
      matcher: "/admin/abandoned-carts",
      middlewares: [
        authenticate("user", ["session", "bearer"]),
        validateAndTransformQuery(GetAdminAbandonedCartsSchema, {
          isList: true,
        }),
      ],
    },
    {
      method: ["GET"],
      matcher: "/admin/abandoned-carts/:id",
      middlewares: [
        authenticate("user", ["session", "bearer"]),
      ],
    },
    {
      method: ["POST"],
      matcher: "/admin/abandoned-carts/notify",
      middlewares: [
        authenticate("user", ["session", "bearer"]),
        validateAndTransformBody(PostAdminAbandonedCartNotifySchema),
      ],
    },
    {
      method: ["POST"],
      matcher: "/store/reviews",
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
        validateAndTransformBody(PostStoreReviewSchema),
      ],
    },
    {
      method: ["GET"],
      matcher: "/store/products/:id/reviews",
      middlewares: [
        validateAndTransformQuery(GetStoreReviewsSchema, {
          isList: true,
          defaults: [
            "id",
            "rating",
            "title",
            "first_name",
            "last_name",
            "content",
            "created_at",
          ],
        }),
      ],
    },
    {
      method: ["GET"],
      matcher: "/admin/reviews",
      middlewares: [
        validateAndTransformQuery(GetAdminReviewsSchema, {
          isList: true,
          defaults: [
            "id",
            "title",
            "content",
            "rating",
            "product_id",
            "customer_id",
            "status",
            "created_at",
            "updated_at",
            "product.*",
          ],
        }),
      ],
    },
    {
      method: ["POST"],
      matcher: "/admin/reviews/status",
      middlewares: [
        validateAndTransformBody(PostAdminUpdateReviewsStatusSchema),
      ],
    },
  ],
})
