import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-x-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        md: "text-foreground px-3 py-1 text-sm font-light",
        success: "bg-green-100 text-green-800 border-green-200",
        warning: "bg-amber-100 text-amber-800 border-amber-200",
        error: "bg-red-100 text-red-800 border-red-200",
        info: "bg-blue-100 text-blue-800 border-blue-200",
        // Priority variants
        urgent: "bg-red-100 text-red-800 border-red-200",
        high: "bg-orange-100 text-orange-800 border-orange-200",
        medium: "bg-amber-100 text-amber-800 border-amber-200",
        low: "bg-blue-100 text-blue-800 border-blue-200",
        system: "bg-purple-100 text-purple-800 border-purple-200",
        // Approval status variants
        approved: "bg-green-100 text-green-800 border-green-200",
        rejected: "bg-red-100 text-red-800 border-red-200",
        pending: "bg-amber-100 text-amber-800 border-amber-200",
        underReview: "bg-blue-100 text-blue-800 border-blue-200",
        darkYellow: "bg-yellow-darker text-white font-light",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
