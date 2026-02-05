import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "@tanstack/react-router"
import { MagnifyingGlass, XMark } from "@medusajs/icons"
import { useProducts } from "@/lib/hooks/use-products"
import { useRegion } from "@/lib/hooks/use-regions"
import { getCountryCodeFromPath } from "@/lib/utils/region"

export const PredictiveSearch = () => {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  
  const { data: region } = useRegion({ country_code: countryCode || "" })

  const { data: searchResults } = useProducts({
    query_params: {
      q: query,
      limit: 6,
      fields: "id,title,handle,thumbnail,calculated_price",
    },
    region_id: region?.id,
  })

  const products = searchResults?.pages.flatMap((page) => page.products) || []

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setQuery("")
  }

  const formatPrice = (amount?: number | null, currencyCode?: string | null) => {
    if (!amount || !currencyCode) return ""
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode.toUpperCase(),
    }).format(amount)
  }

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Toggle Button (mobile/desktop) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true)
          }}
          className="flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-colors"
          aria-label="Search"
        >
          <MagnifyingGlass className="w-5 h-5" />
        </button>
      )}

      {/* Search Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="bg-neutral-50 p-6">
            <div className="relative">
              <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-12 pr-12 py-4 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900 transition-colors"
                autoFocus
              />
              <button
                onClick={handleClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900"
              >
                <XMark className="w-5 h-5" />
              </button>
            </div>

            {/* Search Results */}
            {query.length > 2 && (
              <div className="mt-4 bg-white border border-neutral-200 max-h-[60vh] overflow-y-auto">
                {products.length > 0 ? (
                  <div className="p-4">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-4">
                      {products.length} Results
                    </p>
                    <div className="space-y-4">
                      {products.map((product) => {
                        const variant = product.variants?.[0]
                        const calculatedPrice = variant?.calculated_price
                        return (
                          <Link
                            key={product.id}
                            to="/$countryCode/products/$handle"
                            params={{ countryCode: countryCode || "us", handle: product.handle || "" }}
                            onClick={handleClose}
                            className="flex items-center gap-4 hover:bg-sand-50 p-2 transition-colors"
                          >
                            <div className="w-16 h-16 bg-sand-100 flex-shrink-0 overflow-hidden">
                              {product.thumbnail ? (
                                <img
                                  src={product.thumbnail}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-neutral-300 text-xs">No Image</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-neutral-900 truncate">
                                {product.title}
                              </h4>
                              {calculatedPrice && (
                                <p className="text-sm text-neutral-600">
                                  {formatPrice(
                                    calculatedPrice.calculated_amount,
                                    calculatedPrice.currency_code
                                  )}
                                </p>
                              )}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-neutral-600">No products found</p>
                    <p className="text-sm text-neutral-500 mt-2">
                      Try searching for something else
                    </p>
                  </div>
                )}
              </div>
            )}

            {query.length > 0 && query.length <= 2 && (
              <div className="mt-4 p-4 bg-white border border-neutral-200 text-center text-sm text-neutral-500">
                Type at least 3 characters to search
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop Search Dropdown */}
      {isOpen && (
        <div className="hidden lg:block absolute right-0 top-full mt-2 w-96 bg-white border border-neutral-200 shadow-lg z-50">
          <div className="p-4">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-10 pr-10 py-3 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900 transition-colors"
                autoFocus
              />
              <button
                onClick={handleClose}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900"
              >
                <XMark className="w-5 h-5" />
              </button>
            </div>
          </div>

          {query.length > 2 && (
            <div className="border-t border-neutral-200 max-h-96 overflow-y-auto">
              {products.length > 0 ? (
                <div className="p-4">
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-4">
                    {products.length} Results
                  </p>
                  <div className="space-y-4">
                    {products.map((product) => {
                      const variant = product.variants?.[0]
                      const calculatedPrice = variant?.calculated_price
                      return (
                        <Link
                          key={product.id}
                          to="/$countryCode/products/$handle"
                          params={{ countryCode: countryCode || "us", handle: product.handle || "" }}
                          onClick={handleClose}
                          className="flex items-center gap-4 hover:bg-sand-50 p-2 transition-colors"
                        >
                          <div className="w-16 h-16 bg-sand-100 flex-shrink-0 overflow-hidden">
                            {product.thumbnail ? (
                              <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-neutral-300 text-xs">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-neutral-900 truncate">
                              {product.title}
                            </h4>
                            {calculatedPrice && (
                              <p className="text-sm text-neutral-600">
                                {formatPrice(
                                  calculatedPrice.calculated_amount,
                                  calculatedPrice.currency_code
                                )}
                              </p>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-neutral-600">No products found</p>
                  <p className="text-sm text-neutral-500 mt-2">
                    Try searching for something else
                  </p>
                </div>
              )}
            </div>
          )}

          {query.length > 0 && query.length <= 2 && (
            <div className="p-4 border-t border-neutral-200 text-center text-sm text-neutral-500">
              Type at least 3 characters to search
            </div>
          )}
        </div>
      )}
    </div>
  )
}
