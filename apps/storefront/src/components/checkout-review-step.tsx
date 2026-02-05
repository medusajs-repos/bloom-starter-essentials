import Address from "@/components/address"
import PaymentButton from "@/components/payment-button"
import PaymentMethodInfo from "@/components/payment-method-info"
import { Button } from "@/components/ui/button"
import { Price } from "@/components/ui/price"
import { getActivePaymentSession, isPaidWithGiftCard } from "@/lib/utils/checkout"
import { HttpTypes } from "@medusajs/types"

interface ReviewStepProps {
  cart: HttpTypes.StoreCart;
  onBack: () => void;
}

const ReviewStep = ({ cart, onBack }: ReviewStepProps) => {
  const paidByGiftcard = isPaidWithGiftCard(cart);
  const activeSession = getActivePaymentSession(cart);

  return (
    <div className="flex flex-col gap-8">
      {/* Delivery Information */}
      {cart.shipping_address && (
        <>
          <div className="flex flex-col gap-2">
            <h3 className="text-zinc-900 !text-base font-semibold">
              Shipping Address
            </h3>
            <Address address={cart.shipping_address} />
          </div>

          {cart.shipping_methods?.[0] && (
            <div className="flex flex-col gap-2">
              <h3 className="text-zinc-900 !text-base font-semibold">
                Shipping Method
              </h3>
              <div className="text-sm text-zinc-600 flex items-center gap-2">
                <div>{cart.shipping_methods[0].name}</div>
                <Price
                  price={cart.shipping_methods[0].amount}
                  currencyCode={cart.currency_code}
                  textWeight="plus"
                  className="text-zinc-600"
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Payment Information */}
      <div className="flex flex-col gap-2">
        <h3 className="text-zinc-900 !text-base font-semibold">
          Billing Address
        </h3>
        <div className="text-sm text-zinc-600">
          {cart.billing_address ? (
            <Address address={cart.billing_address} />
          ) : (
            <span>Same as shipping address</span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-zinc-900 !text-base font-semibold">
          Payment Method
        </h3>
        <div className="text-sm text-zinc-600 flex items-center gap-2">
          {activeSession && (
            <PaymentMethodInfo provider_id={activeSession.provider_id} />
          )}
          {paidByGiftcard && <span>Gift Card</span>}
        </div>
      </div>

      <p className="text-sm text-zinc-600">
        When you place your order, your payment will be authorized and we'll
        start processing your order.
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>

        <PaymentButton cart={cart} />
      </div>
    </div>
  );
};

export default ReviewStep;
