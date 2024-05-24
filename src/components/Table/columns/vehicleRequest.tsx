import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "components/ui/checkbox";

type Data = {
  vehicleRegNo: string;
  dateOfDept: string;
  dateOfReturn: string;
  approval: string;
  nft: number;
  isSelected: boolean;
};

export const vehicleRequestData: Data[] = [
  {
    vehicleRegNo: "Ford - 12R 85 FG",
    dateOfDept: "10/20/24",
    dateOfReturn: "10/24/24",
    approval: "Approved",
    nft: 6,
    isSelected: false,
  },
  {
    vehicleRegNo: "Toyota Hilux - 12R 75 FG",
    dateOfDept: "10/20/24",
    dateOfReturn: "10/24/24",
    approval: "Pending",
    nft: 10,
    isSelected: false,
  },
  {
    vehicleRegNo: "Ford - 12R 85 FG",
    dateOfDept: "10/20/24",
    dateOfReturn: "10/24/24",
    approval: "Approved",
    nft: 11,
    isSelected: false,
  },
  {
    vehicleRegNo: "Toyota Hilux - 12R 75 FG",
    dateOfDept: "10/20/24",
    dateOfReturn: "10/24/24",
    approval: "Pending",
    nft: 5,
    isSelected: false,
  },
  {
    vehicleRegNo: "Urvan Bus - 12R 85 FG",
    dateOfDept: "10/20/24",
    dateOfReturn: "10/24/24",
    approval: "Approved",
    nft: 7,
    isSelected: false,
  },
  {
    vehicleRegNo: "Urvan Bus - 12R 75 FG",
    dateOfDept: "10/20/24",
    dateOfReturn: "10/24/24",
    approval: "Pending",
    nft: 9,
    isSelected: false,
  },
];

export const vehicleRequestColumns: ColumnDef<Data>[] = [
  {
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    accessorKey: "isSelected",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    header: "Vehicle Reg. No",
    accessorKey: "vehicleRegNo",
  },
  {
    header: "Date of Dept.",
    accessorKey: "dateOfDept",
  },
  {
    header: "Date of Return",
    accessorKey: "dateOfReturn",
  },
  {
    header: "Approval",
    accessorKey: "approval",
  },
  {
    header: "N.F.T",
    accessorKey: "nft",
  },
];
