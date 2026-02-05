import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { FilterBar } from "@/components/filters/filter-bar"
import { useProducts } from "@/lib/hooks/use-products"
import { useLoaderData } from "@tanstack/react-router"
import { useState, useMemo } from "react"
import { getPriceFilterOptions } from "@/lib/utils/price"
import { HttpTypes } from "@medusajs/types"

interface VariantItem {
  product: HttpTypes.StoreProduct
  variant: HttpTypes.StoreProductVariant
  color: string | null
}

/**
 * Store Page (All Products) with Horizontal Filtering & Sorting
 *
 * Features:
 * - Horizontal filter bar (matching category pages)
 * - Product filtering (availability, price, color)
 * - Sort options
 * - Infinite scroll pagination
 */
const Store = () => {
  const loaderData = useLoaderData({ from: "/$countryCode/store" })
  const { region, bestSellingIds = [] } = loaderData || {}

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    availability: [],
    price: [],
    color: [],
  })
  const [sortBy, setSortBy] = useState("featured")

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useProducts({
      region_id: region.id,
      query_params: {
        limit: 12,
        fields: "*variants, *variants.options, *variants.options.option, *variants.calculated_price, *variants.inventory_items.*, *variants.inventory_items.inventory, *images",
      },
    })

  // Transform products to display format (one per color variant)
  const variantItems = useMemo(() => {
    const rawProducts = data?.pages.flatMap((page) => page.products) || []
    const items: VariantItem[] = []

    rawProducts.forEach((product) => {
      // Get all unique colors from variants
      const colorMap = new Map<string, { variant: HttpTypes.StoreProductVariant; color: string }>()

      product.variants?.forEach((variant) => {
        const colorOption = variant.options?.find(
          (opt) => opt.option?.title?.toLowerCase() === "color"
        )
        let color = colorOption?.value || null

        // Normalize beige to sand
        if (color?.toLowerCase() === "beige") {
          color = "Sand"
        }

        // Store the first variant of each color
        if (color && !colorMap.has(color.toLowerCase())) {
          colorMap.set(color.toLowerCase(), { variant, color })
        }
      })

      // Create an item for each color variant
      if (colorMap.size > 0) {
        colorMap.forEach(({ variant, color }) => {
          items.push({ product, variant, color })
        })
      } else if (product.variants?.[0]) {
        // Fallback if no colors found
        items.push({ product, variant: product.variants[0], color: null })
      }
    })

    return items
  }, [data])

  // Generate price options based on region currency
  const priceOptions = useMemo(
    () => getPriceFilterOptions(region?.currency_code || "usd"),
    [region?.currency_code]
  )

  // Filter groups
  const filterGroups = [
    {
      id: "availability",
      label: "Availability",
      options: [
        { id: "in-stock", label: "In Stock" },
        { id: "out-of-stock", label: "Out of Stock" },
      ],
    },
    {
      id: "price",
      label: "Price",
      options: priceOptions,
    },
    {
      id: "color",
      label: "Color",
      options: [
        { id: "black", label: "Black" },
        { id: "white", label: "White" },
        { id: "sand", label: "Sand" },
        { id: "olive", label: "Olive" },
        { id: "grey", label: "Grey" },
      ],
    },
  ]

  const sortOptions = [
    { id: "featured", label: "Best selling" },
    { id: "newest", label: "Newest" },
    { id: "price-asc", label: "Price: Low to High" },
    { id: "price-desc", label: "Price: High to Low" },
    { id: "title-asc", label: "A-Z" },
  ]

  // Handle filter changes
  const handleFilterChange = (filterId: string, optionId: string) => {
    setSelectedFilters((prev) => {
      const currentOptions = prev[filterId] || []
      const isSelected = currentOptions.includes(optionId)

      return {
        ...prev,
        [filterId]: isSelected
          ? currentOptions.filter((id) => id !== optionId)
          : [...currentOptions, optionId],
      }
    })
  }

  // Apply filtering and sorting
  const filteredAndSortedItems = useMemo(() => {
    let result = [...variantItems]

    // Apply availability filters
    if (selectedFilters.availability?.length > 0) {
      result = result.filter((item) => {
        // Check all variants of the product for stock availability
        // Products with manage_inventory true are considered in stock
        const hasAnyStock = item.product?.variants?.some((variant) => {
          // If inventory management is disabled, always in stock
          if (variant?.manage_inventory === false || variant?.allow_backorder === true) {
            return true
          }
          // If inventory is managed, we assume it's in stock
          return variant?.manage_inventory === true
        })

        const hasInStockFilter = selectedFilters.availability.includes("in-stock")
        const hasOutOfStockFilter = selectedFilters.availability.includes("out-of-stock")

        if (hasInStockFilter && hasOutOfStockFilter) return true
        if (hasInStockFilter) return hasAnyStock
        if (hasOutOfStockFilter) return !hasAnyStock
        return true
      })
    }

    // Apply price filters
    if (selectedFilters.price?.length > 0) {
      result = result.filter((item) => {
        const price = item.variant?.calculated_price?.calculated_amount || Infinity
        return selectedFilters.price.some((rangeId) => {
          const range = priceOptions.find((opt) => opt.id === rangeId)
          if (!range) return true
          return price >= range.min && price < range.max
        })
      })
    }

    // Apply color filters (based on variant color from metadata or options)
    if (selectedFilters.color?.length > 0) {
      result = result.filter((item) => {
        // Color was extracted during variantItems creation
        if (!item.color) return false
        const itemColor = item.color.toLowerCase()
        return selectedFilters.color.some((filterColor) => {
          const filter = filterColor.toLowerCase()
          // Match exact or partial (e.g., "muted olive" matches "olive")
          return itemColor === filter || itemColor.includes(filter) || filter.includes(itemColor)
        })
      })
    }

    // Apply sorting
    if (sortBy === "featured") {
      // Sort by best selling (actual order data)
      result.sort((a, b) => {
        const indexA = bestSellingIds.indexOf(a.product.id)
        const indexB = bestSellingIds.indexOf(b.product.id)
        
        // Products not in best selling list go to the end
        if (indexA === -1 && indexB === -1) return 0
        if (indexA === -1) return 1
        if (indexB === -1) return -1
        
        // Sort by position in best selling list
        return indexA - indexB
      })
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => {
        const priceA = a.variant?.calculated_price?.calculated_amount || Infinity
        const priceB = b.variant?.calculated_price?.calculated_amount || Infinity
        // Always put products without prices at the end
        if (priceA === Infinity && priceB === Infinity) return 0
        if (priceA === Infinity) return 1
        if (priceB === Infinity) return -1
        return priceA - priceB
      })
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => {
        const priceA = a.variant?.calculated_price?.calculated_amount || Infinity
        const priceB = b.variant?.calculated_price?.calculated_amount || Infinity
        // Always put products without prices at the end
        if (priceA === Infinity && priceB === Infinity) return 0
        if (priceA === Infinity) return 1
        if (priceB === Infinity) return -1
        return priceB - priceA
      })
    } else if (sortBy === "title-asc") {
      result.sort((a, b) => a.product.title.localeCompare(b.product.title))
    } else if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.product.created_at || 0).getTime() -
          new Date(a.product.created_at || 0).getTime()
      )
    }

    return result
  }, [variantItems, selectedFilters, sortBy, priceOptions, bestSellingIds])

  return (
    <div className="content-container pt-32 pb-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-semibold text-neutral-900 tracking-tight">
          All Products
        </h1>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filterGroups}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        sortOptions={sortOptions}
        sortValue={sortBy}
        onSortChange={setSortBy}
        productCount={filteredAndSortedItems.length}
      />

      {/* Products */}
      {isFetching && filteredAndSortedItems.length === 0 ? (
        <div className="text-neutral-600 py-12">Loading...</div>
      ) : filteredAndSortedItems.length === 0 ? (
        <div className="text-neutral-600 py-12">No products found</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 py-8">
            {filteredAndSortedItems.map((item, index) => (
              <ProductCard 
                key={`${item.product.id}-${item.variant.id}-${index}`}
                product={item.product}
                variant={item.variant}
              />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="secondary"
                className="px-8 py-3 uppercase text-xs font-semibold tracking-wider"
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Store
