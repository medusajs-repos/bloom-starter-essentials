import { Check } from "@medusajs/icons";
import { clsx } from "clsx";
import { forwardRef } from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onChange, checked, ...props }, ref) => {
    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
    };

    return (
      <div className="relative inline-block w-4 h-4">
        <input
          ref={ref}
          type="checkbox"
          className={clsx(
            "appearance-none shadow-none outline-none focus:outline-none",
            "border border-zinc-200",
            "rounded-none",
            "text-base font-medium text-zinc-900",
            "w-full h-full",
            "bg-white",
            "absolute top-0 left-0 z-10",
            className
          )}
          checked={checked}
          onChange={handleCheck}
          {...props}
        />
        <span
          className={clsx(
            "absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none",
            "z-20",
            {
              "opacity-0": !checked,
              "opacity-100": checked,
            }
          )}
        >
          <Check className="text-zinc-900" />
        </span>
      </div>
    );
  }
);
