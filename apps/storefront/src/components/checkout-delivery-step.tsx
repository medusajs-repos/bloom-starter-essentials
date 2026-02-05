import ShippingItemSelector from "@/components/shipping-item-selector"
import { Button } from "@/components/ui/button"
import {
  useSetCartShippingMethod,
  useShippingOptions,
} from "@/lib/hooks/use-checkout"
import { HttpTypes } from "@medusajs/types"
import { useEffect, useState } from "react"

interface DeliveryStepProps {
  cart: HttpTypes.StoreCart;
  onNext: () => void;
  onBack: () => void;
}

const DeliveryStep = ({ cart, onNext, onBack }: DeliveryStepProps) => {
  const { data: shippingOptions } = useShippingOptions({ cart_id: cart.id });
  const setShippingMethodMutation = useSetCartShippingMethod();
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    cart.shipping_methods?.[0]?.shipping_option_id || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Auto-select first option if none selected and options are available
    if (!selectedOptionId && shippingOptions && shippingOptions.length > 0) {
      setSelectedOptionId(shippingOptions[0].id);
    }
  }, [shippingOptions, selectedOptionId]);

  const handleSubmit = async () => {
    if (!selectedOptionId || isSubmitting) return;

    setIsSubmitting(true);
    await setShippingMethodMutation.mutateAsync(
      {
        shipping_option_id: selectedOptionId,
      },
      {
        onSuccess: () => {
          onNext();
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
        onError: (error) => {
          console.error("Failed to set shipping method:", error);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        {shippingOptions?.map((option) => (
          <ShippingItemSelector
            key={option.id}
            shippingOption={option}
            isSelected={selectedOptionId === option.id}
            handleSelect={setSelectedOptionId}
            cart={cart}
          />
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedOptionId || isSubmitting}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DeliveryStep;
