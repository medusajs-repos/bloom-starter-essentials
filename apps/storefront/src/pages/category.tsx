import { ProductSearch } from "@/components/search/product-search"
import { HttpTypes } from "@medusajs/types"
import { useLoaderData } from "@tanstack/react-router"
import { useMemo } from "react"

/**
 * Category Page
 *
 * The same search-backed grid the store page uses, scoped to this category.
 * Nothing is fetched alongside it — the list has one source.
 */
const Category = () => {
  const loaderData = useLoaderData({
    from: "/$countryCode/categories/$handle",
  })
  const { category, countryCode } = loaderData || {}

  /**
   * The category's own name plus its children's, because a product indexed
   * under a child category does not carry its parent's name. Matching the
   * previous behaviour, which listed a category's products together with its
   * subcategories'.
   */
  const pinnedCategories = useMemo(() => {
    const names = [
      category?.name,
      ...(category?.category_children?.map(
        (child: HttpTypes.StoreProductCategory) => child.name
      ) ?? []),
    ]

    return names
      .map((name) => name?.trim())
      .filter((name): name is string => Boolean(name))
  }, [category])

  return (
    <div className="content-container pt-32 pb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-semibold text-neutral-900 tracking-tight">
          {category?.name || "Category"}
        </h1>
      </div>

      <ProductSearch
        countryCode={countryCode ?? "us"}
        pinnedFilters={{ category: pinnedCategories }}
      />
    </div>
  )
}

export default Category
