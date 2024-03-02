import { cn } from "lib/utils";
import React from "react";

const IconButton = ({ children, className }) => {
  return (
    <button
      className={cn("rounded-lg px-2 py-2 hover:bg-red-light", className)}
    >
      {children}
    </button>
  );
};

export default IconButton;
