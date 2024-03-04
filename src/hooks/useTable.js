import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { createElement } from "react";

/**
 *
 * @param {import("@tanstack/react-table").TableOptions<any>} options
 * @returns
 */
function useTable(options) {
  return useReactTable({
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    columns,
    ...options,
    data: options.data || data,
    defaultColumn: {
      // size: 150,
      // minSize: 100,
      // maxSize: 600,
      // cell: (info) => createElement(Typography, {}, info.getValue()),
      ...options?.defaultColumn,
    },
  });
}

export default useTable;

const data = [];

const columns = [{}];
