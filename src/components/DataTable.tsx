import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { LoadingSpinner } from "components/Loading";
import Pagination from "components/Pagination";

import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "components/ui/table";

type TPagination = {
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
};
interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  onRowClick?: (row: any) => void;
  isLoading?: boolean;
  footer?: boolean;
  pagination?: TPagination;
  headClass?: string;
}

export default function DataTable<TData>({
  data,
  columns,
  onRowClick,
  isLoading,
  footer = false,
  pagination,
  headClass,
}: TableProps<TData>) {
  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // debugTable: true,
    defaultColumn: {
      // size: 150,
      // minSize: 100,
      // maxSize: 600,
      // cell: (info) => createElement(Typography, {}, info.getValue()),
    },
  });

  return (
    <div>
      <ShadTable>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  colSpan={header.colSpan}
                  className={`font-semibold text-black cursor-pointer dark:text-gray-300 text-center ${headClass}`}
                  style={{
                    minWidth: header.column.columnDef.size,
                    maxWidth: header.column.columnDef.size,
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24'>
                <LoadingSpinner />
              </TableCell>
            </TableRow>
          ) : (
            <>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className='cursor-pointer text-[#756D6D] text-sm dark:text-white'
                    key={row.id}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24'>
                    <p className='text-center'>No Data</p>
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
        {footer && (
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((footer) => (
                  <TableCell
                    key={footer.id}
                    colSpan={footer.colSpan}
                    className='font-semibold text-black cursor-pointer dark:text-gray-300'
                    style={{
                      minWidth: footer.column.columnDef.size,
                      maxWidth: footer.column.columnDef.size,
                    }}
                  >
                    {footer.isPlaceholder
                      ? null
                      : flexRender(
                          footer.column.columnDef.footer,
                          footer.getContext()
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        )}
      </ShadTable>

      {pagination && (
        <Pagination
          total={pagination.total}
          itemsPerPage={pagination.pageSize}
          onChange={pagination.onChange}
        />
      )}
    </div>
  );
}

/*  <div className="flex items-center justify-end my-4 gap-x-4 ">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <Icon icon="hugeicons:arrow-left-double" />
                    </Button>
                    <span>
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </span>{" "}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <Icon icon="hugeicons:arrow-right-double" />
                    </Button>
                </div> */