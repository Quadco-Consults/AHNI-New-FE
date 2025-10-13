import { ColumnDef } from "@tanstack/react-table";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import EyeIcon from "components/icons/EyeIcon";
import PencilIcon from "components/icons/PencilIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import { useDeleteFacilitatorApplicant } from "@/features/contracts-grants/controllers/facilitatorApplicantsController";

export const facilitatorDatabaseColumns: ColumnDef<any>[] = [
  {
    header: "Name",
    id: "name",
    accessorKey: "name",
    size: 200,
    cell: ({ row }) => {
      const name = row.original.name;
      if (name) return name;

      // Fallback to first_name + last_name
      const firstName = row.original.first_name || '';
      const lastName = row.original.last_name || '';
      return `${firstName} ${lastName}`.trim() || '-';
    }
  },

  {
    header: "Email",
    id: "email",
    accessorKey: "email",
    size: 200,
  },

  {
    header: "Phone Number",
    id: "phone_number",
    accessorKey: "phone_number",
    size: 150,
  },

  {
    header: "Qualifications",
    id: "qualifications",
    accessorKey: "qualifications",
    size: 250,
  },

  {
    header: "Experience",
    id: "experience",
    accessorKey: "experience",
    size: 200,
  },

  {
    header: "Status",
    id: "status",
    accessorKey: "status",
    size: 120,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
          {status || 'APPROVED'}
        </span>
      );
    },
  },

  {
    header: "Actions",
    id: "actions",
    size: 200,
    cell: ({ row }) => <TableMenu {...row.original} />,
  },
];

const TableMenu = (facilitator: any) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { deleteFacilitatorApplicant, isLoading } = useDeleteFacilitatorApplicant(facilitator.id);

  const handleDelete = async () => {
    try {
      await deleteFacilitatorApplicant();
      toast.success("Facilitator deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete facilitator");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* View Button */}
        <Link href={`/dashboard/c-and-g/facilitator-database/${facilitator.id}/view`}>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <EyeIcon className="w-4 h-4" />
            View
          </Button>
        </Link>

        {/* Edit Button */}
        <Link href={`/dashboard/c-and-g/facilitator-database/${facilitator.id}/edit`}>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <PencilIcon className="w-4 h-4" />
            Edit
          </Button>
        </Link>

        {/* Delete Button */}
        <Button
          variant="destructive"
          size="sm"
          className="gap-2"
          onClick={() => setDeleteDialogOpen(true)}
          disabled={isLoading}
        >
          <DeleteIcon className="w-4 h-4" />
          Delete
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Facilitator"
        description={`Are you sure you want to delete ${facilitator.name || 'this facilitator'}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isLoading}
      />
    </>
  );
};
