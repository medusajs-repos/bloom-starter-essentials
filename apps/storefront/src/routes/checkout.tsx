import { getStoredCountryCode } from "@/lib/data/country-code"
import { CheckoutStepKey } from "@/lib/types/global"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/checkout")({
  loader: async () => {
    const { countryCode } = await getStoredCountryCode()

    throw redirect({
      to: "/$countryCode/checkout",
      search: { step: CheckoutStepKey.ADDRESSES },
      params: { countryCode },
    })
  },
})
