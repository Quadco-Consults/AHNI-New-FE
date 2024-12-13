import { cn } from "lib/utils";
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
                className={cn(`flex items-center gap-3 mt-10`, className)}
                breakLabel="..."
                nextLabel={nextLabel ?? ""}
                previousLabel={previousLabel ?? ""}
                onPageChange={({ selected }) => onChange(selected + 1)}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                renderOnZeroPageCount={null}
                pageClassName="bg-gray-100 px-2.5 py-1 text-center rounded-md"
                activeClassName="bg-primary text-white"
            />
        </div>
    );
}
