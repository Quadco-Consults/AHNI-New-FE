/* eslint-disable react-refresh/only-export-components */
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import TableAction from "atoms/TableAction";
import DeleteIcon from "components/icons/DeleteIcon";
import EditIcon from "components/icons/EditIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { AdminRoutes } from "constants/RouterConstants";
import { useAppDispatch, useAppSelector } from "hooks/useStore";

import { Link } from "react-router-dom";
import {
  DisposalReport,
  useDeleteAssetsRequestMutation,
} from "services/adminApi/assetsApi";
import { toast } from "sonner";
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
    header: "Donor",
    accessorKey: "donor",
  },
  {
    header: "Project",
    accessorKey: "project",
  },
  {
    header: "Assignee",
    accessorKey: "assignee",
  },
  {
    header: "Serial Number",
    accessorKey: "serial",
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
    id: "view",
    cell: ({ row }) => <ActionList data={row} />,
  },
];
const ActionList = ({ data }: any) => {
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex gap-2 py-6">
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" w-fit">
          <div className="flex flex-col items-start justify-between gap-1">
            <Link to={`${AdminRoutes.ViewAssets}?id=${data?.original?.id}`}>
              <Button
                className="w-full flex items-center justify-start gap-2"
                variant="ghost"
              >
                <EyeIcon />
                View
              </Button>
            </Link>
            <Button
              className="w-full flex items-center justify-start gap-2"
              variant="ghost"
            >
              <EditIcon />
              Edit
            </Button>
            <Button
              className="w-full flex items-center justify-start gap-2"
              variant="ghost"
            >
              <DeleteIcon />
              delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const RequestActions = ({ row }: { row: Row<DisposalReport> }) => {
  const [deleteAssetRequest] = useDeleteAssetsRequestMutation();

  const deleteAssest = () => {
    try {
      deleteAssetRequest({
        id: row.original.id,
      }).unwrap();
      toast.success("Asset request deleted successfully");
    } catch (error) {
      toast.error("Error deleting asset request");
    }
  };
  return (
    <TableAction
      route={AdminRoutes.ASSETS_REQUEST_VIEW}
      row={row.original}
      action={() => deleteAssest()}
    />
  );
};

export const assestRequestColum: ColumnDef<DisposalReport>[] = [
  {
    header: "Remark",
    accessorKey: "remark",
  },

  {
    header: "Recomendation",
    accessorKey: "recommendation",
  },

  {
    header: "Asset Condition",
    accessorKey: "asset_condition",
  },
  {
    header: "Justification for Recomendation",
    accessorKey: "justification_for_disposal",
    size: 250,
  },
  {
    header: "Life Span as at Report",
    accessorKey: "life_span_at_report",
    size: 250,
  },
  {
    header: "",
    accessorKey: "action",
    size: 80,
    cell: ({ row }) => {
      return <RequestActions row={row} />;
    },
  },
];
