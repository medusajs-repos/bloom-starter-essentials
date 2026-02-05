import { HttpTypes } from "@medusajs/types"
import { getStoredCart } from "@/lib/utils/cart"
import { updateCart } from "@/lib/data/cart"

/**
 * Sets shipping and billing addresses for the current cart from form data.
 * Parses FormData and extracts address information for both shipping and billing addresses.
 * 
 * @param form_data - FormData containing address fields with prefixes 'shipping_address.' and 'billing_address.'
 * @returns Promise that resolves to the updated cart with addresses
 * @throws Error if no cart is found
 * 
 * @example
 * ```typescript
 * // From a checkout form
 * const formData = new FormData();
 * formData.append('shipping_address.first_name', 'John');
 * formData.append('shipping_address.last_name', 'Doe');
 * formData.append('shipping_address.address_1', '123 Main St');
 * formData.append('shipping_address.city', 'New York');
 * formData.append('shipping_address.postal_code', '10001');
 * formData.append('shipping_address.country_code', 'us');
 * formData.append('billing_address.first_name', 'John');
 * formData.append('billing_address.last_name', 'Doe');
 * formData.append('billing_address.address_1', '123 Main St');
 * formData.append('billing_address.city', 'New York');
 * formData.append('billing_address.postal_code', '10001');
 * formData.append('billing_address.country_code', 'us');
 * formData.append('email', 'john@example.com');
 * 
 * const updatedCart = await setCartAddresses({ form_data: formData });
 * 
 * // In a React component
 * const handleAddressSubmit = async (formData: FormData) => {
 *   try {
 *     const cart = await setCartAddresses({ form_data: formData });
 *     console.log('Addresses set successfully:', cart);
 *     // Proceed to next step
 *   } catch (error) {
 *     console.error('Failed to set addresses:', error);
 *   }
 * };
 * ```
 */
export const setCartAddresses = async ({
  form_data, 
}: {
  form_data: FormData;
}): Promise<HttpTypes.StoreCart> => {
  const cartId = getStoredCart()

  if (!cartId) {
    throw new Error("No cart found")
  }

  const data = Object.fromEntries(form_data.entries())

  const shippingAddress = {
    first_name: data["shipping_address.first_name"] as string,
    last_name: data["shipping_address.last_name"] as string,
    address_1: data["shipping_address.address_1"] as string,
    address_2: (data["shipping_address.address_2"] as string) || "",
    company: (data["shipping_address.company"] as string) || "",
    postal_code: data["shipping_address.postal_code"] as string,
    city: data["shipping_address.city"] as string,
    country_code: data["shipping_address.country_code"] as string,
    province: (data["shipping_address.province"] as string) || "",
    phone: (data["shipping_address.phone"] as string) || "",
  }

  const billingAddress = {
    first_name: data["billing_address.first_name"] as string,
    last_name: data["billing_address.last_name"] as string,
    address_1: data["billing_address.address_1"] as string,
    address_2: (data["billing_address.address_2"] as string) || "",
    company: (data["billing_address.company"] as string) || "",
    postal_code: data["billing_address.postal_code"] as string,
    city: data["billing_address.city"] as string,
    country_code: data["billing_address.country_code"] as string,
    province: (data["billing_address.province"] as string) || "",
    phone: (data["billing_address.phone"] as string) || "",
  }

  const email = data.email as string

  const cart = await updateCart(
    {
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      email,
    },
  )
  return cart
}