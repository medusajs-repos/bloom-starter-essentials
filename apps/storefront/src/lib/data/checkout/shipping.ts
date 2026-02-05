import { HttpTypes } from "@medusajs/types"
import { sdk } from "@/lib/utils/sdk"
import { getStoredCart } from "@/lib/utils/cart"

/**
 * Retrieves available shipping options for the current cart.
 * This is typically used in the second step of the checkout process to list the shipping options, allowing the customer to select a shipping option.
 * 
 * @returns Promise that resolves to an array of shipping options
 * @throws Error if no cart is found
 * 
 * @example
 * ```typescript
 * // Get shipping options for current cart
 * const shippingOptions = await getCartShippingOptions();
 * 
 * // In a shipping selection component
 * const loadShippingOptions = async () => {
 *   try {
 *     const options = await getCartShippingOptions();
 *     return options.filter(option => option.is_enabled);
 *   } catch (error) {
 *     console.error('Failed to load shipping options:', error);
 *     return [];
 *   }
 * };
 * ```
 */
export const getCartShippingOptions = async (): Promise<HttpTypes.StoreCartShippingOption[]> => {
  const cartId = getStoredCart()
  if (!cartId) {
    throw new Error("No cart found")
  }
  const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
    cart_id: cartId,
  })
  return shipping_options
}

/**
 * Calculates the price for a specific shipping option with optional additional data.
 * This is typically used in the second step of the checkout process to calculate the price for a specific shipping option of `price_type=calculated` when displaying it to the customer.
 * 
 * @param option_id - The shipping option ID to calculate price for
 * @param data - Optional additional data for price calculation
 * @returns Promise that resolves to the shipping option with calculated price
 * @throws Error if no cart is found
 * 
 * @example
 * ```typescript
 * // Calculate price for a shipping option
 * const shippingOption = await calculatePriceForShippingOption({
 *   option_id: 'shipping_option_123'
 * });
 * 
 * // Calculate price with additional data
 * const optionWithPrice = await calculatePriceForShippingOption({
 *   option_id: 'shipping_option_123',
 *   data: {
 *     // pass any data useful for the fulfillment provider
 *     weight: 2.5,
 *     dimensions: { length: 10, width: 8, height: 6 },
 *     insurance: true
 *   }
 * });
 * 
 * // In a shipping calculator component
 * const calculateShippingCost = async (optionId: string, packageData: any) => {
 *   try {
 *     const option = await calculatePriceForShippingOption({
 *       option_id: optionId,
 *       data: packageData
 *     });
 *     
 *     return {
 *       id: option.id,
 *       name: option.name,
 *       amount: option.amount,
 *       currency: option.currency_code
 *     };
 *   } catch (error) {
 *     console.error('Failed to calculate shipping:', error);
 *     return null;
 *   }
 * };
 * ```
 */
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

/**
 * Sets the shipping method for the current cart.
 * This is typically used in the second step of the checkout process to set the shipping method for the cart after the customer has selected a shipping option.
 * 
 * @param shipping_option_id - The shipping option ID to set as the cart's shipping method
 * @returns Promise that resolves to the updated cart with shipping method
 * @throws Error if no cart is found
 * 
 * @example
 * ```typescript
 * // Set shipping method for cart
 * const updatedCart = await setCartShippingMethod({
 *   shipping_option_id: 'shipping_option_123'
 * });
 * 
 * // In a shipping selection component
 * const handleShippingSelection = async (optionId: string) => {
 *   try {
 *     const cart = await setCartShippingMethod({
 *       shipping_option_id: optionId
 *     });
 *     
 *     console.log('Shipping method set:', cart.shipping_methods);
 *     // Proceed to next step
 *   } catch (error) {
 *     console.error('Failed to set shipping method:', error);
 *     // Show error message
 *   }
 * };
 * 
 * // With cart total update
 * const updateCartWithShipping = async (optionId: string) => {
 *   const cart = await setCartShippingMethod({
 *     shipping_option_id: optionId
 *   });
 *   
 *   // Log the updated totals
 *   console.log('Cart total:', cart.total);
 *   console.log('Shipping cost:', cart.shipping_total);
 *   
 *   return cart;
 * };
 * ```
 */
export const setCartShippingMethod = async ({
  shipping_option_id,
  data,
}: {
  shipping_option_id: string;
  data?: Record<string, unknown>;
}): Promise<HttpTypes.StoreCart> => {
  const cartId = getStoredCart()

  if (!cartId) {
    throw new Error("No cart found")
  }

  const { cart } = await sdk.store.cart.addShippingMethod(
    cartId,
    { option_id: shipping_option_id, data },
  )
  return cart
}