import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "components/ui/checkbox";
import { ChevronDown } from "lucide-react";

interface MaintenanceData {
  facility: string;
  state: string;
  address: string;
  maintenanceType: string;
  // Add a property for the checkbox state
  isSelected: boolean;
}

export const maintenanceData: MaintenanceData[] = [
  {
    facility: "AHNi Compliance Office",
    state: "Jabi, Abuja",
    address: "No. 23, Celina Ayom Crescent",
    maintenanceType: "Screeding/Painting",
    isSelected: false,
  },
  {
    facility: "AHNi Compliance Office",
    state: "Jabi, Abuja",
    address: "No. 23, Celina Ayom Crescent",
    maintenanceType: "Screeding/Painting",
    isSelected: false,
  },
  {
    facility: "AHNi Compliance Office",
    state: "Jabi, Abuja",
    address: "No. 23, Celina Ayom Crescent",
    maintenanceType: "Screeding/Painting",
    isSelected: false,
  },
  {
    facility: "AHNi Compliance Office",
    state: "Jabi, Abuja",
    address: "No. 23, Celina Ayom Crescent",
    maintenanceType: "Screeding/Painting",
    isSelected: false,
  },
  {
    facility: "AHNi Compliance Office",
    state: "Jabi, Abuja",
    address: "No. 23, Celina Ayom Crescent",
    maintenanceType: "Screeding/Painting",
    isSelected: false,
  },
  {
    facility: "AHNi Compliance Office",
    state: "Jabi, Abuja",
    address: "No. 23, Celina Ayom Crescent",
    maintenanceType: "Screeding/Painting",
    isSelected: false,
  },
  {
    facility: "AHNi Compliance Office",
    state: "Jabi, Abuja",
    address: "No. 23, Celina Ayom Crescent",
    maintenanceType: "Screeding/Painting",
    isSelected: false,
  },
  {
    facility: "AHNi Compliance Office",
    state: "Jabi, Abuja",
    address: "No. 23, Celina Ayom Crescent",
    maintenanceType: "Screeding/Painting",
    isSelected: false,
  },
  {
    facility: "AHNi Compliance Office",
    state: "Jabi, Abuja",
    address: "No. 23, Celina Ayom Crescent",
    maintenanceType: "Screeding/Painting",
    isSelected: false,
  },
  {
    facility: "AHNi Compliance Office",
    state: "Jabi, Abuja",
    address: "No. 23, Celina Ayom Crescent",
    maintenanceType: "Screeding/Painting",
    isSelected: false,
  },
  {
    facility: "AHNi Compliance Office",
    state: "Jabi, Abuja",
    address: "No. 23, Celina Ayom Crescent",
    maintenanceType: "Screeding/Painting",
    isSelected: false,
  },
  {
    facility: "AHNi Compliance Office",
    state: "Jabi, Abuja",
    address: "No. 23, Celina Ayom Crescent",
    maintenanceType: "Screeding/Painting",
    isSelected: false,
  },
  {
    facility: "AHNi Compliance Office",
    state: "Jabi, Abuja",
    address: "No. 23, Celina Ayom Crescent",
    maintenanceType: "Screeding/Painting",
    isSelected: false,
  },
  {
    facility: "AHNi Compliance Office",
    state: "Jabi, Abuja",
    address: "No. 23, Celina Ayom Crescent",
    maintenanceType: "Screeding/Painting",
    isSelected: false,
  },
  {
    facility: "AHNi Compliance Office",
    state: "Jabi, Abuja",
    address: "No. 23, Celina Ayom Crescent",
    maintenanceType: "Screeding/Painting",
    isSelected: false,
  },
];

export const maintenanceColumns: ColumnDef<MaintenanceData>[] = [
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
    header: "Facility",
    accessorKey: "facility",
  },
  {
    header: "State",
    accessorKey: "state",
  },
  {
    header: "Address",
    accessorKey: "address",
  },
  {
    header: "Maintenance Type",
    accessorKey: "maintenanceType",
  },
  {
    header: "",
    accessorKey: "action",
    cell: () => {
      return <ChevronDown />;
    },
  },
];
