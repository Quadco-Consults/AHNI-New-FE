import React from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ onchange }: { onchange: React.ChangeEventHandler<HTMLInputElement> }) => {
  return (
    <div className=" border border-[#CDD5E0] bg-white rounded-[6px] w-[344px] max-w-full flex items-center justify-between py-[11px] px-[13px]">
      <FiSearch />
      <input className="text outline-none w-full text-xs ml-2" onChange={onchange} type="text" placeholder="Search..." />
    </div>
  );
};

export default SearchBar;
