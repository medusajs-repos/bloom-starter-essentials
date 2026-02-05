import Radio from "@/components/ui/radio"
import { paymentMethodsData } from "@/lib/constants/payment-methods"
import React from "react"

type PaymentContainerProps = {
  paymentProviderId: string;
  selectedPaymentOptionId: string | null;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
};

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  disabled = false,
  children,
  onClick,
}) => {
  const isSelected = selectedPaymentOptionId === paymentProviderId;

  return (
    <div
      className={`flex flex-col gap-y-2 text-sm cursor-pointer py-4 border px-8 mb-2 hover:border-zinc-300 transition-colors ${
        isSelected
          ? "border-zinc-900 bg-zinc-50"
          : "border-zinc-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Radio checked={isSelected} readOnly />
          <p className="text-base font-medium">
            {paymentMethodsData[paymentProviderId]?.title || paymentProviderId}
          </p>
        </div>
        <span className="justify-self-end text-zinc-900">
          {paymentMethodsData[paymentProviderId]?.icon}
        </span>
      </div>
      {children}
    </div>
  );
};

export default PaymentContainer;
