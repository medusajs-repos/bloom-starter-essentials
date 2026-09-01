import { ProductSearch } from "@/components/search/product-search"
import { useLoaderData } from "@tanstack/react-router"

/**
 * Store Page (All Products)
 *
 * The whole list is search-backed — there is no second product fetch on this
 * page. With no category pinned, the grid covers the entire published
 * catalogue.
 */
const Store = () => {
  const loaderData = useLoaderData({ from: "/$countryCode/store" })
  const countryCode = loaderData?.countryCode ?? "us"

  return (
    <div className="content-container pt-32 pb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-semibold text-neutral-900 tracking-tight">
          All Products
        </h1>
      </div>

      <ProductSearch countryCode={countryCode} />
    </div>
  )
}

export default Store
