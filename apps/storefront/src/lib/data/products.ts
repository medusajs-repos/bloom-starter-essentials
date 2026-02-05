import { sdk } from "@/lib/utils/sdk"
import { HttpTypes } from "@medusajs/types"

/**
 * Lists products with pagination support and filtering options.
 * 
 * @param page_param - The page number to fetch (defaults to 1)
 * @param query_params - Optional query parameters for filtering, sorting, and field selection
 * @param region_id - Optional region ID to get region-specific pricing and availability
 * @returns Promise that resolves to an object containing products array, total count, and next page number
 * 
 * @example
 * ```typescript
 * // Get first page of products
 * const { products, count, next_page } = await listProducts({
 *   region_id: 'reg_us'
 * });
 * 
 * // Get products with filtering
 * const { products } = await listProducts({
 *   page_param: 1,
 *   query_params: {
 *     limit: 20,
 *     offset: 0,
 *     collection_id: ['col_123'],
 *     category_id: ['cat_456'],
 *     q: 'search term',
 *     order: '-created_at'
 *   },
 *   region_id: 'reg_eu'
 * });
 * 
 * // Get products with specific fields
 * const { products } = await listProducts({
 *   query_params: {
 *     fields: '*variants, *images, *collection, *tags',
 *     limit: 10
 *   },
 *   region_id: 'reg_gb'
 * });
 * 
 * // Get next page
 * if (next_page) {
 *   const nextPageData = await listProducts({
 *     page_param: next_page,
 *     query_params,
 *     region_id
 *   });
 * }
 * ```
 */
export const listProducts = async ({
  page_param = 1,
  query_params,
  region_id,
}: {
  page_param?: number;
  query_params?: HttpTypes.StoreProductListParams;
  region_id?: string;
}): Promise<{
  products: HttpTypes.StoreProduct[];
  count: number;
  next_page: number | null;
}> => {
  const limit = query_params?.limit || 12
  const _page_param = Math.max(page_param, 1)
  const offset = _page_param === 1 ? 0 : (_page_param - 1) * limit

  const response = await sdk.store.product.list({
    limit,
    offset,
    region_id,
    ...query_params,
  })

  const next_page = offset + limit < response.count ? _page_param + 1 : null

  return {
    products: response.products,
    count: response.count,
    next_page,
  }
}

/**
 * Retrieves a single product by its handle with optional region-specific data.
 * 
 * @param handle - The product handle (slug) to retrieve
 * @param region_id - Optional region ID to get region-specific pricing and availability
 * @param fields - Optional fields to include in the response
 * @returns Promise that resolves to the product data
 * @throws Error if product with the given handle is not found
 * 
 * @example
 * ```typescript
 * // Get product by handle
 * const product = await retrieveProduct({
 *   handle: 'awesome-t-shirt',
 *   region_id: 'reg_us'
 * });
 * 
 * // Get product with specific fields
 * const product = await retrieveProduct({
 *   handle: 'awesome-t-shirt',
 *   region_id: 'reg_eu',
 *   fields: '*variants, *images, *options, *options.values, *collection, *tags'
 * });
 * 
 * // Get product with inventory data
 * const product = await retrieveProduct({
 *   handle: 'awesome-t-shirt',
 *   region_id: 'reg_gb',
 *   fields: '*variants, +variants.inventory_quantity, +variants.manage_inventory, +variants.allow_backorder'
 * });
 * 
 * // Get product with price. Must start the fields with `*variants.calculated_price`
 * const product = await retrieveProduct({
 *   handle: 'awesome-t-shirt',
 *   region_id: 'reg_gb',
 *   fields: '*variants.calculated_price, handle'
 * });
 * 
 * // Handle errors
 * try {
 *   const product = await retrieveProduct({ handle: 'non-existent-product' });
 * } catch (error) {
 *   console.error('Product not found:', error.message);
 * }
 * ```
 */
export const retrieveProduct = async ({
  handle,
  region_id,
  fields,
}: {
  handle: string;
  region_id?: string;
  fields?: string;
}): Promise<HttpTypes.StoreProduct> => {
  const { products } = await sdk.store.product.list({
    handle: handle,
    region_id,
    fields: fields ||
      "*variants, +variants.inventory_quantity, +variants.manage_inventory, +variants.allow_backorder, *images, *options, *options.values, *collection, *tags",
  })

  if (!products || products.length === 0) {
    throw new Error(`Product with handle ${handle} not found`)
  }

  return products[0]
}

/**
 * Gets product IDs sorted by sales count (best selling products).
 * Calls backend API endpoint that queries actual order line items.
 * 
 * @returns Promise that resolves to array of product IDs sorted by sales count (highest first)
 * 
 * @example
 * ```typescript
 * const bestSellingIds = await getBestSellingProductIds();
 * // Use these IDs to filter/sort products: { id: bestSellingIds }
 * ```
 */
export const getBestSellingProductIds = async (): Promise<string[]> => {
  try {
    const backendUrl = import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000";
    const publishableKey = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY;
    
    const response = await fetch(`${backendUrl}/store/best-selling`, {
      headers: {
        "Content-Type": "application/json",
        ...(publishableKey && { "x-publishable-api-key": publishableKey }),
      },
    });
    
    if (!response.ok) {
      console.error("Failed to fetch best selling products", response.status);
      return [];
    }
    
    const { product_ids } = await response.json();
    return product_ids || [];
  } catch (error) {
    console.error("Error fetching best selling products:", error);
    return [];
  }
}
