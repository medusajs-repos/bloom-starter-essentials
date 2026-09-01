import {
  createInstantSearchAdapter,
  mergeFiltersAnd,
  parseSearchParams,
  type MedusaSdkLike,
} from "@medusajs/instantsearch-adapter"

import { sdk } from "@/lib/utils/sdk"

export const PRODUCT_INDEX_NAME = "product"

// Carries a surface's pinned filters from `Configure` to `transformQuery`, as
// `{ field: values }`. Not an Algolia param — InstantSearch passes unknown ones
// through untouched, on every query it builds.
// A pin can't go through `Configure`'s `facetFilters`: algoliasearch-helper
// deep-merges that array element-wise with the one built from the refinement
// widgets, so one ticked filter collapses both into a single OR group and the
// pin is lost. `transformQuery` runs after that, and `mergeFiltersAnd` is a
// real AND.
export const PINNED_FILTERS_PARAM = "medusaPinnedFilters"

// Fields a surface may pin itself to. Each must be `filterable()` on the index;
// a pin goes through the query's filters, never through a facet.
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
  // ANDs a surface's pinned filters onto whatever the customer refined. `$in`
  // is the same operator a refinement list produces, so a scoped page and its
  // sidebar speak to the engine in one voice.
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
