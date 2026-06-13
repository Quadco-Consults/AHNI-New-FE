"use client";

import React, { useState } from "react";
import DataTable from "@/components/Table/DataTable";
import { formatNumberCurrency } from "@/utils/utls";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import PencilIcon from "@/components/icons/PencilIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { toast } from "sonner";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import { useAppDispatch } from "@/hooks/useStore";
import { useGetAllSubGrantModifications, useDeleteSubGrantModification } from "@/features/contracts-grants/controllers/subGrantModificationController";
import { ISubGrantSingleData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useParams } from "next/navigation";

interface ModificationData {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  modification_number: string;
  modification_type: string;
  reason: string;
  amount_usd: string;
  amount_ngn: string;
  effective_date: string;
  approval_date: string;
  notes: string;
  created_by: string;
  updated_by: string;
  sub_grant: string;
  approved_by: string;
}

const modificationColumns: ColumnDef<ModificationData>[] = [
  {
    header: "Modification No",
    accessorKey: "modification_number",
    size: 150,
  },
  {
    header: "Type",
    accessorKey: "modification_type",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      // Format the type to be more readable
      return value?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "N/A";
    },
    size: 180,
  },
  {
    header: "Amount (USD)",
    accessorKey: "amount_usd",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return formatNumberCurrency(value || "0", "USD");
    },
    size: 150,
  },
  {
    header: "Amount (NGN)",
    accessorKey: "amount_ngn",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return formatNumberCurrency(value || "0", "NGN");
    },
    size: 150,
  },
  {
    header: "Reason",
    accessorKey: "reason",
    size: 250,
  },
  {
    header: "Effective Date",
    accessorKey: "effective_date",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return value ? new Date(value).toLocaleDateString("en-US") : "N/A";
    },
    size: 120,
  },
  {
    header: "Approval Date",
    accessorKey: "approval_date",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return value ? new Date(value).toLocaleDateString("en-US") : "N/A";
    },
    size: 120,
  },
  {
    header: "Created",
    accessorKey: "created_datetime",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return new Date(value).toLocaleDateString("en-US");
    },
    size: 120,
  },
  {
    header: "",
    id: "action",
    cell: ({ row }) => <ModificationTableMenu {...row.original} />,
    size: 80,
  },
];

// TableMenu Component for Modification Actions
const ModificationTableMenu = (data: ModificationData) => {
  const { id, sub_grant } = data;
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const dispatch = useAppDispatch();

  // Get subGrantId from the data
  const subGrantId = sub_grant;

  // Use the delete hook
  const { deleteModification, isLoading } = useDeleteSubGrantModification(
    subGrantId || "",
    id || ""
  );

  const handleEdit = () => {
    dispatch(
      openDialog({
        type: DialogType.MODIFY_GRANT,
        dialogProps: {
          header: "Edit Modification",
          data: data,
        },
      })
    );
  };

  const handleDelete = async () => {
    try {
      await deleteModification();
      toast.success("Modification deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete modification");
    }
  };

  // Don't render anything if there's no valid id
  if (!id) {
    return null;
  }

  return (
    <div className='flex items-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='flex gap-2 py-6'>
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-fit'>
          <div className='flex flex-col items-start justify-between gap-1'>
            <Button
              onClick={handleEdit}
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
            >
              <PencilIcon />
              Edit
            </Button>

            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
              onClick={() => setDeleteDialogOpen(true)}
            >
              <DeleteIcon />
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        title='Are you sure you want to delete this modification?'
        loading={isLoading}
        onCancel={() => setDeleteDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};

interface SubGrantModificationHistoryProps {
  subGrantId: string;
}

const SubGrantModificationHistory: React.FC<SubGrantModificationHistoryProps> = ({ subGrantId }) => {
  const [page, setPage] = useState(1);

  const { data, isFetching, error } = useGetAllSubGrantModifications({
    subGrantId: subGrantId || "",
    page,
    size: 10,
    enabled: !!subGrantId
  });

  return (
    <section className="w-full flex flex-col space-y-[1.25rem]">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sub-Grant Modifications</h3>
      </div>

      <div className="w-full bg-white border rounded-lg p-2">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error loading modification data:</p>
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
          </div>
        )}
        {!subGrantId && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium">No Sub-Grant ID found</p>
            <p className="text-yellow-600 text-sm mt-1">Unable to load modification data without a valid sub-grant ID</p>
          </div>
        )}

        <DataTable
          columns={modificationColumns}
          data={data?.data?.results || []}
          isLoading={isFetching}
          pagination={{
            total: data?.data?.pagination?.count ?? 0,
            pageSize: data?.data?.pagination?.page_size ?? 10,
            onChange: (page: number) => setPage(page),
          }}
        />
      </div>
    </section>
  );
};

export default SubGrantModificationHistory;
