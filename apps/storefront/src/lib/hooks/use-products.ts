import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import { HttpTypes } from "@medusajs/types"
import { queryKeys } from "@/lib/utils/query-keys"
import { sdk } from "@/lib/utils/sdk"

export const useProducts = ({
  query_params,
  region_id,
}: {
  query_params?: HttpTypes.StoreProductListParams
  region_id?: string
} = {}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.products.list(query_params, region_id),
    queryFn: async ({ pageParam }) => {
      const limit = query_params?.limit || 12
      const _page_param = Math.max(pageParam, 1)
      const offset = _page_param === 1 ? 0 : (_page_param - 1) * limit

      const response = await sdk.store.product.list({
        limit,
        offset,
        region_id,
        fields: "id,title,handle,thumbnail,*images,*variants,*variants.calculated_price,*variants.images,*variants.thumbnail,*variants.options",
        ...query_params,
      })

      const next_page = offset + limit < response.count ? _page_param + 1 : null

      return {
        products: response.products,
        count: response.count,
        next_page,
      }
    },
    getNextPageParam: (lastPage) => lastPage.next_page,
    getPreviousPageParam: (firstPage) => firstPage.next_page,
    initialPageParam: 1,
    enabled: !!region_id,
  })
}

export const useProduct = ({
  handle,
  region_id,
  fields,
}: {
  handle: string;
  region_id?: string;
  fields?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.products.detail(handle, region_id),
    queryFn: async () => {
      const { products } = await sdk.store.product.list({
        handle: handle,
        region_id,
        fields: fields ||
          "*variants, +variants.inventory_quantity, +variants.manage_inventory, +variants.allow_backorder, *images, *options, *options.values, *collection, *tags",
      })

      if (!products || products.length === 0) {
        throw new Error(`Product with handle ${handle} not found`)
      }

      return products[0]
    },
    enabled: !!handle && !!region_id,
  })
}

export const useRelatedProducts = ({
  product_id,
  region_id,
  collection_id,
  tags,
}: {
  product_id: string;
  region_id?: string;
  collection_id?: string;
  tags?: string[];
}) => {
  return useQuery({
    queryKey: queryKeys.products.related(product_id, region_id),
    queryFn: async () => {
      const params: HttpTypes.StoreProductListParams = {
        fields: "title, handle, *thumbnail, *variants",
        is_giftcard: false,
        limit: 4
      }

      if (collection_id) {
        params.collection_id = [collection_id]
      }

      if (tags && tags.length > 0) {
        params.tag_id = tags
      }

      const response = await sdk.store.product.list({
        ...params,
        region_id,
      })

      return response.products.filter((product) => product.id !== product_id)
    },
    enabled: !!product_id && !!region_id,
  })
}

export const useLatestProducts = ({
  limit = 4,
  region_id,
}: {
  limit?: number
  region_id?: string
} = {}) => {
  return useQuery({
    queryKey: queryKeys.products.latest(limit, region_id),
    queryFn: async () => {
      const response = await sdk.store.product.list({
        limit,
        offset: 0,
        order: "-created_at",
        region_id,
      })

      return {
        products: response.products,
        count: response.count,
        next_page: null,
      }
    },
    enabled: !!region_id,
  })
}
