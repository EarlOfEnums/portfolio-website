import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const chipVariants = cva(
  "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        secondary: "bg-chip-primary text-chip-primary-foreground",
        primary: "bg-chip-secondary text-chip-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {}

const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        className={cn(chipVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
