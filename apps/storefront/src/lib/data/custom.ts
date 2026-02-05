import { FetchArgs } from "@medusajs/js-sdk"
import { sendRequest } from "@/lib/data/common"

/**
 * Sends a GET request to the specified URL with optional fetch arguments.
 * The JS SDK automatically handles JSON serialization for body parameters.
 * 
 * @template T - The expected return type of the API response
 * @param url - The API endpoint URL to send the GET request to
 * @param data - Optional fetch arguments (query params, etc.)
 * @returns Promise that resolves to the API response data
 * 
 * @example
 * ```typescript
 * // Simple GET request
 * const products = await sendGetRequest<ProductListResponse>('/store/products');
 * 
 * // GET request with query parameters
 * const filteredProducts = await sendGetRequest<ProductListResponse>('/store/products', {
 *   query: { limit: 10, offset: 0, category: 'electronics' }
 * });
 * 
 * // GET request with complex query parameters
 * const searchResults = await sendGetRequest<ProductListResponse>('/store/products', {
 *   query: { 
 *     collection_id: ['col_123', 'col_456'],
 *     tag_id: ['tag_789'],
 *     price_range: { gte: 1000, lte: 5000 },
 *     order: '-created_at'
 *   }
 * });
 * ```
 */
export const sendGetRequest = async<T = unknown> (
  url: string,
  data?: FetchArgs
): Promise<T> => {
  return sendRequest<T>(url, {
    method: "GET",
    ...data
  })
}

/**
 * Sends a POST request to the specified URL with optional fetch arguments.
 * The JS SDK automatically handles JSON serialization for body parameters.
 * 
 * @template T - The expected return type of the API response
 * @param url - The API endpoint URL to send the POST request to
 * @param data - Optional fetch arguments (body, query, etc.)
 * @returns Promise that resolves to the API response data
 * 
 * @example
 * ```typescript
 * // POST request with JSON body (JSON.stringify is handled automatically)
 * const newCart = await sendPostRequest<CartResponse>('/store/carts', {
 *   body: { region_id: 'reg_123' }
 * });
 * 
 * // POST request with query parameters
 * const createWithParams = await sendPostRequest<CartResponse>('/store/carts', {
 *   body: { region_id: 'reg_123' },
 *   query: { fields: '*items, shipping_methods' }
 * });
 * 
 * // POST request with complex body data
 * const subscription = await sendPostRequest<SubscriptionResponse>('/store/subscriptions', {
 *   body: { 
 *     plan_id: 'plan_123',
 *     customer_id: 'cus_456',
 *     metadata: { source: 'website' }
 *   }
 * });
 * ```
 */
export const sendPostRequest = async<T = unknown> (
  url: string,
  data?: FetchArgs
): Promise<T> => {
  return sendRequest<T>(url, {
    method: "POST",
    ...data
  })
}

/**
 * Sends a DELETE request to the specified URL with optional fetch arguments.
 * The JS SDK automatically handles JSON serialization for body parameters.
 * 
 * @template T - The expected return type of the API response
 * @param url - The API endpoint URL to send the DELETE request to
 * @param data - Optional fetch arguments (body, query, etc.)
 * @returns Promise that resolves to the API response data
 * 
 * @example
 * ```typescript
 * // Simple DELETE request
 * await sendDeleteRequest('/store/carts/cart_123/line-items/item_456');
 * 
 * // DELETE request with body (for bulk operations, JSON.stringify is handled automatically)
 * const result = await sendDeleteRequest<BulkDeleteResponse>('/store/products', {
 *   body: { ids: ['prod_1', 'prod_2'] }
 * });
 * 
 * // DELETE request with query parameters
 * await sendDeleteRequest('/store/carts/cart_123/line-items', {
 *   query: { line_item_id: 'item_456' }
 * });
 * 
 * // DELETE request with complex body data
 * const bulkResult = await sendDeleteRequest<BulkDeleteResponse>('/store/products', {
 *   body: { 
 *     ids: ['prod_1', 'prod_2', 'prod_3'],
 *     force: true,
 *     metadata: { reason: 'cleanup' }
 *   }
 * });
 * ```
 */
export const sendDeleteRequest = async<T = unknown> (
  url: string,
  data?: FetchArgs
): Promise<T> => {
  return sendRequest<T>(url, {
    method: "DELETE",
    ...data
  })
}