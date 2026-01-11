"use client";

import React, { useState } from "react";
import DataTable from "@/components/Table/DataTable";
import { useParams } from "next/navigation";
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
import { DialogType } from "@/constants/dailogs";
import { useAppDispatch } from "@/hooks/useStore";
import {
  useGetAllSubGrantDisbursements,
  useDeleteSubGrantDisbursement
} from "@/features/contracts-grants/controllers/disbursementController";

interface DisbursementData {
  id: string;
  amount: string;
  disbursement_date: string;
  description: string;
  reference_number?: string;
  created_datetime: string;
  project: string;
}

const getDisbursementColumns = (subGrantId: string): ColumnDef<DisbursementData>[] => [
  {
    header: "Date",
    accessorKey: "disbursement_date",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return new Date(value).toLocaleDateString("en-US");
    },
    size: 120,
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ row }) => (
      <div className="max-w-xs">
        <p className="font-medium">{row.original.description}</p>
        {row.original.reference_number && (
          <p className="text-sm text-gray-500">Ref: {row.original.reference_number}</p>
        )}
      </div>
    ),
    size: 300,
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <span className="font-semibold text-green-600">
          {formatNumberCurrency(value || "0", "USD")}
        </span>
      );
    },
    size: 150,
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
    cell: ({ row }) => <DisbursementTableMenu {...row.original} subGrantId={subGrantId} />,
    size: 80,
  },
];

// TableMenu Component for Disbursement Actions
const DisbursementTableMenu = (data: DisbursementData & { subGrantId: string }) => {
  const { id, subGrantId } = data;
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const dispatch = useAppDispatch();

  const { deleteSubGrantDisbursement, isLoading: isDeleting } = useDeleteSubGrantDisbursement(subGrantId, id);

  const handleEdit = () => {
    dispatch(
      openDialog({
        type: DialogType.ADD_DISBURSEMENT_MODAL,
        dialogProps: {
          header: "Edit Disbursement",
          width: "max-w-lg",
          subGrantId: subGrantId,
          isSubGrant: true,
          disbursement: data,
        },
      })
    );
  };

  const handleDelete = async () => {
    try {
      await deleteSubGrantDisbursement();
      toast.success("Disbursement deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete disbursement");
    }
  };

  // Don't render anything if there's no valid id
  if (!id) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex gap-2 py-6">
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="flex flex-col items-start justify-between gap-1">
            <Button
              onClick={handleEdit}
              className="w-full flex items-center justify-start gap-2"
              variant="ghost"
            >
              <PencilIcon />
              Edit
            </Button>

            <Button
              className="w-full flex items-center justify-start gap-2"
              variant="ghost"
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
        title="Are you sure you want to delete this disbursement?"
        loading={isDeleting}
        onCancel={() => setDeleteDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};

interface SubGrantDisbursementHistoryProps {
  subGrantId: string;
}

const SubGrantDisbursementHistory: React.FC<SubGrantDisbursementHistoryProps> = ({ subGrantId }) => {
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();

  const { data, isFetching, error } = useGetAllSubGrantDisbursements({
    subGrantId: subGrantId,
    page,
    size: 10,
    enabled: !!subGrantId
  });

  return (
    <section className="w-full flex flex-col space-y-[1.25rem]">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Disbursement History</h3>
        <Button
          onClick={() => {
            dispatch(
              openDialog({
                type: DialogType.ADD_DISBURSEMENT_MODAL,
                dialogProps: {
                  header: "Add Disbursement",
                  width: "max-w-lg",
                  subGrantId: subGrantId,
                  isSubGrant: true,
                },
              })
            );
          }}
          className="flex gap-2 py-2"
        >
          Add Disbursement
        </Button>
      </div>

      <div className="w-full bg-white border rounded-lg p-2">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error loading disbursement data:</p>
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
          </div>
        )}
        {!subGrantId && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium">No Sub-Grant ID found</p>
            <p className="text-yellow-600 text-sm mt-1">Unable to load disbursement data without a valid sub-grant ID</p>
          </div>
        )}

        <DataTable
          columns={getDisbursementColumns(subGrantId)}
          data={data?.data?.results || []}
          isLoading={isFetching}
          pagination={{
            total: data?.data?.paginator?.count ?? 0,
            pageSize: data?.data?.paginator?.page_size ?? 10,
            onChange: (page: number) => setPage(page),
          }}
        />
      </div>
    </section>
  );
};

export default SubGrantDisbursementHistory;