import React from "react";
import SearchIcon from "components/icons/SearchIcon";

const SearchBar = ({
  onchange,
}: {
  onchange?: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <div className='border border-[#CDD5E0] bg-white rounded-[6px] w-[344px] max-w-full flex gap-2 items-center py-[11px] px-[13px]'>
      <SearchIcon />
      <input
        className='ml-2 h-6 border-none bg-none focus:outline-none outline-none w-[100%]'
        onChange={onchange}
        type='text'
        placeholder='Search...'
      />
    </div>
  );
};

export default SearchBar;
