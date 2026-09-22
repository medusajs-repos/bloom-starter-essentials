import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { SearchHit, type ProductHit } from "@/components/search/search-hit"
import { useSearchSettled } from "@/lib/hooks/use-search-settled"
import { PRODUCT_INDEX_NAME, searchClient } from "@/lib/search-client"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { MagnifyingGlass } from "@medusajs/icons"
import { useLocation } from "@tanstack/react-router"
import type { SearchClient } from "instantsearch.js"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  Configure,
  InstantSearch,
  useHits,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch"

const HITS_PER_PAGE = 12
const DEBOUNCE_MS = 250

type SearchPanelProps = {
  countryCode: string
  onNavigate: () => void
}

const SearchPanel = ({ countryCode, onNavigate }: SearchPanelProps) => {
  const timer = useRef<number | undefined>(undefined)

  const queryHook = useCallback(
    (nextQuery: string, search: (value: string) => void) => {
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => search(nextQuery), DEBOUNCE_MS)
    },
    []
  )

  const { query, refine } = useSearchBox({ queryHook })
  const { items } = useHits<ProductHit>()
  const { status, error } = useInstantSearch()
  const { isSettled, resultsQuery } = useSearchSettled()

  const [inputValue, setInputValue] = useState(query)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const trimmedInput = inputValue.trim()
  const trimmedQuery = query.trim()

  const hasInput = Boolean(trimmedInput)
  // The debounce hasn't fired yet, so `query` is still the previous search.
  const isPending = trimmedInput !== trimmedQuery
  const hasResults = hasInput && Boolean(resultsQuery) && items.length > 0

  return (
    <>
      <div className="flex items-center gap-x-3 border-b border-zinc-200 px-6">
        <MagnifyingGlass className="flex-shrink-0 text-neutral-500" />
        <input
          type="search"
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value)
            refine(event.target.value)
          }}
          placeholder="Search products"
          aria-label="Search products"
          autoFocus
          className="w-full bg-transparent py-4 text-base text-neutral-900 outline-none placeholder:text-neutral-500"
          data-testid="search-input"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {!hasInput ? (
          <p
            className="px-6 py-6 text-center text-sm text-neutral-500"
            data-testid="search-empty"
          >
            Start typing to search for products.
          </p>
        ) : status === "error" ? (
          <p
            className="px-6 py-6 text-center text-sm text-red-600"
            data-testid="search-error"
          >
            Couldn&apos;t search products
            {error?.message ? `: ${error.message}` : "."}
          </p>
        ) : hasResults ? (
          <ul className="py-2" data-testid="search-results">
            {items.map((hit) => (
              <SearchHit
                key={hit.objectID}
                hit={hit}
                countryCode={countryCode}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        ) : 
        !isSettled || isPending || !trimmedQuery ? null : (
          <p
            className="px-6 py-6 text-center text-sm text-neutral-600"
            data-testid="search-no-results"
          >
            No products found for &quot;{trimmedQuery}&quot;
          </p>
        )}
      </div>
    </>
  )
}

export const SearchDrawer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname) || "us"

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger
        aria-label="Search products"
        className="flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-colors"
        data-testid="nav-search-button"
      >
        <MagnifyingGlass className="w-5 h-5" />
      </DrawerTrigger>
      <DrawerContent side="right" className="flex flex-col">
        <DrawerHeader>
          <DrawerTitle className="uppercase font-display text-lg tracking-wide">
            Search
          </DrawerTitle>
        </DrawerHeader>
        <InstantSearch
          indexName={PRODUCT_INDEX_NAME}
          searchClient={searchClient as unknown as SearchClient}
          future={{ preserveSharedStateOnUnmount: true }}
        >
          <Configure hitsPerPage={HITS_PER_PAGE} />
          <SearchPanel
            countryCode={countryCode}
            onNavigate={() => setIsOpen(false)}
          />
        </InstantSearch>
      </DrawerContent>
    </Drawer>
  )
}
