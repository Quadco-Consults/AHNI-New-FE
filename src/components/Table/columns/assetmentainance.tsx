import { ColumnDef } from "@tanstack/react-table";
import TableAction from "atoms/TableAction";
import { AdminRoutes } from "constants/RouterConstants";
import {
  AssetMaintenanceRequest,
  useDeleteAssetMaintenanceRequestMutation,
} from "services/adminApi/assetMaintenance";
import { toast } from "sonner";

// eslint-disable-next-line react-refresh/only-export-components
const Action = ({ row }: { row: AssetMaintenanceRequest }) => {
  const [deleteAssetMentainance] = useDeleteAssetMaintenanceRequestMutation();

  const onDelete = async () => {
    try {
      await deleteAssetMentainance({ id: row.id }).unwrap();
      toast.success("Asset Maintenance Deleted");
    } catch (error) {
      toast.error("Failed to delete asset maintenance");
    }
  };

  return (
    <TableAction
      row={row}
      route={AdminRoutes.ASSET_MAINTENANCE_VIEW}
      action={onDelete}
    />
  );
};

export const assestMaintenanceColum: ColumnDef<AssetMaintenanceRequest>[] = [
  {
    header: "Asset",
    accessorKey: "asset",
  },

  {
    header: "Classification",
    accessorKey: "classification",
  },

  {
    header: "Maintenance Type",
    accessorKey: "maintenance_type",
  },
  {
    header: "Problem",
    accessorKey: "description_of_problem",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Date Created",
    accessorKey: "created_at",
  },

  {
    header: "Actiion",
    accessorKey: "action",
    cell: ({ row }) => {
      return <Action row={row.original} />;
    },
  },
];
