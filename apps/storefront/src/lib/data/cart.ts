import { sdk } from "@/lib/utils/sdk"
import { getRegion } from "@/lib/data/regions"
import { getStoredCart, setStoredCart } from "@/lib/utils/cart"
import { HttpTypes } from "@medusajs/types"
import { 
  sendPostRequest, 
  sendDeleteRequest 
} from "@/lib/data/custom"

const DEFAULT_CART_FIELDS = "+items.total, shipping_methods.name"

/**
 * Retrieves a cart by ID or from stored ID. Returns null if no cart is found.
 * 
 * @param cart_id - Optional cart ID. If not provided, will use stored cart ID.
 * @param fields - Optional fields to include in the response
 * @returns Promise that resolves to the cart data or null if not found
 * 
 * @example
 * ```typescript
 * // Get current cart from cookies
 * const cart = await retrieveCart();
 * 
 * // Get specific cart by ID
 * const specificCart = await retrieveCart({ 
 *   cart_id: 'cart_123',
 *   fields: '*items, *items.variant, *items.variant.product'
 * });
 * 
 * // Get cart with minimal fields
 * const minimalCart = await retrieveCart({ 
 *   fields: 'id, total, items.quantity'
 * });
 * ```
 */
export const retrieveCart = async ({
  cart_id,
  fields = DEFAULT_CART_FIELDS,
}: {
  cart_id?: string;
  fields?: string;
}): Promise<HttpTypes.StoreCart | null> => {
  const id = cart_id || getStoredCart()

  if (!id) {
    return null
  }

  const { cart } = await sdk.store.cart.retrieve(id, {
    fields:
      fields,
  })

  return cart
}

/**
 * Creates a new cart for the specified region and stores the cart ID.
 * 
 * @param region_id - The region ID to create the cart for
 * @param fields - Optional fields to include in the response (defaults to items total and shipping methods)
 * @returns Promise that resolves to the newly created cart
 * 
 * @example
 * ```typescript
 * // Create cart for US region
 * const newCart = await createCart({ 
 *   region_id: 'reg_us',
 *   fields: '*items, *items.variant, shipping_methods'
 * });
 * 
 * // Create cart with minimal response
 * const cart = await createCart({ 
 *   region_id: 'reg_eu',
 *   fields: 'id, total'
 * });
 * ```
 */
export const createCart = async ({
  region_id,
  fields = DEFAULT_CART_FIELDS,
}: {
  region_id: string;
  fields?: string;
}): Promise<HttpTypes.StoreCart> => {
  const { cart } = await sdk.store.cart.create({ region_id }, {
    fields,
  })
  setStoredCart(cart.id)
  return cart
}

/**
 * Updates the current cart with the provided updates.
 * 
 * @param updates - The updates to apply to the cart
 * @param fields - Optional fields to include in the response
 * @returns Promise that resolves to the updated cart
 * 
 * @example
 * ```typescript
 * // Update cart with region
 * const updatedCart = await updateCart({
 *   region_id: 'reg_us'
 * });
 * ```
 */
export const updateCart = async ({
  fields = DEFAULT_CART_FIELDS,
  ...updates
}: HttpTypes.StoreUpdateCart & {
  fields?: string;
}): Promise<HttpTypes.StoreCart> => {
  const cartId = getStoredCart()
  if (!cartId) {
    throw new Error("No cart found")
  }
  const { cart } = await sdk.store.cart.update(cartId, updates, {
    fields,
  })
  return cart
}

/**
 * Adds a product variant to the cart. Creates a new cart if none exists.
 * 
 * @param variant_id - The product variant ID to add to the cart
 * @param quantity - The quantity of the variant to add
 * @param country_code - The country code to determine the region (used if creating new cart)
 * @param fields - Optional fields to include in the response
 * @returns Promise that resolves to the updated cart
 * 
 * @example
 * ```typescript
 * // Add single item to cart
 * const updatedCart = await addToCart({
 *   variant_id: 'variant_123',
 *   quantity: 2,
 *   country_code: 'us',
 *   fields: '*items, *items.variant, *items.variant.product'
 * });
 * 
 * // Add item with minimal response
 * const cart = await addToCart({
 *   variant_id: 'variant_456',
 *   quantity: 1,
 *   country_code: 'gb',
 *   fields: 'id, total, items.quantity'
 * });
 * ```
 */
export const addToCart = async ({
  variant_id,
  quantity,
  country_code,
  fields = DEFAULT_CART_FIELDS,
}: {
  variant_id: string;
  quantity: number;
  country_code: string;
  fields?: string;
}): Promise<HttpTypes.StoreCart> => {
  if (!variant_id) {
    throw new Error("Missing variant ID when adding to cart")
  }

  let cartId = getStoredCart()

  if (!cartId) {
    const region = await getRegion({ country_code })
  
    if (!region) {
      throw new Error(`Region not found for country code: ${country_code}`)
    }
    // Create new cart
    cartId = (await createCart({ region_id: region.id })).id
  }

  if (!cartId) {
    throw new Error("Error retrieving or creating cart")
  }

  const response = await sdk.store.cart.createLineItem(
    cartId,
    {
      variant_id,
      quantity,
    },
    {
      fields,
    }
  )

  return response.cart
}

/**
 * Updates the quantity of a line item in the cart.
 * 
 * @param line_id - The line item ID to update
 * @param quantity - The new quantity for the line item
 * @param fields - Optional fields to include in the response
 * @returns Promise that resolves to the updated cart
 * 
 * @example
 * ```typescript
 * // Update line item quantity
 * const updatedCart = await updateLineItem({
 *   line_id: 'li_123',
 *   quantity: 3,
 *   fields: '*items, *items.variant, shipping_methods'
 * });
 * 
 * // Update with minimal response
 * const cart = await updateLineItem({
 *   line_id: 'li_456',
 *   quantity: 0, // This effectively removes the item
 *   fields: 'id, total'
 * });
 * ```
 */
export const updateLineItem = async ({
  line_id,
  quantity,
  fields = DEFAULT_CART_FIELDS,
}: {
  line_id: string;
  quantity: number;
  fields?: string;
}): Promise<HttpTypes.StoreCart> => {
  const cartId = getStoredCart()

  if (!cartId) {
    throw new Error("No cart found")
  }

  const { cart } = await sdk.store.cart.updateLineItem(
    cartId,
    line_id,
    { quantity },
    {
      fields,
    }
  )
  return cart
}

/**
 * Deletes a line item from the cart.
 * 
 * @param line_id - The line item ID to delete
 * @param fields - Optional fields
 * @returns Promise that resolves when the line item is deleted
 * 
 * @example
 * ```typescript
 * // Delete a line item
 * await deleteLineItem({ line_id: 'li_123' });
 * 
 * // Delete multiple line items (call multiple times)
 * await Promise.all([
 *   deleteLineItem({ line_id: 'li_123' }),
 *   deleteLineItem({ line_id: 'li_456' })
 * ]);
 * ```
 */
export const deleteLineItem = async ({
  line_id,
  // fields = DEFAULT_CART_FIELDS,
}: {
  line_id: string;
  fields?: string;
}): Promise<void> => {
  const cartId = getStoredCart()

  if (!cartId) {
    throw new Error("No cart found")
  }

  // TODO pass fields when supported
  await sdk.store.cart.deleteLineItem(cartId, line_id)
}

/**
 * Applies a promotion code to the current cart.
 * 
 * @param code - The promotion code to apply
 * @returns Promise that resolves to the updated cart with applied promotion
 * 
 * @example
 * ```typescript
 * // Apply a discount code
 * const cartWithDiscount = await applyPromoCode({ 
 *   code: 'SAVE20' 
 * });
 * 
 * // Apply a free shipping code
 * const cartWithFreeShipping = await applyPromoCode({ 
 *   code: 'FREESHIP' 
 * });
 * ```
 */
export const applyPromoCode = async ({
  code,
}: {
  code: string;
}): Promise<HttpTypes.StoreCart> => {
  const cartId = getStoredCart()

  if (!cartId) {
    throw new Error("No cart found")
  }

  const { cart } = await sendPostRequest<{ cart: HttpTypes.StoreCart }>(
    `/store/carts/${cartId}/promotions`, 
    {
      body: {
        promo_codes: [code],
      },
    },
  )

  return cart
}

/**
 * Removes a promotion code from the current cart.
 * 
 * @param code - The promotion code to remove
 * @returns Promise that resolves to the updated cart without the promotion
 * 
 * @example
 * ```typescript
 * // Remove a discount code
 * const cartWithoutDiscount = await removePromoCode({ 
 *   code: 'SAVE20' 
 * });
 * 
 * // Remove a free shipping code
 * const cartWithoutFreeShipping = await removePromoCode({ 
 *   code: 'FREESHIP' 
 * });
 * ```
 */
export const removePromoCode = async ({
  code,
}: {
  code: string;
}): Promise<HttpTypes.StoreCart> => {
  const cartId = getStoredCart()

  if (!cartId) {
    throw new Error("No cart found")
  }

  const { cart } = await sendDeleteRequest<
    { cart: HttpTypes.StoreCart }
  >(`/store/carts/${cartId}/promotions`, {
    body: {
      promo_codes: [code],
    },
  })

  return cart
}
