import { formatPrice } from "@/lib/utils/price";
import { clsx } from "clsx";
import { useMemo } from "react";

export type PriceProps = {
  price: number | string;
  type?: "default" | "range" | "discount";
  originalPrice?: {
    price: number | string;
    percentage: string;
  };
  className?: string;
  currencyCode: string;
  textSize?: "small" | "base" | "large" | "xlarge";
  textWeight?: "regular" | "plus";
};

export const Price = ({
  price,
  type = "default",
  originalPrice,
  className,
  currencyCode,
  textSize = "base",
  textWeight = "regular",
}: PriceProps) => {
  const { formattedPrice, formattedSalePrice } = useMemo(() => {
    if (!currencyCode) {
      return {
        formattedPrice: price,
        formattedSalePrice: originalPrice?.price,
      };
    }
    return {
      formattedPrice:
        typeof price === "string"
          ? price
          : formatPrice({ amount: price, currency_code: currencyCode }),
      formattedSalePrice:
        typeof originalPrice?.price === "string"
          ? originalPrice?.price
          : formatPrice({
              amount: originalPrice?.price || 0,
              currency_code: currencyCode,
            }),
    };
  }, [price, originalPrice, currencyCode]);
  return (
    <div className={clsx("flex flex-col text-zinc-900", className)}>
      {originalPrice && (
        <p>
          <span className="line-through text-zinc-600">
            {formattedSalePrice}
          </span>
        </p>
      )}
      <span
        className={clsx({
          "text-sm": textSize === "small" && textWeight === "regular",
          "text-sm font-medium": textSize === "small" && textWeight === "plus",
          "text-base font-medium":
            textSize === "base" && textWeight === "regular",
          "text-base font-semibold":
            textSize === "base" && textWeight === "plus",
          "text-lg": textSize === "large" && textWeight === "regular",
          "text-lg font-bold":
            textSize === "large" && textWeight === "plus",
          "text-xl": textSize === "xlarge" && textWeight === "regular",
          "text-xl font-bold":
            textSize === "xlarge" && textWeight === "plus",
          "text-blue-500": originalPrice,
        })}
      >
        {type === "range" && "From "}
        <span>
          {type === "discount" && price !== 0 && "- "}
          {formattedPrice}
        </span>
      </span>
    </div>
  );
};
