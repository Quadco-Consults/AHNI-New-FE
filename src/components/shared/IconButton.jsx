import { cn } from "lib/utils";
import React from "react";

const IconButton = ({ children, className, onClick }) => {
  return (
    <button
      className={cn("rounded-lg px-2 py-2 hover:bg-red-light", className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default IconButton;
