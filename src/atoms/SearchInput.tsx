import { Input } from "components/ui/input";
import { Search } from "lucide-react";

const SearchInput = () => {
  return (
    <div className="relative flex items-center text-[#20293A] w-full max-w-md">
      <Search className="absolute left-2 text " />
      <Input
        className="w-full py-2 pl-10 pr-4 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 dark:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder="Search"
        type="search"
      />
    </div>
  );
};

export default SearchInput;
