import { Checkbox } from "@/components/ui/checkbox"
import { useRefinementList } from "react-instantsearch"

type FacetCheckboxListProps = {
  attribute: string
  title: string
  limit?: number
  formatLabel?: (value: string) => string
}

export const FacetCheckboxList = ({
  attribute,
  title,
  limit = 50,
  formatLabel,
}: FacetCheckboxListProps) => {
  const { items, refine, canToggleShowMore, isShowingMore, toggleShowMore } =
    useRefinementList({
      attribute,
      limit,
      showMore: true,
      showMoreLimit: limit * 2,
      sortBy: ["count:desc", "name:asc"],
    })

  if (!items.length) {
    return null
  }

  return (
    <div data-testid={`facet-${attribute}`}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-3">
        {title}
      </h3>
      <ul className="flex flex-col gap-y-2">
        {items.map((item) => (
          <li key={item.value}>
            <label className="flex items-center gap-x-3 cursor-pointer text-sm text-neutral-700 hover:text-neutral-900">
              <Checkbox
                checked={item.isRefined}
                onChange={() => refine(item.value)}
                data-testid={`facet-${attribute}-${item.value}`}
              />
              <span className={item.isRefined ? "font-medium" : undefined}>
                {formatLabel ? formatLabel(item.value) : item.label}
              </span>
              <span className="ml-auto text-xs text-neutral-500 tabular-nums">
                {item.count}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {canToggleShowMore && (
        <button
          type="button"
          onClick={toggleShowMore}
          className="mt-3 text-xs uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          {isShowingMore ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  )
}
