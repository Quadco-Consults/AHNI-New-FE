/* eslint-disable react/prop-types */
import { cn } from "lib/utils";
import React from "react";

type IconButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const IconButton = ({ children, className, onClick }: IconButtonProps) => {
  return (
    <button
      className={cn(
        "rounded-lg px-2 py-2 bg-[#F9F9F9] dark:text-black hover:text-primary dark:hover:text-primary",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default IconButton;
