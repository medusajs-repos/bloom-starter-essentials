import { getProductSortOptions } from "@/lib/search-client"
import { ChevronDown } from "@medusajs/icons"
import { useMemo } from "react"
import { useSortBy } from "react-instantsearch"

type SortBySelectProps = {
  currencyCode: string
}

export const SortBySelect = ({ currencyCode }: SortBySelectProps) => {
  const items = useMemo(
    () => getProductSortOptions(currencyCode),
    [currencyCode]
  )
  const { currentRefinement, options, refine } = useSortBy({ items })

  return (
    <label className="relative flex items-center gap-x-2 text-sm">
      <span className="text-neutral-600 hidden sm:inline">Sort by:</span>
      <select
        value={currentRefinement}
        onChange={(event) => refine(event.target.value)}
        className="appearance-none bg-transparent pr-6 font-medium text-neutral-900 outline-none cursor-pointer"
        data-testid="sort-by"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-0 w-4 h-4 text-neutral-600" />
    </label>
  )
}
