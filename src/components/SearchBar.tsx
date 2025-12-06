import React from "react";
import SearchIcon from "components/icons/SearchIcon";

const SearchBar = ({
  onchange,
}: {
  onchange?: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <div className='border border-gray-border bg-background rounded-md w-[344px] max-w-full flex gap-2 items-center py-3 px-3'>
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
