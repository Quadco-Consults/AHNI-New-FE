import { ColumnDef } from "@tanstack/react-table";
import DeleteIcon from "components/icons/DeleteIcon";
import EditIcon from "components/icons/EditIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { AdminRoutes } from "constants/RouterConstants";
import { TAssetPaginatedData } from "definations/admin/inventory-management/asset";
import { useState } from "react";
import Link from "next/link";
import { useDeleteAsset } from "@/features/admin/controllers/assetController";
import { toast } from "sonner";
import { DeleteItemManager } from "@/features/modules/controllers";

export const assetColumn: ColumnDef<TAssetPaginatedData>[] = [
  {
    header: "Asset Name",
    id: "name",
    accessorKey: "name",
  },

  {
    header: "Asset Type",
    id: "asset_type",
    accessorKey: "asset_type",
    accessorFn: ({ asset_type }) => `${asset_type?.name}`,
  },

  {
    header: "Classification",
    id: "classification",
    accessorKey: "classification.name",
    size: 200,
  },

  {
    header: "Asset Code",
    id: "asset_code",
    accessorKey: "asset_code",
  },

  //   {
  //     header: "Model Number",
  //     id: "model_number",
  //     accessorKey: `asset_type.model`,
  //   },

  {
    header: "Serial Number",
    id: "serial_number",
    accessorKey: "category.serial_number",
  },

  {
    header: "Plate Number",
    id: "plate_number",
    accessorKey: "plate_number",
    accessorFn: ({ plate_number }) => `${plate_number || "Not Applicable"}`,
  },

  {
    header: "Chasis Number",
    id: "chasis_number",
    accessorFn: ({ chasis_number }) => `${chasis_number || "Not Applicable"}`,
  },

  {
    header: "Project",
    id: "project",
    accessorKey: "project.title",
  },

  {
    header: "Donor",
    id: "donor",
    accessorKey: "donor.name",
  },

  {
    header: "Assignee",
    id: "assignee",
    accessorKey: "assignee.full_name",
  },

  {
    header: "Asset Condition",
    id: "asset_condition",
    accessorKey: "asset_condition.name",
  },

  {
    header: "Location",
    id: "location",
    accessorKey: "location.name",
  },

  {
    header: "",
    id: "action",
    cell: ({ row }) => <TableAction {...row.original} />,
  },
];

const TableAction = ({ id }: TAssetPaginatedData) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { deleteItem, isLoading } = DeleteItemManager();

  const handleDeleteAsset = async () => {
    try {
      deleteItem(id);
      toast.success("Asset Deleted");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something wrong");
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='flex gap-2 py-6'>
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className=' w-fit'>
          <div className='flex flex-col items-start justify-between gap-1'>
            <Link
              href={{
                pathname: AdminRoutes.VIEW_ASSETS,
                search: `?id=${id}`,
              }}
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <EyeIcon />
                View
              </Button>
            </Link>
            <Link
              href={{
                pathname: AdminRoutes.CREATE_ASSETS,
                search: `?id=${id}`,
              }}
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <EditIcon />
                Edit
              </Button>
            </Link>
            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
              onClick={() => setDialogOpen(true)}
            >
              <DeleteIcon />
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this asset?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDeleteAsset}
      />
    </div>
  );
};
