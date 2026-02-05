import { createFileRoute, notFound, Outlet } from "@tanstack/react-router"
import { listRegions } from "@/lib/data/regions"
import { useCartRegionSync } from "@/lib/hooks/use-cart-region-sync"

export const Route = createFileRoute("/$countryCode")({
  loader: async ({ params, context }) => {
    const { countryCode } = params
    const { queryClient } = context

    // Get all regions to validate country code
    const regions = await queryClient.ensureQueryData({
      queryKey: ["regions"],
      queryFn: () => listRegions({ fields: "currency_code, *countries" }),
    })

    // Check if country code is valid
    const isValidCountry = regions.some(
      region => region.countries?.some(
        country => country.iso_2 === countryCode.toLowerCase()
      )
    )

    if (!isValidCountry) {
      throw notFound() // Show 404 for invalid countries
    }

    // Valid country - proceed to child routes
    return { countryCode }
  },
  component: CountryCodeWrapper,
})

function CountryCodeWrapper() {
  const { countryCode } = Route.useParams()
  
  // Automatically sync cart region when country code changes
  useCartRegionSync(countryCode)
  
  return <Outlet />
}