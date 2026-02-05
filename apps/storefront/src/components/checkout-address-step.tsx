import AddressForm from "@/components/address-form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useSetCartAddresses } from "@/lib/hooks/use-checkout"
import { getStoredCountryCode } from "@/lib/utils/region"
import { HttpTypes } from "@medusajs/types"
import { useEffect, useState } from "react"
import { sdk } from "@/lib/utils/sdk"
import { useQuery } from "@tanstack/react-query"

interface AddressStepProps {
  cart: HttpTypes.StoreCart;
  onNext: () => void;
}

const AddressStep = ({ cart, onNext }: AddressStepProps) => {
  const setAddressesMutation = useSetCartAddresses();
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShippingAddressValid, setIsShippingAddressValid] = useState(false);
  const [isBillingAddressValid, setIsBillingAddressValid] = useState(false);
  const [email, setEmail] = useState(cart.email || "");
  const storedCountryCode = getStoredCountryCode();

  // Fetch all regions and countries for worldwide shipping
  const { data: allCountries } = useQuery({
    queryKey: ["regions", "all-countries"],
    queryFn: async () => {
      const { regions } = await sdk.store.region.list({
        fields: "countries.*",
      });
      // Flatten all countries from all regions
      const countries = regions?.flatMap((region: HttpTypes.StoreRegion) => region.countries || []) || [];
      return countries;
    },
  });
  // Get the default country from the cart's region
  const defaultCountryCode = cart.region?.countries?.[0]?.iso_2 || storedCountryCode || "";

  const [shippingAddress, setShippingAddress] = useState<Record<string, any>>({
    first_name: cart.shipping_address?.first_name || "",
    last_name: cart.shipping_address?.last_name || "",
    company: cart.shipping_address?.company || "",
    address_1: cart.shipping_address?.address_1 || "",
    address_2: cart.shipping_address?.address_2 || "",
    city: cart.shipping_address?.city || "",
    postal_code: cart.shipping_address?.postal_code || "",
    province: cart.shipping_address?.province || "",
    country_code:
      cart.shipping_address?.country_code || defaultCountryCode,
    phone: cart.shipping_address?.phone || "",
  });
  const [billingAddress, setBillingAddress] = useState<Record<string, any>>({
    first_name: cart.billing_address?.first_name || "",
    last_name: cart.billing_address?.last_name || "",
    company: cart.billing_address?.company || "",
    address_1: cart.billing_address?.address_1 || "",
    address_2: cart.billing_address?.address_2 || "",
    city: cart.billing_address?.city || "",
    postal_code: cart.billing_address?.postal_code || "",
    province: cart.billing_address?.province || "",
    country_code: cart.billing_address?.country_code || defaultCountryCode,
    phone: cart.billing_address?.phone || "",
  });



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      // Add email
      submitData.append("email", email);

      // Add shipping address
      Object.entries(shippingAddress).forEach(([key, value]) => {
        submitData.append(`shipping_address.${key}`, value);
      });

      // Add billing address (same as shipping if checkbox is checked)
      const billingData = sameAsBilling ? shippingAddress : billingAddress;
      Object.entries(billingData).forEach(([key, value]) => {
        submitData.append(`billing_address.${key}`, value);
      });

      await setAddressesMutation.mutateAsync(submitData);
      onNext();
    } catch (error) {
      console.error("Failed to set addresses:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    const emailValid = email.trim() && email.includes("@");
    const valid = emailValid &&
      isShippingAddressValid &&
      (isBillingAddressValid || sameAsBilling);
    
    console.log('Form validation:', {
      emailValid,
      isShippingAddressValid,
      isBillingAddressValid,
      sameAsBilling,
      valid
    });
    
    return valid;
  };



  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-zinc-900 !text-base font-semibold">
            Shipping Address
          </h3>
          {/* Shipping Address */}
          <AddressForm
            addressFormData={shippingAddress}
            setAddressFormData={setShippingAddress}
            countries={allCountries}
            setIsFormValid={setIsShippingAddressValid}
          />
        </div>

        {/* Billing Address Checkbox */}
        <div className="flex items-center gap-x-2">
          <Checkbox
            id="same_as_billing"
            type="checkbox"
            checked={sameAsBilling}
            onChange={(e) => setSameAsBilling(!!e.target.checked)}
          />
          <label htmlFor="same_as_billing" className="text-sm">
            Billing address is the same as shipping address
          </label>
        </div>

        {/* Billing Address (if different) */}
        {!sameAsBilling && (
          <div className="flex flex-col gap-2">
            <h3 className="text-zinc-900 !text-base font-semibold">
              Billing Address
            </h3>
            <AddressForm
              addressFormData={billingAddress}
              setAddressFormData={setBillingAddress}
              countries={allCountries}
              setIsFormValid={setIsBillingAddressValid}
            />
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full"
          />
          <p className="text-xs text-zinc-600">
            You'll receive order updates to this email.
          </p>
        </div>

        <div className="flex">
          <Button type="submit" disabled={!isFormValid() || isSubmitting}>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddressStep;
