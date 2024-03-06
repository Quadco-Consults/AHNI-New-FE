import { cn } from "lib/utils";
import React from "react";

const Card = ({ children, className }) => {
  return (
    <div
      className={cn(
        "p-5 bg-white shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
