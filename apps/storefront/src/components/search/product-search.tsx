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
  /**
   * What this surface is scoped to, ANDed onto every search. A category page
   * pins `category`; the store page pins nothing.
   *
   * When `category` is pinned, its filter is dropped from the sidebar — the
   * page is already that filter, and offering it again only invites the
   * customer to "narrow" to what they are looking at.
   */
  pinnedFilters?: PinnedFilters
}

/**
 * A search-backed product grid: filters, sort and paging, all from one
 * `InstantSearch` provider over the shared client.
 *
 * Every refinement reaches the search query — nothing is filtered or sorted in
 * the browser — so the grid never holds results the customer has excluded. The
 * client's `placeholderSearch` default is what lets this work without a query
 * box: an empty query matches the whole catalogue.
 */
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

  /**
   * InstantSearch's default router writes the URL with a bare
   * `window.history.pushState`. TanStack Router patches `pushState`, so it sees
   * that as a fresh navigation — and with the router's `scrollRestoration`
   * enabled, a fresh navigation resets the scroll to the top of the page.
   *
   * Refinements and sorting mostly hide that, since the controls sit at the top
   * anyway. "Load more" does not: its button is at the bottom of the list, and
   * jumping to the top is the opposite of what the customer asked for.
   *
   * Writing through the router instead, with `resetScroll` off, keeps the URL
   * in sync without the jump. Memoized because a new router object on every
   * render would tear down and re-create InstantSearch's URL sync.
   */
  const routing = useMemo(
    () => ({
      router: historyRouter({
        push(url: string) {
          // InstantSearch always builds an absolute URL; TanStack wants an
          // in-app href, or it treats the navigation as external.
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
    /**
     * InstantSearch's `history` router reads `window.location`, and throws
     * outright when there is no `window`. The whole experience is therefore
     * client-only; the server renders the placeholder below instead.
     */
    <ClientOnly
      fallback={<div className="py-12 text-neutral-600">Loading products...</div>}
    >
      <InstantSearch
        indexName={PRODUCT_INDEX_NAME}
        searchClient={searchClient as unknown as SearchClient}
        // Puts the filters, the sort and the page in the URL, so a refined list
        // can be shared and survives a reload.
        routing={routing}
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <Configure
          // Matches the `limit: 12` the storefront's other product lists use.
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
