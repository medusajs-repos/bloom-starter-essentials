import { facetTitle, facetValueLabel } from "@/components/search/facet-labels"
import { PRODUCT_FACETS } from "@/lib/search-client"
import { XMark } from "@medusajs/icons"
import { useClearRefinements, useCurrentRefinements } from "react-instantsearch"

export const AppliedRefinements = () => {
  const { items } = useCurrentRefinements()
  const { refine: clearAll, canRefine: canClearAll } = useClearRefinements()

  if (!canClearAll) {
    return null
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2 py-4"
      data-testid="applied-refinements"
    >
      {items.map((item) =>
        item.refinements.map((refinement) => {
          const rawValue = String(refinement.value)
          const title = facetTitle(item.attribute, rawValue)
          const isToggle = item.attribute === PRODUCT_FACETS.onSale
          const value = facetValueLabel(item.attribute, refinement.label)

          return (
            <button
              key={`${item.attribute}-${refinement.label}-${refinement.value}`}
              type="button"
              onClick={() => item.refine(refinement)}
              className="flex items-center gap-x-1.5 border border-neutral-300 px-3 py-1.5 text-xs text-neutral-900 hover:border-neutral-900 transition-colors"
              data-testid="applied-refinement"
            >
              {isToggle ? (
                <span>{title}</span>
              ) : (
                <>
                  <span className="text-neutral-500">{title}:</span>
                  <span>{value}</span>
                </>
              )}
              <XMark className="w-3 h-3 text-neutral-600" />
            </button>
          )
        })
      )}

      <button
        type="button"
        onClick={clearAll}
        className="text-xs uppercase tracking-wider text-neutral-600 hover:text-neutral-900 underline underline-offset-4 transition-colors"
        data-testid="clear-refinements"
      >
        Clear all
      </button>
    </div>
  )
}
