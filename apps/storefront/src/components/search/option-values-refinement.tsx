import { splitOptionValue } from "@/components/search/facet-labels"
import { Checkbox } from "@/components/ui/checkbox"
import { PRODUCT_FACETS } from "@/lib/search-client"
import { useMemo } from "react"
import { useRefinementList } from "react-instantsearch"

export const OptionValuesRefinement = () => {
  const { items, refine } = useRefinementList({
    attribute: PRODUCT_FACETS.optionValues,
    limit: 200,
    sortBy: ["name:asc"],
  })

  const groups = useMemo(() => {
    const byOption = new Map<
      string,
      { value: string; label: string; count: number; isRefined: boolean }[]
    >()

    for (const item of items) {
      const { option, value } = splitOptionValue(item.value)
      const bucket = byOption.get(option) ?? []

      bucket.push({
        value: item.value,
        label: value,
        count: item.count,
        isRefined: item.isRefined,
      })
      byOption.set(option, bucket)
    }

    return Array.from(byOption.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [items])

  if (!groups.length) {
    return null
  }

  return (
    <>
      {groups.map(([option, values]) => (
        <div key={option} data-testid={`facet-option-${option}`}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-3">
            {option}
          </h3>
          <ul className="flex flex-col gap-y-2">
            {values.map((item) => (
              <li key={item.value}>
                <label className="flex items-center gap-x-3 cursor-pointer text-sm text-neutral-700 hover:text-neutral-900">
                  <Checkbox
                    checked={item.isRefined}
                    onChange={() => refine(item.value)}
                    data-testid={`facet-option-value-${item.value}`}
                  />
                  <span className={item.isRefined ? "font-medium" : undefined}>
                    {item.label}
                  </span>
                  <span className="ml-auto text-xs text-neutral-500 tabular-nums">
                    {item.count}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}
