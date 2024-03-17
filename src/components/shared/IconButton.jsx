/* eslint-disable react/prop-types */
import { cn } from "lib/utils";

const IconButton = ({ children, className, onClick }) => {
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
