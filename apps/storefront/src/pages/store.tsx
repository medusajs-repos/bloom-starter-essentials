import { ProductSearch } from "@/components/search/product-search"
import { useLoaderData } from "@tanstack/react-router"

const Store = () => {
  const loaderData = useLoaderData({ from: "/$countryCode/store" })
  const countryCode = loaderData?.countryCode ?? "us"
  const currencyCode = loaderData?.region?.currency_code ?? "usd"

  return (
    <div className="content-container pt-32 pb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-semibold text-neutral-900 tracking-tight">
          All Products
        </h1>
      </div>

      <ProductSearch countryCode={countryCode} currencyCode={currencyCode} />
    </div>
  )
}

export default Store
