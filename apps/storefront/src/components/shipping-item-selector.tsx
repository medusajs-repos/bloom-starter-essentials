import { Loading } from "@/components/ui/loading"
import { Price } from "@/components/ui/price"
import Radio from "@/components/ui/radio"
import { calculatePriceForShippingOption } from "@/lib/utils/checkout"
import { HttpTypes } from "@medusajs/types"
import { useEffect, useState } from "react"

type ShippingItemSelectorProps = {
  shippingOption: HttpTypes.StoreCartShippingOption;
  cart: HttpTypes.StoreCart;
  isSelected: boolean;
  handleSelect: (optionId: string) => void;
};

const ShippingItemSelector = ({
  shippingOption,
  cart,
  isSelected,
  handleSelect,
}: ShippingItemSelectorProps) => {
  const [calculatedPrice, setCalculatedPrice] = useState<number | undefined>(
    undefined
  );
  const isDisabled =
    shippingOption.price_type === "calculated" &&
    typeof calculatedPrice !== "number";
  const price =
    shippingOption.price_type === "calculated"
      ? calculatedPrice
      : shippingOption.amount;

  useEffect(() => {
    if (shippingOption.price_type !== "calculated") {
      return;
    }

    calculatePriceForShippingOption({
      option_id: shippingOption.id,
    }).then((option) => {
      setCalculatedPrice(option.amount);
    });
  }, [shippingOption.price_type]);

  return (
    <label
      className={`block transition-all duration-200 ${
        isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      <div
        className={`flex items-center justify-between p-5 border transition-colors ${
          isSelected
            ? "border-zinc-900 bg-zinc-50"
            : "border-zinc-200 hover:border-zinc-300"
        }`}
      >
        <div className="flex items-center gap-4">
          <Radio
            checked={isSelected}
            onChange={() => handleSelect(shippingOption.id)}
            disabled={isDisabled}
          />

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-base font-semibold text-zinc-900 mt-[2px]">
                {shippingOption.name}
              </p>
            </div>
            {shippingOption.data?.description !== undefined && (
              <p className="text-xs text-zinc-600 mt-1">
                {shippingOption.data.description as string}
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          {price ? (
            <Price
              price={price}
              currencyCode={cart.currency_code}
              textWeight="plus"
            />
          ) : (
            <Loading className="w-4 h-4" rows={1} />
          )}
        </div>
      </div>
    </label>
  );
};

export default ShippingItemSelector;
