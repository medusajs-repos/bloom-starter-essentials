import {
  createInstantSearchAdapter,
  mergeFiltersAnd,
  parseSearchParams,
  type MedusaSdkLike,
} from "@medusajs/instantsearch-adapter"

import { sdk } from "@/lib/utils/sdk"

export const PRODUCT_INDEX_NAME = "product"

/**
 * The currencies the product index holds prices in, one field set each. Keep in
 * sync with `PRICE_CURRENCIES` in the backend's `src/search/helpers/pricing.ts`.
 */
export const SEARCH_PRICE_CURRENCIES = ["usd", "eur", "gbp", "dkk"]

export type PriceField =
  | "min_price"
  | "max_price"
  | "original_price"
  | "on_sale"

/**
 * The indexed currency to read prices in for a region. A region whose currency
 * the index doesn't hold falls back to the first one, so the listing still
 * shows a price rather than none.
 */
export const indexedCurrency = (currencyCode: string) => {
  const code = currencyCode.toLowerCase()
  return SEARCH_PRICE_CURRENCIES.includes(code)
    ? code
    : SEARCH_PRICE_CURRENCIES[0]
}

export const priceAttribute = (field: PriceField, currencyCode: string) =>
  `${field}_${indexedCurrency(currencyCode)}`

export const PINNED_FILTERS_PARAM = "medusaPinnedFilters"

export type PinnedFilters = Partial<Record<"category", string[]>>

export const { searchClient } = createInstantSearchAdapter({
  sdk: sdk as unknown as MedusaSdkLike,
  path: "/store/search",
  // Range widgets read `facets_stats`, which the adapter only produces for
  // fields listed here. The price fields are declared with a `stats` facet on
  // the index, which is what makes the stats available at all.
  numericAttributes: SEARCH_PRICE_CURRENCIES.flatMap((currency) => [
    `min_price_${currency}`,
    `max_price_${currency}`,
  ]),
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

/**
 * The facets that are the same whatever the region sells in. The price and
 * on-sale facets are per currency, so they come from `priceAttribute`.
 */
export const PRODUCT_FACETS = {
  category: "category",
  optionValues: "option_values",
} as const

export const productSortIndex = (field: string, direction: "asc" | "desc") =>
  `${PRODUCT_INDEX_NAME}/sort/${field}:${direction}`

export const getProductSortOptions = (currencyCode: string) => {
  const minPrice = priceAttribute("min_price", currencyCode)

  return [
    { label: "Relevance", value: PRODUCT_INDEX_NAME },
    { label: "Newest", value: productSortIndex("created_at", "desc") },
    { label: "Price: Low to High", value: productSortIndex(minPrice, "asc") },
    { label: "Price: High to Low", value: productSortIndex(minPrice, "desc") },
    { label: "A-Z", value: productSortIndex("title", "asc") },
  ]
}

export const PRODUCTS_PER_PAGE = 12
