import { Checkbox } from "@/components/ui/checkbox"
import { priceAttribute } from "@/lib/search-client"
import { useToggleRefinement } from "react-instantsearch"

type OnSaleToggleProps = {
  currencyCode: string
}

export const OnSaleToggle = ({ currencyCode }: OnSaleToggleProps) => {
  const { value, refine, canRefine } = useToggleRefinement({
    attribute: priceAttribute("on_sale", currencyCode),
    on: true,
  })

  if (!canRefine && !value.isRefined) {
    return null
  }

  return (
    <label
      className="flex items-center gap-x-3 cursor-pointer text-sm text-neutral-700 hover:text-neutral-900"
      data-testid="facet-on_sale"
    >
      <Checkbox
        checked={value.isRefined}
        onChange={() => refine(value)}
      />
      <span className={value.isRefined ? "font-medium" : undefined}>
        On sale only
      </span>
      {value.onFacetValue?.count != null && (
        <span className="ml-auto text-xs text-neutral-500 tabular-nums">
          {value.onFacetValue.count}
        </span>
      )}
    </label>
  )
}
