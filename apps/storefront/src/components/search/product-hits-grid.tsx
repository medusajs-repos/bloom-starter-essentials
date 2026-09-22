import {
  ProductHitCard,
  type ProductGridHit,
} from "@/components/search/product-hit-card"
import { Button } from "@/components/ui/button"
import { useSearchSettled } from "@/lib/hooks/use-search-settled"
import { useInfiniteHits, useInstantSearch } from "react-instantsearch"

type ProductHitsGridProps = {
  countryCode: string
  currencyCode: string
}

export const ProductHitsGrid = ({
  countryCode,
  currencyCode,
}: ProductHitsGridProps) => {
  const { items, showMore, isLastPage, showPrevious, isFirstPage } =
    useInfiniteHits<ProductGridHit>()
  const { status, error } = useInstantSearch()
  const { isSettled } = useSearchSettled()

  if (status === "error") {
    return (
      <p className="py-12 text-sm text-red-600" data-testid="search-error">
        Couldn&apos;t load products{error?.message ? `: ${error.message}` : "."}
      </p>
    )
  }

  if (!isSettled && !items.length) {
    return (
      <p className="py-12 text-neutral-600" data-testid="search-loading">
        Loading...
      </p>
    )
  }

  if (!items.length) {
    return (
      <p className="py-12 text-neutral-600" data-testid="search-no-results">
        No products found
      </p>
    )
  }

  return (
    <>
      {!isFirstPage && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={showPrevious}
            variant="secondary"
            size="fit"
            className="px-8 py-3 uppercase text-xs font-semibold tracking-wider"
            data-testid="load-previous"
          >
            Load previous
          </Button>
        </div>
      )}

      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 py-8"
        data-testid="product-hits"
      >
        {items.map((hit) => (
          <ProductHitCard
            key={hit.objectID}
            hit={hit}
            countryCode={countryCode}
            currencyCode={currencyCode}
          />
        ))}
      </div>

      {!isLastPage && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={showMore}
            variant="secondary"
            size="fit"
            className="px-8 py-3 uppercase text-xs font-semibold tracking-wider"
            data-testid="load-more"
          >
            Load more
          </Button>
        </div>
      )}
    </>
  )
}
