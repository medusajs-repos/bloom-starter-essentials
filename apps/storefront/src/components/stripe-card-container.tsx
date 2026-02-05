import { Input } from "@/components/ui/input"
import { useState } from "react"

type StripeCardContainerProps = {
  paymentProviderId: string;
  selectedPaymentOptionId: string | null;
  disabled?: boolean;
  setError?: (error: string | null) => void;
  onCardComplete?: () => void;
  onSelect?: () => void;
};

const StripeCardContainer: React.FC<StripeCardContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  onCardComplete,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardBrand, setCardBrand] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  const isSelected = selectedPaymentOptionId === paymentProviderId;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(value);

    // Simulate card brand detection
    if (value.startsWith("4")) {
      setCardBrand("Visa");
    } else if (value.startsWith("5")) {
      setCardBrand("Mastercard");
    } else {
      setCardBrand("");
    }

    // Simulate validation
    const isComplete =
      value.replace(/\s/g, "").length >= 16 &&
      expiryDate.length >= 5 &&
      cvv.length >= 3;
    if (isComplete) {
      onCardComplete?.();
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setExpiryDate(value);

    // Simulate validation
    const isComplete =
      cardNumber.replace(/\s/g, "").length >= 16 &&
      value.length >= 5 &&
      cvv.length >= 3;
    if (isComplete) {
      onCardComplete?.();
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvv(value);

    // Simulate validation
    const isComplete =
      cardNumber.replace(/\s/g, "").length >= 16 &&
      expiryDate.length >= 5 &&
      value.length >= 3;
    if (isComplete) {
      onCardComplete?.();
    }
  };

  return (
    <>
      {isSelected && (
        <div className="my-4 transition-all duration-150 ease-in-out">
          <p className="text-base font-semibold text-zinc-900 mb-4">
            Enter your card details:
          </p>
          <div className="space-y-4 flex flex-wrap">
            <div>
              <label htmlFor="card-number">Card number</label>
              <Input
                id="card-number"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {cardBrand && (
                <p className="text-sm text-zinc-900">{cardBrand}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry-date">Expiry date</label>
                <Input
                  id="expiry-date"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <label htmlFor="cvv">CVV</label>
                <Input
                  id="cvv"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>
            <div>
              <label htmlFor="cardholder-name">Cardholder name</label>
              <Input
                id="cardholder-name"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
          </div>
          <div className="mt-3 text-xs text-zinc-600">
            This is a demo form. In production, use Stripe Elements for secure
            card input.
          </div>
        </div>
      )}
    </>
  );
};

export default StripeCardContainer;
