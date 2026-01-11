"use client";

import { ColumnDef } from "@tanstack/react-table";
import DeleteIcon from "@/components/icons/DeleteIcon";
import PencilIcon from "@/components/icons/PencilIcon";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IActivityHeadingPaginatedData } from "@/features/contracts-grants/types/activity-heading";
import { useState } from "react";
import { useDeleteActivityHeading } from "@/features/contracts-grants/controllers/activityHeadingController";
import { toast } from "sonner";

interface TableMenuProps extends IActivityHeadingPaginatedData {
  onEdit: (id: string) => void;
}

export const activityHeadingColumns = (onEdit: (id: string) => void): ColumnDef<IActivityHeadingPaginatedData>[] => [
  {
    header: "Heading Name",
    id: "name",
    accessorKey: "name",
    size: 300,
    cell: ({ row }) => {
      return <span className="font-medium">{row.original.name}</span>;
    },
  },
  {
    header: "Description",
    id: "description",
    accessorKey: "description",
    size: 400,
    cell: ({ row }) => {
      return <span className="text-gray-600">{row.original.description || '-'}</span>;
    },
  },
  {
    header: "Created Date",
    id: "created_datetime",
    accessorKey: "created_datetime",
    size: 150,
    cell: ({ row }) => {
      return (
        <span>
          {new Date(row.original.created_datetime).toLocaleDateString()}
        </span>
      );
    },
  },
  {
    header: "Action",
    id: "actions",
    size: 50,
    cell: ({ row }) => <TableMenu {...row.original} onEdit={onEdit} />,
  },
];

const TableMenu = ({ id, onEdit }: TableMenuProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { deleteActivityHeading, isLoading: isDeleteLoading } =
    useDeleteActivityHeading(id);

  const handleDelete = async () => {
    try {
      await deleteActivityHeading();
      toast.success("Activity Heading Deleted Successfully");
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message ?? "Failed to delete activity heading");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex gap-2 py-6">
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <Button
            className="w-full flex items-center justify-start gap-2"
            variant="ghost"
            onClick={() => onEdit(id)}
          >
            <PencilIcon />
            Edit
          </Button>
          <Button
            className="w-full flex items-center justify-start gap-2"
            variant="ghost"
            onClick={() => setIsDialogOpen(true)}
          >
            <DeleteIcon />
            Delete
          </Button>
        </PopoverContent>
      </Popover>

      <ConfirmationDialog
        open={isDialogOpen}
        title="Are you sure you want to delete this activity heading?"
        loading={isDeleteLoading}
        onCancel={() => setIsDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};
