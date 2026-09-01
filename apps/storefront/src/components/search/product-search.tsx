import { AppliedRefinements } from "@/components/search/applied-refinements"
import { FacetCheckboxList } from "@/components/search/facet-checkbox-list"
import { HitsCount } from "@/components/search/hits-count"
import { OnSaleToggle } from "@/components/search/on-sale-toggle"
import { OptionValuesRefinement } from "@/components/search/option-values-refinement"
import { PriceRangeRefinement } from "@/components/search/price-range-refinement"
import { ProductHitsGrid } from "@/components/search/product-hits-grid"
import { SortBySelect } from "@/components/search/sort-by-select"
import {
  PINNED_FILTERS_PARAM,
  PRODUCT_FACETS,
  PRODUCT_INDEX_NAME,
  PRODUCTS_PER_PAGE,
  searchClient,
  type PinnedFilters,
} from "@/lib/search-client"
import { ClientOnly, useRouter } from "@tanstack/react-router"
import type { SearchClient } from "instantsearch.js"
import historyRouter from "instantsearch.js/es/lib/routers/history"
import { useMemo } from "react"
import { Configure, InstantSearch } from "react-instantsearch"

type ProductSearchProps = {
  countryCode: string
  pinnedFilters?: PinnedFilters
}

export const ProductSearch = ({
  countryCode,
  pinnedFilters,
}: ProductSearchProps) => {
  const hasPin = Boolean(
    pinnedFilters &&
      Object.values(pinnedFilters).some((values) => values?.length)
  )
  const hasPinnedCategory = Boolean(pinnedFilters?.category?.length)
  const router = useRouter()

  const routing = useMemo(
    () => ({
      router: historyRouter({
        push(url: string) {
          const { pathname, search, hash } = new URL(url, window.location.href)

          router.navigate({
            href: `${pathname}${search}${hash}`,
            resetScroll: false,
          })
        },
      }),
    }),
    [router]
  )

  return (
    <ClientOnly
      fallback={<div className="py-12 text-neutral-600">Loading products...</div>}
    >
      <InstantSearch
        indexName={PRODUCT_INDEX_NAME}
        searchClient={searchClient as unknown as SearchClient}
        routing={routing}
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <Configure
          hitsPerPage={PRODUCTS_PER_PAGE}
          {...(hasPin ? { [PINNED_FILTERS_PARAM]: pinnedFilters } : undefined)}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <h2 className="text-lg font-display font-semibold text-neutral-900 uppercase tracking-wide mb-6">
              Filters
            </h2>

            <div className="flex flex-col gap-y-8">
              {!hasPinnedCategory && (
                <FacetCheckboxList
                  attribute={PRODUCT_FACETS.category}
                  title="Category"
                />
              )}
              <OptionValuesRefinement />
              <PriceRangeRefinement />
              <OnSaleToggle />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 py-6 border-b border-neutral-200">
              <HitsCount />
              <SortBySelect />
            </div>

            <AppliedRefinements />

            <ProductHitsGrid countryCode={countryCode} />
          </div>
        </div>
      </InstantSearch>
    </ClientOnly>
  )
}
