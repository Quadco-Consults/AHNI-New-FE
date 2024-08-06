/* eslint-disable react-refresh/only-export-components */
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { AdminRoutes } from "constants/RouterConstants";
import { useAppDispatch, useAppSelector } from "hooks/useStore";

import { Link } from "react-router-dom";
import { addAsset, assetSelector, removeAsset } from "store/assets";

interface AssetData {
  id: string;
  created_at: string;
  updated_at: string;
  asset_code: string;
  serial_number: string | null;
  assignee: string;
  date_of_acquisition: string;
  state: string;
  estimated_life_span: string;
  classification: string;
  cost_in_usd: string;
  cost_in_ngn: string;
  unit: string;
  implementer: string;
  asset_type: string;
  asset_condition: string;
  location: string;
}

const CheckBoxRow = ({ row }: { row: Row<AssetData> }) => {
  const dispatch = useAppDispatch();
  const selectedAssets = useAppSelector(assetSelector);

  const isSelected = selectedAssets.includes(row.original.id);
  const toggleSelected = (checked: boolean) => {
    row.toggleSelected(checked);
    if (checked) {
      dispatch(addAsset(row.original.id));
    } else {
      dispatch(removeAsset(row.original.id));
    }
  };

  return <Checkbox checked={isSelected} onCheckedChange={toggleSelected} />;
};

const CheckBoxHeader = ({ table }: { table: Table<AssetData> }) => {
  const dispatch = useAppDispatch();

  const allSelected = table.getIsAllRowsSelected();
  const toggleAll = (checked: boolean) => {
    table.toggleAllRowsSelected(checked);
    if (checked) {
      table.getRowModel().rows.forEach((row) => {
        dispatch(addAsset(row.original.id));
      });
    } else {
      table.getRowModel().rows.forEach((row) => {
        dispatch(removeAsset(row.original.id));
      });
    }
  };

  return <Checkbox checked={allSelected} onCheckedChange={toggleAll} />;
};

export const assestColum: ColumnDef<AssetData>[] = [
  {
    id: "select",
    header: ({ table }) => <CheckBoxHeader table={table} />,
    cell: ({ row }) => <CheckBoxRow row={row} />,
  },
  {
    header: "Asset Code",
    accessorKey: "asset_code",
  },

  {
    header: "Classification",
    accessorKey: "classification",
  },

  {
    header: "Unit",
    accessorKey: "unit",
  },
  {
    header: "Organization",
    accessorKey: "implementer",
  },
  {
    header: "Asset",
    accessorKey: "asset_type",
  },
  {
    header: "Asset Condition",
    accessorKey: "asset_condition",
  },
  {
    header: "Location",
    accessorKey: "location",
  },
  {
    header: "",
    accessorKey: "view",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex gap-x-2">
          <Link to={`${AdminRoutes.ViewAssets}?id=${data.id}`}>
            <Button className="" variant="link">
              View
            </Button>
          </Link>
        </div>
      );
    },
  },
];
