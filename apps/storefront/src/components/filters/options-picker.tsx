import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronDown } from "@medusajs/icons"
import { sdk } from "@/lib/utils/sdk"

type ProductOptionValue = {
  id: string
  value: string
}

type ProductOption = {
  id: string
  title: string
  values?: ProductOptionValue[]
}

interface OptionsPickerProps {
  selectedOptionValueIds: string[]
  onToggle: (optionValueId: string) => void
}

/**
 * OptionsPicker
 *
 * Renders the global product options (Medusa 2.16+) as collapsible
 * chip groups. Each chip toggles a single option value in the
 * `optionValueIds` URL search param via `onToggle`.
 *
 * Only fetches non-exclusive (global) options so it stays scoped to
 * the all-products view.
 */
export const OptionsPicker = ({
  selectedOptionValueIds,
  onToggle,
}: OptionsPickerProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["product-options", "global"],
    queryFn: async () => {
      const res = await sdk.client.fetch<{ product_options: ProductOption[] }>(
        "/store/product-options",
        {
          method: "GET",
          query: {
            is_exclusive: false,
            fields: "*values",
          },
        }
      )
      return res.product_options ?? []
    },
  })

  if (isLoading || !data || data.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {data.map((option) => (
        <OptionGroup
          key={option.id}
          option={option}
          selectedOptionValueIds={selectedOptionValueIds}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}

const OptionGroup = ({
  option,
  selectedOptionValueIds,
  onToggle,
}: {
  option: ProductOption
  selectedOptionValueIds: string[]
  onToggle: (id: string) => void
}) => {
  const [isExpanded, setIsExpanded] = useState(true)

  if (!option.values || option.values.length === 0) {
    return null
  }

  return (
    <div className="border-b border-neutral-200 pb-6">
      <button
        type="button"
        onClick={() => setIsExpanded((v) => !v)}
        className="flex items-center justify-between w-full mb-4"
      >
        <span className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
          {option.title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-neutral-600 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div className="flex flex-wrap gap-2">
          {option.values.map((value) => {
            const isSelected = selectedOptionValueIds.includes(value.id)
            return (
              <button
                key={value.id}
                type="button"
                onClick={() => onToggle(value.id)}
                className={`px-3 py-1.5 text-xs border transition-colors ${
                  isSelected
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 text-neutral-700 hover:border-neutral-500"
                }`}
              >
                {value.value}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
