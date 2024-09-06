import { ColumnDef } from "@tanstack/react-table";
import { Agreement } from "services/adminApi/agreements";

export const columnsLease: ColumnDef<Agreement>[] = [
  {
    accessorKey: "provider",
    header: "Provider",
  },
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "Type",
    header: "type",
  },
  {
    accessorKey: "Start Date",
    header: "start_date",
  },
  {
    accessorKey: "End Date",
    header: "end_date",
  },
];
