import { Search } from "lucide-react";
import FilterIcon from "components/icons/FilterIcon";

import React, { FC, ReactNode } from "react";

type PageProps = {
  children: ReactNode;
  leftAction?: ReactNode;
  filterAction?: () => void;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const TableFilters: FC<PageProps> = ({
  children,
  leftAction,
  filterAction,
  onSearchChange,
}) => {
  return (
    <div className='space-y-8'>
      <div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-between mt-1 w-96 gap-x-4 '>
            <div className='flex items-stretch gap-2 border border-gray-300 rounded-md shadow-sm px-4 py-2 w-[400px]'>
              <Search size={20} className='text-gray-500' />
              <input
                className='w-full text-sm outline-none rounded-none border-none text-md h-[20px]'
                placeholder='Search'
                onChange={onSearchChange}
              />
            </div>
            <div className='p-2 bg-white rounded-lg shadow-2xl cursor-pointer'>
              {filterAction && (
                <div className='' onClick={filterAction}>
                  <FilterIcon />
                </div>
              )}
            </div>
          </div>
          {leftAction}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default TableFilters;