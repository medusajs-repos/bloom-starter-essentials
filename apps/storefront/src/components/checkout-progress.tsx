import { Button } from "@/components/ui/button"
import { CheckoutStep, CheckoutStepKey } from "@/lib/types/global"
import { clsx } from "clsx"

type CheckoutProgressProps = {
  steps: CheckoutStep[];
  currentStepIndex: number;
  handleStepChange: (step: CheckoutStepKey) => void;
  className?: string;
};

const CheckoutProgress = ({
  steps,
  currentStepIndex,
  handleStepChange,
  className,
}: CheckoutProgressProps) => {
  return (
    <div className={clsx("flex flex-wrap gap-4 items-center", className)}>
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center gap-4">
          <Button
            onClick={() => handleStepChange(step.key)}
            variant={"transparent"}
            className={clsx(
              "p-0 hover:bg-transparent",
              index !== currentStepIndex &&
                "text-zinc-600 hover:text-zinc-500",
              index === currentStepIndex &&
                "text-zinc-900 hover:text-zinc-600"
            )}
            disabled={index > currentStepIndex}
          >
            {step.title}
          </Button>
          {index < steps.length - 1 && (
            <div className="w-8 h-px bg-zinc-200" />
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutProgress;
