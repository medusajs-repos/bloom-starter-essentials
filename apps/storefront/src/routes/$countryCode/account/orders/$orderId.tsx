import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { sdk } from "@/lib/utils/sdk"
import { formatPrice } from "@/lib/utils/price"
import { ArrowLeft } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"

export const Route = createFileRoute("/$countryCode/account/orders/$orderId")({
  component: OrderDetail,
  beforeLoad: async () => {
    try {
      const { customer } = await sdk.store.customer.retrieve()
      if (!customer) {
        throw redirect({
          to: "/$countryCode/account",
          params: { countryCode: "de" },
        })
      }
    } catch {
      throw redirect({
        to: "/$countryCode/account",
        params: { countryCode: "de" },
      })
    }
  },
  loader: async ({ params }) => {
    const { order } = await sdk.store.order.retrieve(params.orderId, {
      fields: "*items,*items.variant,*items.product,*shipping_address,*billing_address,*fulfillments",
    })
    return { order }
  },
})

function OrderDetail() {
  const { order } = Route.useLoaderData()
  const { countryCode } = Route.useParams()

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getFulfillmentStatus = () => {
    if (!order.fulfillments || order.fulfillments.length === 0) {
      return "Not Fulfilled"
    }

    const allFulfilled = order.fulfillments.every(
      (f: HttpTypes.StoreOrderFulfillment) => f.shipped_at || f.delivered_at
    )

    if (allFulfilled) {
      return "Fulfilled"
    }

    return "Partially Fulfilled"
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-40 max-w-4xl">
      <Link
        to="/$countryCode/account/orders"
        params={{ countryCode }}
        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="space-y-8">
        {/* Order Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Order Details</h1>
          <p className="text-neutral-600">Order #{order.display_id}</p>
          <p className="text-sm text-neutral-500 mt-1">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-neutral-50 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Order Total
            </h3>
            <p className="text-2xl font-bold">
              {formatPrice({
                amount: order.total,
                currency_code: order.currency_code,
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Payment Status
            </h3>
            <p className="text-lg font-semibold capitalize">
              {order.payment_status}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Fulfillment Status
            </h3>
            <p className="text-lg font-semibold">{getFulfillmentStatus()}</p>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h2 className="text-xl font-bold mb-4">Items</h2>
          <div className="space-y-4">
            {order.items?.map((item: HttpTypes.StoreOrderLineItem) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border border-neutral-200 rounded-lg"
              >
                {item.product?.thumbnail && (
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product?.title || item.title}</h3>
                  {item.variant?.title && (
                    <p className="text-sm text-neutral-600">{item.variant.title}</p>
                  )}
                  <p className="text-sm text-neutral-600 mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatPrice({
                      amount: item.subtotal,
                      currency_code: order.currency_code,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="p-6 border border-neutral-200 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
            {order.shipping_address ? (
              <div className="text-sm space-y-1">
                <p>
                  {order.shipping_address.first_name}{" "}
                  {order.shipping_address.last_name}
                </p>
                <p>{order.shipping_address.address_1}</p>
                {order.shipping_address.address_2 && (
                  <p>{order.shipping_address.address_2}</p>
                )}
                <p>
                  {order.shipping_address.postal_code}{" "}
                  {order.shipping_address.city}
                </p>
                <p className="uppercase">{order.shipping_address.country_code}</p>
                {order.shipping_address.phone && (
                  <p className="mt-2">{order.shipping_address.phone}</p>
                )}
              </div>
            ) : (
              <p className="text-neutral-500">No shipping address</p>
            )}
          </div>

          {/* Billing Address */}
          <div className="p-6 border border-neutral-200 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Billing Address</h2>
            {order.billing_address ? (
              <div className="text-sm space-y-1">
                <p>
                  {order.billing_address.first_name}{" "}
                  {order.billing_address.last_name}
                </p>
                <p>{order.billing_address.address_1}</p>
                {order.billing_address.address_2 && (
                  <p>{order.billing_address.address_2}</p>
                )}
                <p>
                  {order.billing_address.postal_code}{" "}
                  {order.billing_address.city}
                </p>
                <p className="uppercase">{order.billing_address.country_code}</p>
                {order.billing_address.phone && (
                  <p className="mt-2">{order.billing_address.phone}</p>
                )}
              </div>
            ) : (
              <p className="text-neutral-500">No billing address</p>
            )}
          </div>
        </div>

        {/* Order Totals */}
        <div className="p-6 border border-neutral-200 rounded-lg max-w-md ml-auto">
          <h2 className="text-lg font-bold mb-4">Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Subtotal</span>
              <span>
                {formatPrice({
                  amount: order.subtotal,
                  currency_code: order.currency_code,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Shipping</span>
              <span>
                {formatPrice({
                  amount: order.shipping_total || 0,
                  currency_code: order.currency_code,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Tax</span>
              <span>
                {formatPrice({
                  amount: order.tax_total || 0,
                  currency_code: order.currency_code,
                })}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-neutral-200 font-bold text-base">
              <span>Total</span>
              <span>
                {formatPrice({
                  amount: order.total,
                  currency_code: order.currency_code,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
