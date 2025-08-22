import { cn } from "lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPaginate from "react-paginate";

type TProps = {
    onChange: (page: number) => void;
    total: number;
    itemsPerPage: number;
    nextLabel?: string;
    previousLabel?: string;
    className?: string;
    placement?: "left" | "right";
};

export default function Pagination({
    onChange,
    total,
    itemsPerPage,
    nextLabel,
    previousLabel,
    className,
    placement = "right",
}: TProps) {
    const pageCount = Math.ceil(total / itemsPerPage);

    if (total > 0 && itemsPerPage > 0) {
        return (
            <div className={`flex ${placement === "right" && "justify-end"}`}>
                <ReactPaginate
                    className={cn(
                        `flex items-center gap-4 mt-10 px-5 py-3`,
                        className
                    )}
                    breakLabel="..."
                    nextLabel={
                        nextLabel ?? <ChevronRight className="text-gray-500" />
                    }
                    previousLabel={
                        previousLabel ?? (
                            <ChevronLeft className="text-gray-500" />
                        )
                    }
                    onPageChange={({ selected }) => onChange(selected + 1)}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    renderOnZeroPageCount={null}
                    pageClassName="font-bold text-center bg-gray-100 rounded-md text-gray-500 cursor-pointer transition-all duration-150 hover:bg-primary hover:text-white"
                    activeClassName="border-gray-500 rounded-md bg-primary text-white"
                    pageLinkClassName="inline-block px-2.5 py-1 w-full h-full"
                />
            </div>
        );
    }
}
