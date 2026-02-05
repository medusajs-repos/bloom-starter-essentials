import { createFileRoute, notFound } from "@tanstack/react-router"
import { retrieveCategory } from "@/lib/data/categories"
import { getRegion } from "@/lib/data/regions"
import { getBestSellingProductIds } from "@/lib/data/products"
import Category from "@/pages/category"
import { HttpTypes } from "@medusajs/types"

export const Route = createFileRoute("/$countryCode/categories/$handle")({
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

    // Fetch best-selling product IDs for sorting
    const bestSellingIds = await getBestSellingProductIds()

    return {
      countryCode,
      region,
      category: category as HttpTypes.StoreProductCategory,
      bestSellingIds,
    }
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
