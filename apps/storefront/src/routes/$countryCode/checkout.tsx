import { createFileRoute, notFound } from "@tanstack/react-router"
import Checkout from "@/pages/checkout"
import { getRegion } from "@/lib/data/regions"
import { CheckoutStepKey } from "@/lib/types/global"
import { sanitize } from "@/lib/utils/sanitize"

export const Route = createFileRoute("/$countryCode/checkout")({
  validateSearch: (search): { step: CheckoutStepKey } => {
    const step = search.step
    if (!Object.values(CheckoutStepKey).includes(step as CheckoutStepKey)) {
      return { step: CheckoutStepKey.ADDRESSES }
    }
    return { step: step as CheckoutStepKey }
  },
  loaderDeps: ({ search: { step } }) => {
    return {
      step,
    }
  },
  loader: async ({ params, context, deps }) => {
    const { countryCode } = params
    const { queryClient } = context
    const { step } = deps

    const region = await queryClient.ensureQueryData({
      queryKey: ["region", countryCode],
      queryFn: () => getRegion({ country_code: countryCode }),
    })

    if (!region) {
      throw notFound()
    }

    return sanitize({
      region,
      countryCode,
      step,
    })
  },
  component: Checkout,
})