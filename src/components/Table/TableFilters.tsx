import SearchInput from "atoms/SearchInput";
import FilterIcon from "components/icons/FilterIcon";

import { FC, ReactNode } from "react";

// delcalre props types for
type PageProps = {
  children: ReactNode;
  leftAction?: ReactNode;
};
const TableFilters: FC<PageProps> = ({ children, leftAction }) => {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between mt-1 w-96 gap-x-4 ">
            <SearchInput />
            <div className="p-2 bg-white rounded-lg shadow-2xl cursor-pointer">
              <FilterIcon />
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
