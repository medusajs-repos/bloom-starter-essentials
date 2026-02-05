import { HttpTypes } from "@medusajs/types"
import { sdk } from "@/lib/utils/sdk"
import { getStoredCart } from "@/lib/utils/cart"

// ============ PAYMENT METHOD CHECKS ============

export const isStripe = (providerId?: string) => {
  return providerId?.startsWith("pp_stripe_") || providerId === "stripe"
}

export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default") || providerId === "manual"
}

// ============ ACTIVE PAYMENT SESSION ============

export const getActivePaymentSession = (cart: HttpTypes.StoreCart): HttpTypes.StorePaymentSession | undefined => {
  return cart.payment_collection?.payment_sessions?.find(
    (paymentSession) => paymentSession.status === "pending"
  )
}

// ============ GIFT CARD CHECK ============

export const isPaidWithGiftCard = (cartOrOrder: HttpTypes.StoreCart | HttpTypes.StoreOrder): boolean => {
  return (cartOrOrder as any)?.gift_cards &&
  (cartOrOrder as any)?.gift_cards?.length > 0 &&
  cartOrOrder?.total === 0
}

// ============ CALCULATE SHIPPING PRICE ============

export const calculatePriceForShippingOption = async ({
  option_id,
  data,
}: {
  option_id: string;
  data?: Record<string, unknown>;
}): Promise<HttpTypes.StoreCartShippingOption> => {
  const cartId = getStoredCart()

  if (!cartId) {
    throw new Error("No cart found")
  }

  const body: { cart_id: string; data?: Record<string, unknown> } = {
    cart_id: cartId,
  }

  if (data) {
    body.data = data
  }

  const { shipping_option } =
    await sdk.store.fulfillment.calculate(option_id, body)
  return shipping_option
}
