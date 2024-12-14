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

    return (
        <div className={`flex ${placement === "right" && "justify-end"}`}>
            <ReactPaginate
                className={cn(
                    `flex items-center gap-5 mt-10 bg-gray-100 px-5 py-3`,
                    className
                )}
                breakLabel="..."
                nextLabel={
                    nextLabel ?? <ChevronRight className="text-primary" />
                }
                previousLabel={
                    previousLabel ?? <ChevronLeft className="text-primary" />
                }
                onPageChange={({ selected }) => onChange(selected + 1)}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                renderOnZeroPageCount={null}
                pageClassName="text-primary font-bold text-center"
                activeClassName="px-2.5 py-1 border-gray-500 rounded-md bg-primary text-white"
            />
        </div>
    );
}
