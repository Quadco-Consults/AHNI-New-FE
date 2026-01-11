"use client";

import React, { memo, useMemo, useCallback } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  PaginationState,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface OptimizedTableProps<T> {
  data: T[];
  columns: any[];
  isLoading?: boolean;
  pagination?: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    onPaginationChange: (pagination: PaginationState) => void;
  };
  sorting?: {
    sorting: SortingState;
    onSortingChange: (sorting: SortingState) => void;
  };
  enableVirtualization?: boolean;
  rowHeight?: number;
}

// Memoized table row component
const TableRowComponent = memo<{
  row: any;
  index: number;
}>(({ row }) => (
  <TableRow key={row.id}>
    {row.getVisibleCells().map((cell: any) => (
      <TableCell key={cell.id}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    ))}
  </TableRow>
));
TableRowComponent.displayName = 'TableRowComponent';

// Loading skeleton for table
const TableSkeleton = memo(() => (
  <>
    {Array.from({ length: 10 }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {Array.from({ length: 5 }).map((_, cellIndex) => (
          <TableCell key={`skeleton-cell-${cellIndex}`}>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
));
TableSkeleton.displayName = 'TableSkeleton';

function OptimizedTable<T>({
  data,
  columns,
  isLoading = false,
  pagination,
  sorting,
  enableVirtualization = false,
  rowHeight = 50,
}: OptimizedTableProps<T>) {
  // Memoize table configuration
  const tableConfig = useMemo(() => ({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: !!pagination,
    manualSorting: !!sorting,
    pageCount: pagination?.pageCount ?? -1,
    state: {
      ...(pagination && { pagination: { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize } }),
      ...(sorting && { sorting: sorting.sorting }),
    },
    onPaginationChange: pagination?.onPaginationChange,
    onSortingChange: sorting?.onSortingChange,
  }), [data, columns, pagination, sorting]);

  const table = useReactTable(tableConfig);

  // Memoize pagination handlers
  const paginationHandlers = useMemo(() => {
    if (!pagination) return {};

    return {
      goToFirstPage: () => pagination.onPaginationChange({
        pageIndex: 0,
        pageSize: pagination.pageSize
      }),
      goToPreviousPage: () => pagination.onPaginationChange({
        pageIndex: Math.max(0, pagination.pageIndex - 1),
        pageSize: pagination.pageSize
      }),
      goToNextPage: () => pagination.onPaginationChange({
        pageIndex: Math.min(pagination.pageCount - 1, pagination.pageIndex + 1),
        pageSize: pagination.pageSize
      }),
      goToLastPage: () => pagination.onPaginationChange({
        pageIndex: pagination.pageCount - 1,
        pageSize: pagination.pageSize
      }),
    };
  }, [pagination]);

  // Render table rows
  const renderTableRows = useCallback(() => {
    if (isLoading) {
      return <TableSkeleton />;
    }

    const rows = table.getRowModel().rows;

    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500">
            No data available
          </TableCell>
        </TableRow>
      );
    }

    return rows.map((row, index) => (
      <TableRowComponent key={row.id} row={row} index={index} />
    ));
  }, [table, isLoading, columns.length]);

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())
                    }
                    {header.column.getCanSort() && (
                      <span className="ml-2">
                        {{
                          asc: ' ↑',
                          desc: ' ↓',
                        }[header.column.getIsSorted() as string] ?? ' ↕️'}
                      </span>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {renderTableRows()}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Page {pagination.pageIndex + 1} of {pagination.pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={paginationHandlers.goToFirstPage}
              disabled={pagination.pageIndex === 0}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={paginationHandlers.goToPreviousPage}
              disabled={pagination.pageIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={paginationHandlers.goToNextPage}
              disabled={pagination.pageIndex >= pagination.pageCount - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={paginationHandlers.goToLastPage}
              disabled={pagination.pageIndex >= pagination.pageCount - 1}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(OptimizedTable) as typeof OptimizedTable;