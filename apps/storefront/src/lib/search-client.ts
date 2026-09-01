import {
  createInstantSearchAdapter,
  mergeFiltersAnd,
  parseSearchParams,
  type MedusaSdkLike,
} from "@medusajs/instantsearch-adapter"

import { sdk } from "@/lib/utils/sdk"

export const PRODUCT_INDEX_NAME = "product"

export const PINNED_FILTERS_PARAM = "medusaPinnedFilters"

export type PinnedFilters = Partial<Record<"category", string[]>>

export const { searchClient } = createInstantSearchAdapter({
  sdk: sdk as unknown as MedusaSdkLike,
  path: "/store/search",
  numericAttributes: ["min_price"],
  additionalSearchParameters: {
    search_options: {
      count: "exact",
    },
  },
  transformQuery: (query, request) => {
    const params = parseSearchParams(request.params) as Record<string, unknown>
    const pinned = params[PINNED_FILTERS_PARAM] as PinnedFilters | undefined

    if (!pinned) {
      return query
    }

    let filters = query.filters

    for (const [field, values] of Object.entries(pinned)) {
      if (!Array.isArray(values) || !values.length) {
        continue
      }

      filters = mergeFiltersAnd(filters, { [field]: { $in: values } })
    }

    return filters ? { ...query, filters } : query
  },
})

export const PRODUCT_FACETS = {
  category: "category",
  optionValues: "option_values",
  onSale: "on_sale",
  minPrice: "min_price",
} as const

export const productSortIndex = (
  field: "title" | "created_at" | "min_price",
  direction: "asc" | "desc"
) => `${PRODUCT_INDEX_NAME}/sort/${field}:${direction}`

export const PRODUCT_SORT_OPTIONS = [
  { label: "Relevance", value: PRODUCT_INDEX_NAME },
  { label: "Newest", value: productSortIndex("created_at", "desc") },
  { label: "Price: Low to High", value: productSortIndex("min_price", "asc") },
  { label: "Price: High to Low", value: productSortIndex("min_price", "desc") },
  { label: "A-Z", value: productSortIndex("title", "asc") },
]

export const PRODUCTS_PER_PAGE = 12
