import CheckoutProgress from "@/components/checkout-progress"
import { CartEmpty } from "@/components/cart"
import { Loading } from "@/components/ui/loading"
import { useCart } from "@/lib/hooks/use-cart"
import { type CheckoutStep, CheckoutStepKey } from "@/lib/types/global"
import {
  useLoaderData,
  useLocation,
  useNavigate,
} from "@tanstack/react-router"
import { lazy, Suspense, useEffect, useMemo } from "react"

const DeliveryStep = lazy(() => import("@/components/checkout-delivery-step"))
const AddressStep = lazy(() => import("@/components/checkout-address-step"))
const PaymentStep = lazy(() => import("@/components/checkout-payment-step"))
const ReviewStep = lazy(() => import("@/components/checkout-review-step"))
const CheckoutSummary = lazy(() => import("@/components/checkout-summary"))

const Checkout = () => {
  const { step } = useLoaderData({
    from: "/$countryCode/checkout",
  });
  const { data: cart, isLoading: cartLoading } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const steps: CheckoutStep[] = useMemo(() => {
    return [
      {
        key: CheckoutStepKey.ADDRESSES,
        title: "Addresses",
        description: "Enter your shipping and billing addresses.",
        completed: !!(cart?.shipping_address && cart?.billing_address),
      },
      {
        key: CheckoutStepKey.DELIVERY,
        title: "Delivery",
        description: "Select a shipping method.",
        completed: !!cart?.shipping_methods?.length,
      },
      {
        key: CheckoutStepKey.PAYMENT,
        title: "Payment",
        description:
          "Select a payment method. You won't be charged until you place your order.",
        completed: !!cart?.payment_collection?.payment_sessions?.length,
      },
      {
        key: CheckoutStepKey.REVIEW,
        title: "Review",
        description: "Review your order details before placing your order.",
        completed: false,
      },
    ];
  }, [cart]);

  const currentStepIndex = useMemo(
    () => steps.findIndex((s) => s.key === step),
    [step, steps]
  );

  const goToStep = (step: CheckoutStepKey) => {
    navigate({
      to: `${location.pathname}?step=${step}`,
      replace: true,
    });
  };

  useEffect(() => {
    // Determine which step to show based on cart state
    if (!cart) {
      return;
    }

    if (
      step !== CheckoutStepKey.ADDRESSES &&
      currentStepIndex >= 0 &&
      !steps[0].completed
    ) {
      goToStep(CheckoutStepKey.ADDRESSES);
      return;
    }

    if (
      step !== CheckoutStepKey.DELIVERY &&
      currentStepIndex >= 1 &&
      !steps[1].completed
    ) {
      goToStep(CheckoutStepKey.DELIVERY);
      return;
    }

    if (
      step !== CheckoutStepKey.PAYMENT &&
      currentStepIndex >= 2 &&
      !steps[2].completed
    ) {
      goToStep(CheckoutStepKey.PAYMENT);
      return;
    }
  }, [cart, steps, location]);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      goToStep(steps[nextIndex].key);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      goToStep(steps[prevIndex].key);
    }
  };

  return (
    <div className="content-container pt-40 pb-8 flex flex-col gap-8">
      {/* Progress Steps */}
      <CheckoutProgress
        steps={steps}
        currentStepIndex={currentStepIndex}
        handleStepChange={goToStep}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-24">
        <div className="flex flex-col gap-1 lg:col-span-2">
          <h2 className="text-zinc-900 text-xl">
            {steps[currentStepIndex].title}
          </h2>
          <p className="text-base font-medium text-zinc-600">
            {steps[currentStepIndex].description}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-zinc-900 text-xl">Order Summary</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-24">
        {/* Left Column - Checkout Steps */}
        <div className="space-y-6 lg:col-span-2">
          <Suspense fallback={<Loading />}>
            {cartLoading && <Loading />}
            {cart && (
              <>
                {/* Address Step */}
                {step === CheckoutStepKey.ADDRESSES && (
                  <AddressStep cart={cart} onNext={handleNext} />
                )}

                {/* Delivery Step */}
                {step === CheckoutStepKey.DELIVERY && (
                  <DeliveryStep
                    cart={cart}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}

                {/* Payment Step */}
                {step === CheckoutStepKey.PAYMENT && (
                  <PaymentStep
                    cart={cart}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}

                {/* Review Step */}
                {step === CheckoutStepKey.REVIEW && (
                  <ReviewStep cart={cart} onBack={handleBack} />
                )}
              </>
            )}
          </Suspense>
        </div>

        {/* Right Column - Order Summary */}
        <Suspense fallback={<Loading />}>
          {cartLoading && <Loading />}
          {cart && <CheckoutSummary cart={cart} />}
          {!cart && !cartLoading && <CartEmpty />}
        </Suspense>
      </div>
    </div>
  );
};

export default Checkout;
