import { useState, Fragment } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { LoadingSpinner } from "@/components/Loading";
import Pagination from "@/components/Pagination";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  renderExpandedRow?: (row: TData) => React.ReactNode;
  canExpand?: (row: TData) => boolean;
}

export default function DataTableWithExpansion<TData>({
  data,
  columns,
  onRowClick,
  isLoading,
  footer = false,
  pagination,
  headClass,
  renderExpandedRow,
  canExpand,
}: TableProps<TData>) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Add expand column if renderExpandedRow is provided
  const columnsWithExpand: ColumnDef<TData, any>[] = renderExpandedRow
    ? [
        {
          id: "expand",
          size: 50,
          header: () => null,
          cell: ({ row }) => {
            const rowData = row.original as any;
            const rowId = rowData.id || row.id;
            const isExpanded = expandedRows.has(rowId);
            const shouldShowExpand = canExpand ? canExpand(row.original) : true;

            if (!shouldShowExpand) {
              return null;
            }

            return (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  const newExpanded = new Set(expandedRows);
                  if (isExpanded) {
                    newExpanded.delete(rowId);
                  } else {
                    newExpanded.add(rowId);
                  }
                  setExpandedRows(newExpanded);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            );
          },
        },
        ...columns,
      ]
    : columns;

  const table = useReactTable<TData>({
    data,
    columns: columnsWithExpand,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    defaultColumn: {},
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
              <TableCell colSpan={columnsWithExpand.length} className="h-24">
                <LoadingSpinner />
              </TableCell>
            </TableRow>
          ) : (
            <>
              {(() => {
                try {
                  if (!table || typeof table.getRowModel !== "function") {
                    return (
                      <TableRow>
                        <TableCell colSpan={columnsWithExpand.length} className="h-24">
                          <p className="text-center">No Data</p>
                        </TableCell>
                      </TableRow>
                    );
                  }
                  const rowModel = table.getRowModel();
                  if (!rowModel || !rowModel.rows) {
                    return (
                      <TableRow>
                        <TableCell colSpan={columnsWithExpand.length} className="h-24">
                          <p className="text-center">No Data</p>
                        </TableCell>
                      </TableRow>
                    );
                  }
                  const rows = rowModel.rows;
                  return rows.length > 0 ? (
                    <>
                      {rows.map((row) => {
                        const rowData = row.original as any;
                        const rowId = rowData.id || row.id;
                        const isExpanded = expandedRows.has(rowId);

                        return (
                          <Fragment key={row.id}>
                            {/* Main Row */}
                            <TableRow
                              className={`text-gray-text text-sm dark:text-white ${
                                onRowClick ? "cursor-pointer" : ""
                              } ${isExpanded ? "bg-blue-50" : ""}`}
                              onClick={onRowClick ? () => onRowClick(row) : undefined}
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

                            {/* Expanded Row */}
                            {isExpanded && renderExpandedRow && (
                              <TableRow className="bg-gray-50">
                                <TableCell
                                  colSpan={columnsWithExpand.length}
                                  className="p-0"
                                >
                                  {renderExpandedRow(row.original)}
                                </TableCell>
                              </TableRow>
                            )}
                          </Fragment>
                        );
                      })}
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columnsWithExpand.length} className="h-24">
                        <p className="text-center">No Data</p>
                      </TableCell>
                    </TableRow>
                  );
                } catch (error) {
                  console.error("DataTable render error:", error);
                  return (
                    <TableRow>
                      <TableCell colSpan={columnsWithExpand.length} className="h-24">
                        <p className="text-center">Error loading data</p>
                      </TableCell>
                    </TableRow>
                  );
                }
              })()}
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
                    className="font-semibold text-black cursor-pointer dark:text-gray-300"
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
