import { createFileRoute, notFound } from "@tanstack/react-router"
import { retrieveCategory } from "@/lib/data/categories"
import { getRegion } from "@/lib/data/regions"
import Category from "@/pages/category"
import { HttpTypes } from "@medusajs/types"
import { sanitize } from "@/lib/utils/sanitize"

export const Route = createFileRoute("/$countryCode/categories/$handle")({
  /**
   * Passed through untouched. The product list on this page comes from
   * InstantSearch, whose `routing` writes its own refinement, sort and page
   * params into the URL — stripping unknown keys here would wipe them out on
   * the next router navigation.
   */
  validateSearch: (search: Record<string, unknown>) => search,
  loader: async ({ params, context }) => {
    const { countryCode, handle } = params
    const { queryClient } = context

    // Pre-fetch region data
    const region = await queryClient.ensureQueryData({
      queryKey: ["region", countryCode],
      queryFn: () => getRegion({ country_code: countryCode }),
    })

    if (!region || !handle) {
      throw notFound()
    }

    // Fetch category by handle
    const category = await queryClient.ensureQueryData({
      queryKey: ["category", handle],
      queryFn: async () => {
        try {
          return await retrieveCategory({ handle })
        } catch {
          throw notFound()
        }
      },
    })

    // No products are loaded here: the grid is search-backed, and a second
    // source for the same list would only disagree with it.
    return sanitize({
      countryCode,
      region,
      category: category as HttpTypes.StoreProductCategory,
    })
  },
  head: ({ loaderData }) => {
    const { region, countryCode, category } =
      loaderData || {}
    const regionName = region?.name || countryCode?.toUpperCase()
    const categoryName = category?.name || "Category"
    const title = `${categoryName} - ${regionName} | Medusa Store`
    const description = `Shop our ${categoryName.toLowerCase()} category available in ${regionName}. Free shipping and easy returns.`

    return {
      meta: [
        {
          title,
        },
        {
          name: "description",
          content: description,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content: description,
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "twitter:card",
          content: "summary_large_image",
        },
        {
          property: "twitter:title",
          content: title,
        },
        {
          property: "twitter:description",
          content: description,
        },
      ]
    }
  },
  component: Category,
})
