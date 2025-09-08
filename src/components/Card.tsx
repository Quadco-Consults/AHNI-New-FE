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
        "p-5 bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]",
        className
      )}
    >
      {children}
    </div>
  );
};

export { Card };
export default Card;
