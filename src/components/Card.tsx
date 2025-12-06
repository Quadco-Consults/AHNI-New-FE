/* eslint-disable react/prop-types */
import { cn } from "lib/utils";
import { ReactNode } from "react";

const Card = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "p-6 bg-card text-card-foreground border shadow-sm rounded-lg",
        className
      )}
    >
      {children}
    </div>
  );
};

export { Card };
export default Card;
