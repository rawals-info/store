"use server"

import { sdk } from "@lib/config"
import { getIndiaRegion } from "@lib/constants/india-region"
import { PRODUCT_FIELDS } from "@lib/constants/api-fields"
import { cache } from "react"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getCollectionByHandle } from "@lib/data/collections"
import { StoreProductReview } from "../../types/global"
import { getAuthHeaders, getCacheOptions } from "./cookies"


const getProducts = cache(
  async (
    queryParams: Omit<HttpTypes.StoreProductParams, "region_id">,
    regionId: string,
    fields: string = PRODUCT_FIELDS.LIST
  ) => {
    return sdk.client.fetch<{
      products: HttpTypes.StoreProduct[];
      count: number;
    }>(`/store/products`, {
      method: "GET",
      query: { ...queryParams, region_id: regionId, fields },
      next: {
        tags: ["products"],
        revalidate: 1800, // 30 minutes aggressive caching
      },
      cache: "force-cache",
    });
  }
);

export const listProducts = async ({
  pageParam = 1,
  queryParams = {},
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.StoreProductParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.StoreProductParams
}> => {
  const region = regionId ? { id: regionId } : getIndiaRegion()
  
  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const limit = queryParams?.limit || 12
  const offset = (pageParam - 1) * limit

  const { products, count } = await getProducts(
    { ...queryParams, limit, offset },
    region.id,
    PRODUCT_FIELDS.LIST // Use optimized fields for product listings
  )

  const nextPage = count > offset + limit ? pageParam + 1 : null

  return {
    response: { products, count },
    nextPage,
    queryParams,
  }
}

export const getProductByHandle = cache(
  async (
    handle: string,
    regionId: string
  ): Promise<HttpTypes.StoreProduct | null> => {
    const { products } = await getProducts(
      { handle: handle, limit: 1 } as any, // <--- THIS IS THE CORRECT LINE.
      regionId
    );
    return products[0] ?? null;
  }
)

const getProductsByCollectionId = async (
  collectionId: string,
  regionId: string,
  productIdToExclude: string
): Promise<HttpTypes.StoreProduct[]> => {
  const { products } = await getProducts(
    {
      collection_id: [collectionId],
      limit: 5,
    } as any, // <--- ADD 'as any' HERE
    regionId
  )
  return products.filter((p) => p.id !== productIdToExclude).slice(0, 4)
}

const getProductsByTag = async (
  tags: string[],
  regionId: string,
  productIdToExclude: string
): Promise<HttpTypes.StoreProduct[]> => {
  const { products } = await getProducts(
    {
      tags: tags,
      limit: 5,
    } as any, // <--- ADD 'as any' HERE
    regionId
  )
  return products.filter((p) => p.id !== productIdToExclude).slice(0, 4)
}

const getProductsByCategoryId = async (
  categoryIds: string[],
  regionId: string,
  productIdToExclude: string
): Promise<HttpTypes.StoreProduct[]> => {
  const { products } = await getProducts(
    {
      category_id: categoryIds,
      limit: 5,
    } as any, // <--- ADD 'as any' HERE
    regionId
  )
  return products.filter((p) => p.id !== productIdToExclude).slice(0, 4)
}

export const getRelatedProducts = cache(
  async (
    productId: string,
    regionId: string
  ): Promise<HttpTypes.StoreProduct[]> => {
    const { products: p } = await getProducts(
      { id: [productId] } as any, // <--- ADD 'as any' HERE
      regionId
    )
    const product = p[0]

    if (!product) {
      return []
    }

    let relatedProducts: HttpTypes.StoreProduct[] = []

    if (product.collection_id) {
      relatedProducts = await getProductsByCollectionId(
        product.collection_id,
        regionId,
        productId
      )
    }

    if (relatedProducts.length < 4 && product.tags) {
      const moreProducts = await getProductsByTag(
        product.tags.map((t) => t.value),
        regionId,
        productId
      )
      relatedProducts = [...relatedProducts, ...moreProducts]
    }

    if (relatedProducts.length < 4 && product.categories) {
      const moreProducts = await getProductsByCategoryId(
        product.categories.map((c) => c.id),
        regionId,
        productId
      )
      relatedProducts = [...relatedProducts, ...moreProducts]
    }

    return relatedProducts.slice(0, 4)
  }
)

export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.StoreProductParams
}> => {
  const sortingOptions = {
    price_asc: { order: "variants.calculated_price:asc" },
    price_desc: { order: "variants.calculated_price:desc" },
    created_at: { order: "created_at:desc" },
  }

  const { response, nextPage } = await listProducts({
    pageParam: page,
    queryParams: {
      ...queryParams,
      ...(sortingOptions[sortBy] || {}),
    },
    countryCode,
  })

  return { response, nextPage, queryParams }
}

// Optimized version of getProductData
export const getProductData = cache(
  async (
    handle: string,
    countryCode: string
  ): Promise<{
    product: HttpTypes.StoreProduct | null
    relatedProducts: HttpTypes.StoreProduct[]
    region: HttpTypes.StoreRegion | null
  }> => {
    // Use hardcoded India region instead of API call
    const region = getIndiaRegion()

    // Fetch product with region-aware pricing directly
    const detailedProduct = await sdk.client
      .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
        query: { 
          handle, 
          limit: 1, 
          region_id: region.id,
          fields: PRODUCT_FIELDS.DETAIL // Use detailed fields for product pages
        },
        next: {
          revalidate: 1800, // 30 minutes for product data
          tags: ["products", `product-handle-${handle}`],
        },
        cache: "force-cache",
      })
      .then((res) => res.products?.[0] || null)
      .catch(() => null)

    return {
      product: detailedProduct,
      relatedProducts: [],
      region,
    }
  }
)

export const getInitialProducts = cache(async (countryCode: string) => {
  const region = getIndiaRegion()
  const { products } = await getProducts({ limit: 10 }, region!.id)
  return products
})

export const getHomepageProducts = cache(async (countryCode: string) => {
  // Use hardcoded India region and fetch collection
  const region = getIndiaRegion()
  const featuredCollection = await getCollectionByHandle("featured-products").catch(() => null)

  if (!featuredCollection || !region) {
    return { featuredProducts: [] }
  }

  const { products: featuredProducts } = await getProducts(
    { limit: 24, collection_id: [featuredCollection.id] } as any,
    region.id
  )

  return { featuredProducts }
})


export const getProductReviews = async ({
  productId,
  limit = 10,
  offset = 0,
}: {
  productId: string
  limit?: number
  offset?: number 
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions(`product-reviews-${productId}`)),
  }

  return sdk.client.fetch<{
    reviews: StoreProductReview[]
    average_rating: number
    limit: number
    offset: number
    count: number
  }>(`/store/products/${productId}/reviews`, {
    headers,
    query: {
      limit,
      offset,
      order: "-created_at",
    },
    next,
    cache: "force-cache",
  })
}

export const getProductReviewSummary = async (productId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions(`product-review-summary-${productId}`)),
  }

  try {
    return await sdk.client.fetch<{
      average_rating: number
      count: number
    }>(`/store/products/${productId}/reviews`, {
      headers,
      query: {
        limit: 1, // We only need the summary data
        offset: 0,
      },
      next,
      cache: "force-cache",
    })
  } catch (error) {
    // Return default values if no reviews or error
    return {
      average_rating: 0,
      count: 0
    }
  }
}

export const addProductReview = async (input: {
  title?: string
  content: string
  first_name: string
  last_name: string
  rating: number,
  product_id: string
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client.fetch(`/store/reviews`, {
    method: "POST",
    headers,
    body: input,
    next: {
      ...(await getCacheOptions(`product-reviews-${input.product_id}`)),
    },
    cache: "no-store",
  })
}