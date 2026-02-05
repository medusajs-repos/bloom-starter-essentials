import { useEffect, useRef } from "react"
import { useCart, useUpdateCart } from "@/lib/hooks/use-cart"
import { useRegions } from "@/lib/hooks/use-regions"

/**
 * Hook that automatically syncs the cart's region when the URL country code changes.
 * This ensures the cart shows correct prices and the checkout shows correct countries
 * when users navigate directly to different country URLs.
 */
export const useCartRegionSync = (countryCode: string) => {
  const { data: cart } = useCart()
  const { data: regions } = useRegions({ fields: "id, currency_code, *countries" })
  const updateCartMutation = useUpdateCart()
  const isUpdatingRef = useRef(false)

  useEffect(() => {
    // Don't run if we're already updating or don't have necessary data
    if (isUpdatingRef.current || !cart || !regions || !countryCode) {
      return
    }

    // Find the region that matches the current URL country code
    const targetRegion = regions.find((r) =>
      r.countries?.some((c) => c.iso_2 === countryCode.toLowerCase())
    )

    if (!targetRegion) {
      return
    }

    // Check if cart's current region matches the target region
    const cartRegionId = cart.region_id
    const needsUpdate = cartRegionId !== targetRegion.id

    if (needsUpdate) {
      isUpdatingRef.current = true
      
      updateCartMutation.mutate(
        { region_id: targetRegion.id },
        {
          onSettled: () => {
            isUpdatingRef.current = false
          },
        }
      )
    }
  }, [cart, regions, countryCode, updateCartMutation])
}
