import PaymentContainer from "@/components/payment-container"
import StripeCardContainer from "@/components/stripe-card-container"
import { Button } from "@/components/ui/button"
import {
  useCartPaymentMethods,
  useInitiateCartPaymentSession,
} from "@/lib/hooks/use-checkout"
import { isStripe as isStripeFunc, getActivePaymentSession, isPaidWithGiftCard } from "@/lib/utils/checkout"
import { HttpTypes } from "@medusajs/types"
import { useCallback, useEffect, useState } from "react"

interface PaymentStepProps {
  cart: HttpTypes.StoreCart;
  onNext: () => void;
  onBack: () => void;
}

const PaymentStep = ({ cart, onNext, onBack }: PaymentStepProps) => {
  const { data: availablePaymentMethods = [] } = useCartPaymentMethods({
    region_id: cart.region?.id,
  });
  const initiatePaymentSessionMutation = useInitiateCartPaymentSession();

  const activeSession = getActivePaymentSession(cart);

  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  );

  // Update selected payment method when payment methods are loaded
  useEffect(() => {
    if (!selectedPaymentMethod && availablePaymentMethods?.length > 0) {
      setSelectedPaymentMethod(availablePaymentMethods[0].id);
      handlePaymentMethodChange(availablePaymentMethods[0].id);
    }
  }, [availablePaymentMethods, selectedPaymentMethod]);

  const isStripe = isStripeFunc(selectedPaymentMethod);

  const paidByGiftcard = isPaidWithGiftCard(cart);

  const initiatePaymentSession = useCallback(
    async (method: string) => {
      initiatePaymentSessionMutation.mutateAsync(
        { provider_id: method },
        {
          onError: (error) => {
            setError(
              error instanceof Error ? error.message : "An error occurred"
            );
          },
        }
      );
    },
    [initiatePaymentSessionMutation]
  );

  const handlePaymentMethodChange = async (method: string) => {
    setError(null);
    setSelectedPaymentMethod(method);

    initiatePaymentSession(method);
  };

  const handleSubmit = useCallback(async () => {
    if (!selectedPaymentMethod) return;

    if (!activeSession) {
      await initiatePaymentSession(selectedPaymentMethod);
    }

    onNext();
  }, [selectedPaymentMethod, activeSession, onNext, initiatePaymentSession]);

  return (
    <div className="flex flex-col gap-8">
      {!paidByGiftcard && (availablePaymentMethods?.length ?? 0) > 0 && (
        <>
          {availablePaymentMethods.length === 0 && (
            <p className="text-base font-medium text-zinc-600">
              No payment methods available
            </p>
          )}
          {availablePaymentMethods.map((paymentMethod) => (
            <div key={paymentMethod.id}>
              <PaymentContainer
                paymentProviderId={paymentMethod.id}
                selectedPaymentOptionId={selectedPaymentMethod}
                onClick={() => handlePaymentMethodChange(paymentMethod.id)}
              >
                {isStripeFunc(paymentMethod.id) && (
                  <StripeCardContainer
                    paymentProviderId={paymentMethod.id}
                    selectedPaymentOptionId={selectedPaymentMethod}
                    setError={setError}
                    onSelect={() => handlePaymentMethodChange(paymentMethod.id)}
                    onCardComplete={handleSubmit}
                  />
                )}
              </PaymentContainer>
            </div>
          ))}
        </>
      )}

      {paidByGiftcard && (
        <div className="flex flex-col w-1/3">
          <p className="text-base font-semibold text-zinc-900 mb-1">
            Payment method
          </p>
          <p
            className="text-base font-semibold text-zinc-600"
            data-testid="payment-method-summary"
          >
            Gift card
          </p>
        </div>
      )}

      {error && (
        <div
          className="text-rose-900 text-sm"
          data-testid="payment-method-error-message"
        >
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={onBack}
          disabled={initiatePaymentSessionMutation.isPending}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            (isStripe && !activeSession) ||
            (!selectedPaymentMethod && !paidByGiftcard) ||
            initiatePaymentSessionMutation.isPending
          }
          data-testid="submit-payment-button"
        >
          {!activeSession && isStripeFunc(selectedPaymentMethod)
            ? "Enter card details"
            : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
