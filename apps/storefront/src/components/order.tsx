import Address from "@/components/address"
import PaymentMethodInfo from "@/components/payment-method-info"
import { Price } from "@/components/ui/price"
import { Thumbnail } from "@/components/ui/thumbnail"
import { isPaidWithGiftCard } from "@/lib/utils/checkout"
import { formatOrderId } from "@/lib/utils/order"
import { HttpTypes } from "@medusajs/types"

type OrderInfoProps = {
  order: HttpTypes.StoreOrder
}

export const OrderInfo = ({ order }: OrderInfoProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold">Order Details</h3>
      <div className="flex gap-2 items-center">
        <span className="text-base font-semibold text-zinc-900">Order ID:</span>
        <span className="text-sm text-zinc-600">
          {formatOrderId(`${order.display_id || order.id}`)}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-base font-semibold text-zinc-900">Order Date:</span>
        <span className="text-sm text-zinc-600">
          {new Date(order.created_at!).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-base font-semibold text-zinc-900">Order Status:</span>
        <span className="text-sm text-zinc-600">{order.status}</span>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-base font-semibold text-zinc-900">Order Email:</span>
        <span className="text-sm text-zinc-600">
          {order.customer?.email || order.email}
        </span>
      </div>
    </div>
  )
}

type OrderLineItemProps = {
  item: HttpTypes.StoreOrderLineItem
  order: HttpTypes.StoreOrder
}

export const OrderLineItem = ({ item, order }: OrderLineItemProps) => {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-zinc-200 last:border-b-0">
      <Thumbnail
        thumbnail={item.thumbnail}
        alt={item.product_title || item.title}
        className="w-16 h-16"
      />
      <div className="flex-1 flex flex-col gap-y-1">
        <span className="text-base font-semibold text-zinc-900">{item.product_title}</span>
        {item.variant_title && item.variant_title !== "Default Variant" && (
          <span className="text-sm text-zinc-600">{item.variant_title}</span>
        )}
        <span className="text-sm text-zinc-600">Quantity: {item.quantity}</span>
      </div>
      <div className="text-right">
        <Price
          price={item.total}
          currencyCode={order.currency_code}
          className="text-zinc-600"
        />
      </div>
    </div>
  )
}

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

export const OrderSummary = ({ order }: OrderSummaryProps) => {
  return (
    <div className="space-y-4">
      <h3 className="mb-4 font-semibold">Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600">Subtotal</span>
          <Price
            price={order.subtotal}
            currencyCode={order.currency_code}
            className="text-zinc-600"
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-zinc-600">Shipping</span>
          <Price
            price={order.shipping_total}
            currencyCode={order.currency_code}
            className="text-zinc-600"
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-zinc-600">Discount</span>
          <Price
            price={order.discount_total}
            currencyCode={order.currency_code}
            type="discount"
            className="text-zinc-600"
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-zinc-600">Tax</span>
          <Price
            price={order.tax_total}
            currencyCode={order.currency_code}
            className="text-zinc-600"
          />
        </div>
      </div>

      <hr className="bg-zinc-200" />

      <div className="flex justify-between">
        <span className="text-zinc-900 text-sm">Total</span>
        <Price price={order.total} currencyCode={order.currency_code} />
      </div>
    </div>
  )
}

type OrderShippingProps = {
  order: HttpTypes.StoreOrder
}

export const OrderShipping = ({ order }: OrderShippingProps) => {
  return (
    <div>
      <h3 className="mb-4 font-semibold">Delivery Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="text-base font-semibold text-zinc-900 mb-2">
            Shipping Address
          </span>
          {order.shipping_address && <Address address={order.shipping_address} />}
        </div>

        {order.shipping_methods?.[0] && (
          <div>
            <span className="text-base font-semibold text-zinc-900 mb-2">
              Shipping Method
            </span>
            <div className="text-sm text-zinc-600 flex items-center justify-between">
              <div>{order.shipping_methods[0].name}</div>
              <Price
                price={order.shipping_methods[0].amount}
                currencyCode={order.currency_code}
                className="text-zinc-600"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

type OrderBillingProps = {
  order: HttpTypes.StoreOrder
}

export const OrderBilling = ({ order }: OrderBillingProps) => {
  const paidByGiftcard = isPaidWithGiftCard(order)

  return (
    <div>
      <h3 className="mb-4">Billing Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="text-base font-semibold text-zinc-900 mb-2">
            Billing Address
          </span>
          <div className="text-sm text-zinc-600">
            {order.billing_address ? (
              <Address address={order.billing_address} />
            ) : (
              <span>Same as shipping address</span>
            )}
          </div>
        </div>
        <div>
          <span className="text-base font-semibold text-zinc-900 mb-2">Payment Method</span>
          <div className="text-sm text-zinc-600">
            {order.payment_collections?.[0].payment_sessions?.[0] && (
              <PaymentMethodInfo
                provider_id={order.payment_collections[0].payment_sessions[0].provider_id}
              />
            )}
            {paidByGiftcard && <span>Gift Card</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

interface OrderDetailsProps {
  order: HttpTypes.StoreOrder
}

export const OrderDetails = ({ order }: OrderDetailsProps) => {
  return (
    <div>
      <div className="flex flex-col gap-8">
        <OrderInfo order={order} />
        <hr className="bg-zinc-200" />
        <div className="flex flex-col gap-4">
          <h3 className="mb-4 font-semibold">Items</h3>
          {order.items?.map((item) => (
            <OrderLineItem key={item.id} item={item} order={order} />
          ))}
        </div>
        <hr className="bg-zinc-200" />
        <OrderShipping order={order} />
        <hr className="bg-zinc-200" />
        <OrderBilling order={order} />
        <hr className="bg-zinc-200" />
        <OrderSummary order={order} />
      </div>
    </div>
  )
}

export default OrderDetails
