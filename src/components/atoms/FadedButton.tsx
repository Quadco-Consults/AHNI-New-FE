"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

interface FadedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const FadedButton: React.FC<FadedButtonProps> = ({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button"
}) => {
  return (
    <Button
      onClick={onClick}
      className={`opacity-60 hover:opacity-100 transition-opacity ${className}`}
      disabled={disabled}
      type={type}
      variant="outline"
    >
      {children}
    </Button>
  );
};

export default FadedButton;