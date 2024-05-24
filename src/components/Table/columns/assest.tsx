import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "components/ui/checkbox";

interface Data {
  organization: string;
  asset: string;
  assetCode: string;
  assetCondition: string;
  manufacture: string;
  model: string;
  // Add a property for the checkbox state
  isSelected: boolean;
}

export const assetsData: Data[] = [
  {
    organization: "FHI 360",
    asset: "Phone",
    assetCode: "AHHQICTB3451",
    assetCondition: "F3",
    manufacture: "Mitel",
    model: "5312",
    isSelected: false,
  },
  {
    organization: "FHI 360",
    asset: "Workstation",
    assetCode: "AHHQFFB1933",
    assetCondition: "F3",
    manufacture: "N/A",
    model: "4 Seater",
    isSelected: false,
  },
  {
    organization: "FHI 360",
    asset: "Chair",
    assetCode: "AHHQFFB1893",
    assetCondition: "F3",
    manufacture: "N/A",
    model: "Ordinary Swivel",
    isSelected: false,
  },
  {
    organization: "FHI 360",
    asset: "Chair",
    assetCode: "AHHQFFB6746",
    assetCondition: "F3",
    manufacture: "Royal Point",
    model: "Executive Swivel",
    isSelected: false,
  },
  {
    organization: "FHI 360",
    asset: "Laptop",
    assetCode: "AHHQICTB2239",
    assetCondition: "F3",
    manufacture: "Dell",
    model: "Dell Latitude E5480",
    isSelected: false,
  },
  {
    organization: "FHI 360",
    asset: "Laptop",
    assetCode: "AHHQICTB5907",
    assetCondition: "F3",
    manufacture: "Dell",
    model: "Dell Latitude E5480",
    isSelected: false,
  },
  {
    organization: "FHI 360",
    asset: "Chair",
    assetCode: "AHHQFFB0144",
    assetCondition: "F3",
    manufacture: "N/A",
    model: "Visitors",
    isSelected: false,
  },
  {
    organization: "FHI 360",
    asset: "Table",
    assetCode: "AHHQFFB0180",
    assetCondition: "F3",
    manufacture: "N/A",
    model: "N/A",
    isSelected: false,
  },
  {
    organization: "FHI 360",
    asset: "Laptop",
    assetCode: "AHHQICTB2267",
    assetCondition: "F3",
    manufacture: "Dell",
    model: "Latitude E5480",
    isSelected: false,
  },
  {
    organization: "FHI 360",
    asset: "Printer",
    assetCode: "AHHQICTB2136",
    assetCondition: "F3",
    manufacture: "HP",
    model: "Laserjet Pro M402dw",
    isSelected: false,
  },
  {
    organization: "FHI 360",
    asset: "Phone",
    assetCode: "AHHQICTB3466",
    assetCondition: "F3",
    manufacture: "N/A",
    model: "5312",
    isSelected: false,
  },
  {
    organization: "FHI 360",
    asset: "UPS",
    assetCode: "AHHQICTB6740",
    assetCondition: "F3",
    manufacture: "APC",
    model: "BG1530 Elite Pro",
    isSelected: false,
  },
];

export const assestColum: ColumnDef<Data>[] = [
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
    header: "Organization",
    accessorKey: "organization",
  },
  {
    header: "Asset",
    accessorKey: "asset",
  },
  {
    header: "Asset Code",
    accessorKey: "assetCode",
  },
  {
    header: "Asset Condition",
    accessorKey: "assetCondition",
  },
  {
    header: "Manufacture",
    accessorKey: "manufacture",
  },
  {
    header: "Model",
    accessorKey: "model",
  },
];
