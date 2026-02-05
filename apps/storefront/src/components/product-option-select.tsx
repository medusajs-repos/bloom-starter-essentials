import { HttpTypes } from "@medusajs/types";
import { clsx } from "clsx";
import React from "react";

type ProductOptionSelectProps = {
  option: HttpTypes.StoreProductOption;
  current: string | undefined;
  updateOption: (title: string, value: string) => void;
  title: string;
  disabled: boolean;
  "data-testid"?: string;
};

const ProductOptionSelect: React.FC<ProductOptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value);

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">Select {title}</span>
      <div
        className="flex flex-wrap justify-between gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          const isActive = v === current;
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clsx(
                "border text-sm font-medium px-4 py-2.5 flex-1 rounded-base transition-all duration-200 ease-in-out",
                {
                  // Active state
                  "border-zinc-900 bg-zinc-50 text-zinc-900 shadow-sm":
                    isActive,
                  // Default state
                  "border-zinc-300 bg-zinc-50 text-zinc-600":
                    !isActive,
                  // Hover states
                  "hover:bg-zinc-100 hover:border-zinc-300 hover:text-zinc-900":
                    !isActive && !disabled,
                  // Disabled state
                  "opacity-50 cursor-not-allowed": disabled,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductOptionSelect;
