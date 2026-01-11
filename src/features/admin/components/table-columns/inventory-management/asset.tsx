import { ColumnDef } from "@tanstack/react-table";
import DeleteIcon from "@/components/icons/DeleteIcon";
import EditIcon from "@/components/icons/EditIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AdminRoutes } from "@/constants/RouterConstants";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { DeleteItemManager } from "@/features/modules/controllers";
import { ItemData } from "@/features/modules/types/config";

export const assetColumn: ColumnDef<ItemData>[] = [
  {
    header: "Asset Name",
    id: "name",
    accessorKey: "name",
  },

  {
    header: "Asset Type",
    id: "asset_type",
    accessorFn: ({ asset_type }) => {
      if (!asset_type) return "N/A";
      if (typeof asset_type === "string") return asset_type;
      return asset_type.name || "N/A";
    },
  },

  {
    header: "Classification",
    id: "classification",
    accessorFn: ({ classification }) => {
      if (!classification) return "N/A";
      if (typeof classification === "string") return classification;
      return classification.name || "N/A";
    },
    size: 200,
  },

  {
    header: "Asset Code",
    id: "asset_code",
    accessorFn: ({ asset_code }) => asset_code || "N/A",
  },

  //   {
  //     header: "Model Number",
  //     id: "model_number",
  //     accessorKey: `asset_type.model`,
  //   },

  {
    header: "Serial Number",
    id: "serial_number",
    accessorFn: ({ serial_number }) => serial_number || "N/A",
  },

  {
    header: "Plate Number",
    id: "plate_number",
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
    accessorFn: ({ project }) => {
      if (!project) return "N/A";
      if (typeof project === "string") return project;
      return project.title || project.name || "N/A";
    },
  },

  {
    header: "Donor",
    id: "donor",
    accessorFn: ({ donor }) => {
      if (!donor) return "N/A";
      if (typeof donor === "string") return donor;
      return donor.name || "N/A";
    },
  },

  {
    header: "Assignee",
    id: "assignee",
    accessorFn: ({ assignee }) => {
      if (!assignee) return "N/A";
      if (typeof assignee === "string") return assignee;
      return assignee.full_name || `${assignee.first_name || ""} ${assignee.last_name || ""}`.trim() || "N/A";
    },
  },

  {
    header: "Asset Condition",
    id: "asset_condition",
    accessorFn: ({ asset_condition }) => {
      if (!asset_condition) return "N/A";
      if (typeof asset_condition === "string") return asset_condition;
      return asset_condition.name || "N/A";
    },
  },

  {
    header: "Location",
    id: "location",
    accessorFn: ({ location }) => {
      if (!location) return "N/A";
      if (typeof location === "string") return location;
      return location.name || "N/A";
    },
  },

  {
    header: "",
    id: "action",
    cell: ({ row }) => <TableAction {...row.original} />,
  },
];

const TableAction = ({ id }: ItemData) => {
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
