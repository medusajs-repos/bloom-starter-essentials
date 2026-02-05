import { ChevronDown } from "@medusajs/icons"
import { useState, useRef, useEffect } from "react"

export interface SortOption {
  id: string
  label: string
}

interface SortDropdownProps {
  options: SortOption[]
  value: string
  onChange: (value: string) => void
}

export const SortDropdown = ({
  options,
  value,
  onChange,
}: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.id === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-neutral-300 bg-white hover:border-neutral-900 transition-colors text-sm"
      >
        <span className="text-neutral-700">
          Sort: <span className="font-medium text-neutral-900">{selectedOption?.label}</span>
        </span>
        <ChevronDown className="w-4 h-4 text-neutral-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                option.id === value
                  ? "bg-neutral-100 text-neutral-900 font-medium"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
