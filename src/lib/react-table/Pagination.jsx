/* eslint-disable react/prop-types */
import "./Pagination.css";
import IconButton from "components/shared/IconButton";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "lib/utils";

/**
 *
 * @param {TablePaginationProps} props
 */
function Pagination(props) {
  const { instance, className, classes, ...rest } = props;

  return (
    <div className={cn("Pagination", className, classes?.root)} {...rest}>
      <span className={cn("Pagination__info", classes?.info)}>
        showing &nbsp;
        {instance.getState().pagination?.pageSize *
          instance.getState().pagination?.pageIndex +
          1}
        &nbsp; to{" "}
        {instance.getState().pagination?.pageSize *
          (instance.getState().pagination?.pageIndex + 1)}{" "}
        of{" "}
        {instance.options.manualPagination && instance.options?.pageCount > 0
          ? instance.options?.pageCount *
              instance.getState().pagination.pageSize -
            (instance.getState().pagination.pageSize -
              instance.getPrePaginationRowModel().rows.length)
          : instance.getPrePaginationRowModel().rows.length}
        &nbsp; entries
      </span>
      <span className="flex">
        <IconButton
          color="inherit"
          size="small"
          onClick={() => instance.setPageIndex(0)}
          disabled={!instance.getCanPreviousPage()}
        >
          <ChevronFirst size={20} />
        </IconButton>
        <IconButton
          color="inherit"
          size="small"
          onClick={() => instance.previousPage()}
          disabled={!instance.getCanPreviousPage()}
        >
          <ChevronLeft size={20} />
        </IconButton>
        {/* <div className={cn("Pagination__page", classes?.page)}>
          <h5 className={cn("Pagination__pageText", classes?.pageText)}>
            {instance.getState()?.pagination?.pageIndex + 1}
          </h5>
        </div> */}
        {[...Array(instance.getPageCount()).keys()].map((pageNumber) => (
          <div
            key={pageNumber}
            className={cn("Pagination__page", {
              [classes?.activePage]:
                pageNumber === instance.getState().pagination?.pageIndex,
            })}
          >
            <h5 className={cn("Pagination__pageText", classes?.pageText)}>
              {pageNumber + 1}
            </h5>
          </div>
        ))}
        <IconButton
          color="inherit"
          size="small"
          onClick={() => instance.nextPage()}
          disabled={!instance.getCanNextPage()}
        >
          <ChevronRight size={20} />
        </IconButton>
        <IconButton
          color="inherit"
          size="small"
          onClick={() => instance.setPageIndex(instance.getPageCount() - 1)}
          disabled={!instance.getCanNextPage()}
        >
          <ChevronLast size={20} />
        </IconButton>
      </span>
    </div>
  );
}

export default Pagination;
