import React from "react";

const IconButton = ({ children }) => {
  return (
    <button className="rounded-lg px-2 py-2 hover:bg-red-light">
      {children}
    </button>
  );
};

export default IconButton;
