import { facetTitle, facetValueLabel } from "@/components/search/facet-labels"
import { priceAttribute, indexedCurrency } from "@/lib/search-client"
import { formatPrice } from "@/lib/utils/price"
import { XMark } from "@medusajs/icons"
import type { CurrentRefinementsConnectorParamsItem } from "instantsearch.js/es/connectors/current-refinements/connectCurrentRefinements"
import { useClearRefinements, useCurrentRefinements } from "react-instantsearch"

const chipClassName =
  "flex items-center gap-x-1.5 border border-neutral-300 px-3 py-1.5 text-xs text-neutral-900 hover:border-neutral-900 transition-colors"

const priceLabel = (
  item: CurrentRefinementsConnectorParamsItem,
  currencyCode: string
) => {
  const format = (amount: number) =>
    formatPrice({ amount, currency_code: indexedCurrency(currencyCode) })

  const min = item.refinements.find((r) => r.operator === ">=")?.value
  const max = item.refinements.find((r) => r.operator === "<=")?.value

  if (typeof min === "number" && typeof max === "number") {
    return `${format(min)} - ${format(max)}`
  }

  if (typeof min === "number") {
    return `From ${format(min)}`
  }

  if (typeof max === "number") {
    return `Up to ${format(max)}`
  }

  return undefined
}

type AppliedRefinementsProps = {
  currencyCode: string
}

export const AppliedRefinements = ({
  currencyCode,
}: AppliedRefinementsProps) => {
  const { items } = useCurrentRefinements()
  const { refine: clearAll, canRefine: canClearAll } = useClearRefinements()

  const priceAttributeName = priceAttribute("min_price", currencyCode)
  // Both edges clear together: removing them one at a time would run a search
  // per edge and leave a half-applied range on screen in between.
  const { refine: clearPrice } = useClearRefinements({
    includedAttributes: [priceAttributeName],
  })

  if (!canClearAll) {
    return null
  }

  const priceItem = items.find((item) => item.attribute === priceAttributeName)
  const priceChipLabel = priceItem && priceLabel(priceItem, currencyCode)

  return (
    <div
      className="flex flex-wrap items-center gap-2 py-4"
      data-testid="applied-refinements"
    >
      {priceChipLabel && (
        <button
          type="button"
          onClick={clearPrice}
          className={chipClassName}
          data-testid="applied-refinement"
        >
          <span className="text-neutral-500">Price:</span>
          <span>{priceChipLabel}</span>
          <XMark className="w-3 h-3 text-neutral-600" />
        </button>
      )}

      {items
        .filter((item) => item.attribute !== priceAttributeName)
        .map((item) =>
          item.refinements.map((refinement) => {
            const rawValue = String(refinement.value)
            const title = facetTitle(item.attribute, rawValue)
            const isToggle = item.attribute.startsWith("on_sale_")
            const value = facetValueLabel(item.attribute, refinement.label)

            return (
              <button
                key={`${item.attribute}-${refinement.label}-${refinement.value}`}
                type="button"
                onClick={() => item.refine(refinement)}
                className={chipClassName}
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
