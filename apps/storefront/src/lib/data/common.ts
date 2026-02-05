import { FetchArgs } from "@medusajs/js-sdk"
import { sdk } from "@/lib/utils/sdk"

/**
 * Generic function to send HTTP requests using the Medusa SDK client.
 * This is the base function used by all other data utilities.
 * The JS SDK automatically handles JSON serialization for body parameters.
 * 
 * @template T - The expected return type of the API response
 * @param url - The API endpoint URL to send the request to
 * @param data - The fetch arguments including method, query, body, etc.
 * @returns Promise that resolves to the API response data
 * 
 * @example
 * ```typescript
 * // GET request with query parameters
 * const products = await sendRequest<ProductListResponse>('/store/products', {
 *   method: 'GET',
 *   query: { limit: 10, offset: 0, category: 'electronics' }
 * });
 * 
 * // POST request with body (JSON.stringify is handled automatically)
 * const newCart = await sendRequest<CartResponse>('/store/carts', {
 *   method: 'POST',
 *   body: { region_id: 'reg_123' }
 * });
 * 
 * // GET request with complex query parameters
 * const filteredProducts = await sendRequest<ProductListResponse>('/store/products', {
 *   method: 'GET',
 *   query: { 
 *     collection_id: ['col_123', 'col_456'],
 *     tag_id: ['tag_789'],
 *     price_range: { gte: 1000, lte: 5000 }
 *   }
 * });
 * ```
 */
export const sendRequest = async <T = unknown> (
  url: string,
  data: FetchArgs
): Promise<T> => {
  return sdk.client.fetch(url, data)
}