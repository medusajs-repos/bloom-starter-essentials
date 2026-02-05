import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const query = req.scope.resolve("query");

  try {
    // Query all order line items with product info
    const { data: lineItems } = await query.graph({
      entity: "order_line_item",
      fields: ["product_id", "quantity"],
      filters: {},
    });

    if (!lineItems || lineItems.length === 0) {
      res.json({ product_ids: [] });
      return;
    }

    // Aggregate sales by product_id
    const salesByProduct = new Map<string, number>();

    for (const item of lineItems) {
      if (item.product_id) {
        const currentCount = salesByProduct.get(item.product_id) || 0;
        salesByProduct.set(item.product_id, currentCount + (item.quantity || 1));
      }
    }

    // Sort by sales count descending
    const sorted = Array.from(salesByProduct.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([productId]) => productId);

    res.json({ product_ids: sorted });
  } catch (error) {
    console.error("Error fetching best selling products:", error);
    res.status(500).json({ product_ids: [], error: "Internal server error" });
  }
}
