import { HttpTypes } from "@medusajs/types"
import { retrieveCart } from "@/lib/data/cart"
import { sdk } from "@/lib/utils/sdk"
import { getStoredCart } from "@/lib/utils/cart"

/**
 * Lists available payment methods for a specific region. This is typically used in the third step of the checkout process to list the payment methods, allowing the customer to select a payment method.
 * 
 * @param region_id - The region ID to get payment methods for
 * @param fields - Optional fields to include in the response
 * @returns Promise that resolves to an array of payment providers
 * 
 * @example
 * ```typescript
 * // Get payment methods for US region
 * const paymentMethods = await listCartPaymentMethods({
 *   region_id: 'reg_us',
 *   fields: '*config, *config.settings'
 * });
 * 
 * // Get payment methods with minimal fields
 * const methods = await listCartPaymentMethods({
 *   region_id: 'reg_eu',
 *   fields: 'id, name, is_enabled'
 * });
 * 
 * // In a payment selection component
 * const loadPaymentMethods = async (regionId: string) => {
 *   try {
 *     const methods = await listCartPaymentMethods({
 *       region_id: regionId,
 *       fields: '*config, *config.settings'
 *     });
 *     
 *     return methods.filter(method => method.is_enabled);
 *   } catch (error) {
 *     console.error('Failed to load payment methods:', error);
 *     return [];
 *   }
 * };
 * ```
 */
export const listCartPaymentMethods = async ({
  region_id,
  fields,
}: {
  region_id: string;
  fields?: string;
}) => {
  const { payment_providers } = await sdk.store.payment.listPaymentProviders({
    region_id,
    fields
  })

  return payment_providers
}

/**
 * Initiates a payment session for the current cart with a specific payment provider.
 * This is typically used in the third step of the checkout process to initiate a payment session with a specific payment provider after the customer has selected a payment method.
 * 
 * @param provider_id - The payment provider ID to initiate the session with
 * @returns Promise that resolves to the payment collection
 * @throws Error if no cart is found or cart retrieval fails
 * 
 * @example
 * ```typescript
 * // Initiate payment with Stripe
 * const paymentCollection = await initiateCartPaymentSession({
 *   provider_id: 'pp_stripe_stripe',
 *   data: {
 *     // pass any data useful for the payment provider
 *   }
 * });
 * 
 * // In a payment flow component
 * const handlePaymentInitiation = async (providerId: string) => {
 *   try {
 *     const paymentCollection = await initiateCartPaymentSession({
 *       provider_id: providerId
 *     });
 *     
 *     // Redirect to payment provider or show payment form
 *     if (providerId === 'pp_stripe_stripe') {
 *       // Handle Stripe payment flow
 *       redirectToStripe(paymentCollection);
 *     }
 *   } catch (error) {
 *     console.error('Failed to initiate payment:', error);
 *     // Show error message to user
 *   }
 * };
 * 
 * // With payment collection validation
 * const initiatePaymentWithValidation = async (providerId: string) => {
 *   // Ensure cart has required data
 *   const cart = await retrieveCart();
 *   if (!cart?.shipping_address || !cart?.billing_address) {
 *     throw new Error('Cart must have addresses before payment');
 *   }
 *   
 *   return await initiateCartPaymentSession({ provider_id: providerId });
 * };
 * ```
 */
export const initiateCartPaymentSession = async ({
  provider_id,
  data,
}: {
  provider_id: string;
  data?: Record<string, any>;
}): Promise<HttpTypes.StorePaymentCollection> => {
  const cartId = getStoredCart()

  if (!cartId) {
    throw new Error("No cart found")
  }

  // First retrieve the cart to pass to the payment API
  const cart = await retrieveCart({ cart_id: cartId })
  if (!cart) {
    throw new Error("Cart not found")
  }

  const { payment_collection } = await sdk.store.payment.initiatePaymentSession(
    cart,
    { provider_id, data },
  )
  return payment_collection
}