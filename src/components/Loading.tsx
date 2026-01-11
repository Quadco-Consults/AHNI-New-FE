import logoPng from "@/assets/svgs/logo-bg.svg";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "default" | "lg";
  className?: string;
  text?: string;
}

export const LoadingSpinner = React.memo(({
  size = "default",
  className,
  text = "Loading..."
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)} role="status" aria-live="polite">
      <Loader2 className={cn("animate-spin", sizeClasses[size])} aria-hidden="true" />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
      {!text && <span className="sr-only">Loading...</span>}
    </div>
  );
});

LoadingSpinner.displayName = "LoadingSpinner";

export const Loading = () => {
    return (
        <div className="flex justify-center h-screen items-center p-8">
            <div className="text-center">
                <img
                    src={logoPng?.src || logoPng}
                    alt="logo"
                    className="mx-auto animate-bounce mb-4"
                />
                <LoadingSpinner text="Loading application..." />
            </div>
        </div>
    );
};