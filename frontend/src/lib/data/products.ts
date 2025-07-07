"use server"

import { sdk } from "@lib/config"
import { getRegion } from "@lib/data/regions"
import { cache } from "react"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getCollectionByHandle } from "@lib/data/collections"

const getProducts = cache(
  async (
    queryParams: Omit<HttpTypes.StoreProductParams, "region_id">,
    regionId: string
  ) => {
    return sdk.client.fetch<{
      products: HttpTypes.StoreProduct[];
      count: number;
    }>(`/store/products`, {
      method: "GET",
      query: { ...queryParams, region_id: regionId },
      next: {
        tags: ["products"],
      },
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
  const region = regionId ? { id: regionId } : await getRegion(countryCode!)
  
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
    region.id
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
    // Kick off region lookup and a lightweight product skeleton fetch in parallel
    const regionPromise = getRegion(countryCode)

    // Fetch product without region so we at least have a skeleton quickly
    const productSkeletonPromise = sdk.client
      .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
        query: { handle, limit: 1 },
        next: {
          revalidate: 300,
          tags: ["products", `product-handle-${handle}`],
        },
      })
      .then((res) => res.products?.[0] || null)
      .catch(() => null)

    const [region, productSkeleton] = await Promise.all([regionPromise, productSkeletonPromise])

    if (!region) {
      // No region information – return skeleton as-is
      return { product: productSkeleton, relatedProducts: [], region: null as any }
    }

    // Fetch region-aware pricing/details in parallel with related products lookup
    const detailedProductPromise = sdk.client
      .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
        query: { handle, limit: 1, region_id: region.id },
      })
      .then((res) => res.products?.[0] || productSkeleton)
      .catch(() => productSkeleton)

    // Related products can be fetched lazily – keep cheap for now
    const detailedProduct = await detailedProductPromise

    return {
      product: detailedProduct,
      relatedProducts: [],
      region,
    }
  }
)

export const getInitialProducts = cache(async (countryCode: string) => {
  const region = await getRegion(countryCode)
  const { products } = await getProducts({ limit: 10 }, region!.id)
  return products
})

export const getHomepageProducts = cache(async (countryCode: string) => {
  // Fetch region and collection in parallel to reduce latency
  const [region, featuredCollection] = await Promise.all([
    getRegion(countryCode),
    getCollectionByHandle("featured-products").catch(() => null),
  ])

  if (!featuredCollection || !region) {
    return { featuredProducts: [] }
  }

  const { products: featuredProducts } = await getProducts(
    { limit: 24, collection_id: [featuredCollection.id] } as any,
    region.id
  )

  return { featuredProducts }
})
