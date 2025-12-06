/* eslint-disable react/prop-types */
import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import React from "react";

type IconButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
};

const IconButton = ({
  children,
  className,
  onClick,
  variant = "ghost",
  size = "icon"
}: IconButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn("rounded-lg", className)}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default IconButton;
