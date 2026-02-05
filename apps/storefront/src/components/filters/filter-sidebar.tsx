import { useState } from "react"
import { ChevronDown } from "@medusajs/icons"

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface FilterGroup {
  id: string
  title: string
  options: FilterOption[]
  type: "checkbox" | "swatch" | "range"
}

interface FilterSidebarProps {
  filters: FilterGroup[]
  selectedFilters: Record<string, string[]>
  onFilterChange: (filterId: string, optionId: string) => void
  onClearAll: () => void
}

export const FilterSidebar = ({
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
}: FilterSidebarProps) => {
  const hasActiveFilters = Object.values(selectedFilters).some(
    (values) => values.length > 0
  )

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-neutral-900 uppercase tracking-wide">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-xs text-neutral-600 hover:text-neutral-900 underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {filters.map((filter) => (
          <FilterSection
            key={filter.id}
            filter={filter}
            selectedOptions={selectedFilters[filter.id] || []}
            onFilterChange={onFilterChange}
          />
        ))}
      </div>
    </div>
  )
}

const FilterSection = ({
  filter,
  selectedOptions,
  onFilterChange,
}: {
  filter: FilterGroup
  selectedOptions: string[]
  onFilterChange: (filterId: string, optionId: string) => void
}) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="border-b border-neutral-200 pb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-4"
      >
        <span className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
          {filter.title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-neutral-600 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div className="space-y-3">
          {filter.type === "swatch" ? (
            <div className="flex flex-wrap gap-2">
              {filter.options.map((option) => {
                const isSelected = selectedOptions.includes(option.id)
                return (
                  <button
                    key={option.id}
                    onClick={() => onFilterChange(filter.id, option.id)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      isSelected
                        ? "border-neutral-900 scale-110"
                        : "border-neutral-300 hover:border-neutral-500"
                    }`}
                    style={{
                      backgroundColor: getColorFromLabel(option.label),
                    }}
                    title={option.label}
                    aria-label={option.label}
                  />
                )
              })}
            </div>
          ) : (
            filter.options.map((option) => {
              const isSelected = selectedOptions.includes(option.id)
              return (
                <label
                  key={option.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onFilterChange(filter.id, option.id)}
                    className="w-4 h-4 border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                  />
                  <span className="text-sm text-neutral-700 group-hover:text-neutral-900">
                    {option.label}
                    {option.count !== undefined && (
                      <span className="text-neutral-500 ml-1">
                        ({option.count})
                      </span>
                    )}
                  </span>
                </label>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

// Helper function to map color names to hex values
const getColorFromLabel = (label: string): string => {
  const colorMap: Record<string, string> = {
    black: "#1a1a1a",
    white: "#ffffff",
    gray: "#9ca3af",
    grey: "#9ca3af",
    charcoal: "#36454f",
    sand: "#ddd9cd",
    olive: "#7d8c5f",
    beige: "#f5f5dc",
    navy: "#000080",
    blue: "#3b82f6",
    green: "#22c55e",
    red: "#ef4444",
    pink: "#ec4899",
    brown: "#92400e",
  }
  
  const normalized = label.toLowerCase()
  return colorMap[normalized] || "#e5e7eb"
}
