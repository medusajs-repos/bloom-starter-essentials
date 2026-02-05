import { ChevronDown } from "@medusajs/icons"
import { useState, useRef, useEffect } from "react"

export interface FilterOption {
  id: string
  label: string
}

export interface FilterGroup {
  id: string
  label: string
  options: FilterOption[]
}

interface FilterBarProps {
  filters: FilterGroup[]
  selectedFilters: Record<string, string[]>
  onFilterChange: (filterId: string, optionId: string) => void
  sortOptions: { id: string; label: string }[]
  sortValue: string
  onSortChange: (value: string) => void
  productCount: number
}

interface DropdownState {
  [key: string]: boolean
}

export const FilterBar = ({
  filters,
  selectedFilters,
  onFilterChange,
  sortOptions,
  sortValue,
  onSortChange,
  productCount,
}: FilterBarProps) => {
  const [openDropdowns, setOpenDropdowns] = useState<DropdownState>({})
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const selectedSort = sortOptions.find((opt) => opt.id === sortValue)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside = Object.entries(dropdownRefs.current).every(
        ([_, ref]) => {
          return !ref || !ref.contains(event.target as Node)
        }
      )

      if (clickedOutside) {
        setOpenDropdowns({})
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [id]: !prev[id],
    }))
  }

  const getActiveCount = (filterId: string) => {
    return selectedFilters[filterId]?.length || 0
  }

  return (
    <div className="flex items-center justify-between py-6 border-b border-neutral-200">
      {/* Left: Filters */}
      <div className="flex items-center gap-6">
        <span className="text-sm text-neutral-600 hidden sm:inline">Filter:</span>
        
        {filters.map((filter) => {
          const activeCount = getActiveCount(filter.id)
          
          return (
            <div
              key={filter.id}
              className="relative"
              ref={(el) => { dropdownRefs.current[filter.id] = el }}
            >
              <button
                onClick={() => toggleDropdown(filter.id)}
                className="flex items-center gap-2 text-sm text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                <span>{filter.label}</span>
                {activeCount > 0 && (
                  <span className="bg-neutral-900 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {activeCount}
                  </span>
                )}
                <ChevronDown className="w-4 h-4 text-neutral-600" />
              </button>

              {openDropdowns[filter.id] && (
                <div className="absolute left-0 top-full mt-2 bg-white border border-neutral-200 shadow-lg z-20 min-w-[180px]">
                  {filter.options.map((option) => {
                    const isSelected = selectedFilters[filter.id]?.includes(option.id)
                    
                    return (
                      <label
                        key={option.id}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onFilterChange(filter.id, option.id)}
                          className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                        />
                        <span className={isSelected ? "font-medium" : ""}>
                          {option.label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Right: Sort & Count */}
      <div className="flex items-center gap-6">
        <div
          className="relative"
          ref={(el) => { dropdownRefs.current["sort"] = el }}
        >
          <button
            onClick={() => toggleDropdown("sort")}
            className="flex items-center gap-2 text-sm text-neutral-900 hover:text-neutral-600 transition-colors"
          >
            <span className="text-neutral-600 hidden sm:inline">Sort by:</span>
            <span className="font-medium">{selectedSort?.label}</span>
            <ChevronDown className="w-4 h-4 text-neutral-600" />
          </button>

          {openDropdowns["sort"] && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-neutral-200 shadow-lg z-20 min-w-[180px]">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onSortChange(option.id)
                    toggleDropdown("sort")
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    option.id === sortValue
                      ? "bg-neutral-100 font-medium"
                      : "hover:bg-neutral-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-sm text-neutral-600 hidden md:inline">
          {productCount} {productCount === 1 ? "product" : "products"}
        </span>
      </div>
    </div>
  )
}
