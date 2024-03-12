/* eslint-disable react/prop-types */
import { cn } from "lib/utils";

const Card = ({ children, className }) => {
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

export default Card;
