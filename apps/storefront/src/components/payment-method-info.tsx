import { paymentMethodsData } from "@/lib/constants/payment-methods"

type PaymentMethodInfoProps = {
  provider_id: string;
}

const PaymentMethodInfo = ({ provider_id }: PaymentMethodInfoProps) => {
  return (
    <div className="flex items-center gap-2">
      <span>{paymentMethodsData[provider_id]?.title || provider_id}</span>
      {paymentMethodsData[provider_id]?.icon}
    </div>
  )
}

export default PaymentMethodInfo