import { createFileRoute } from "@tanstack/react-router"
import { notFound } from "@tanstack/react-router"
import { Collection } from "@/pages/collection"
import { getRegion } from "@/lib/data/regions"
import { sdk } from "@/lib/utils/sdk"
import { getBestSellingProductIds } from "@/lib/data/products"

export const Route = createFileRoute("/$countryCode/collections/$handle")({
  loader: async ({ params }) => {
    const region = await getRegion({ country_code: params.countryCode })

    if (!region) {
      throw notFound()
    }

    // Fetch collection by handle
    const { collections } = await sdk.store.collection.list({
      fields: "id,title,handle,metadata",
      handle: params.handle,
    })

    const collection = collections?.[0]

    if (!collection) {
      throw notFound()
    }

    // Get best selling product IDs
    const bestSellingIds = await getBestSellingProductIds()

    return {
      collection,
      region,
      bestSellingIds,
    }
  },
  head: ({ loaderData }) => {
    const collection = loaderData?.collection
    return {
      meta: [
        {
          title: collection?.title
            ? `${collection.title} - Essentials`
            : "Collection - Essentials",
        },
        {
          name: "description",
          content: `Shop ${collection?.title || "collection"} at Essentials`,
        },
      ],
    }
  },
  component: () => {
    const { collection, region } = Route.useLoaderData()
    return <Collection collection={collection} region={region} />
  },
})
