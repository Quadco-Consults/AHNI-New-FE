"use client";

import React, { useState } from "react";
import DataTable from "components/Table/DataTable";
import { useParams } from "next/navigation";
import { formatNumberCurrency } from "utils/utls";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import PencilIcon from "components/icons/PencilIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import { toast } from "sonner";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";

interface ModificationData {
  id: string;
  title: string;
  amount: string;
  description: string;
  date: string;
  created_datetime: string;
}

const modificationColumns: ColumnDef<ModificationData>[] = [
  {
    header: "Title",
    accessorKey: "title",
    size: 200,
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return formatNumberCurrency(value || "0", "USD");
    },
    size: 150,
  },
  {
    header: "Description",
    accessorKey: "description",
    size: 300,
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return new Date(value).toLocaleDateString("en-US");
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
  const { id } = data;
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const dispatch = useAppDispatch();

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
      // TODO: Implement actual delete API call
      // await deleteModification(id);
      toast.success("Modification deleted successfully");
      setDeleteDialogOpen(false);
      // You might want to refresh the data here
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
        loading={false}
        onCancel={() => setDeleteDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};

const ModificationHistory: React.FC = () => {
  const [page, setPage] = useState(1);

  const params = useParams();
  const grantId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;

  // For now, let's use mock data since we need to create the controller
  // const { data, isFetching, error } = useGetAllModifications({
  //   grantId: grantId || "",
  //   page,
  //   size: 10,
  //   enabled: !!grantId
  // });

  // Mock data for now
  const mockData = {
    data: {
      results: [
        {
          id: "1",
          title: "Budget Increase",
          amount: "50000",
          description: "Additional funding for equipment procurement",
          date: "2024-01-15",
          created_datetime: "2024-01-15T10:30:00Z"
        },
        {
          id: "2", 
          title: "Timeline Extension",
          amount: "0",
          description: "Project timeline extended by 6 months",
          date: "2024-02-20",
          created_datetime: "2024-02-20T14:15:00Z"
        }
      ],
      paginator: {
        count: 2,
        page_size: 10,
        page: 1,
        total_pages: 1
      }
    }
  };

  return (
    <section className="w-full flex flex-col space-y-[1.25rem]">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Grant Modifications</h3>
      </div>

      <div className="w-full bg-white border rounded-lg p-2">
        {!grantId && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium">No Grant ID found</p>
            <p className="text-yellow-600 text-sm mt-1">Unable to load modification data without a valid grant ID</p>
          </div>
        )}
        
        <DataTable
          columns={modificationColumns}
          data={mockData?.data?.results || []}
          isLoading={false}
          pagination={{
            total: mockData?.data?.paginator?.count ?? 0,
            pageSize: mockData?.data?.paginator?.page_size ?? 10,
            onChange: (page: number) => setPage(page),
          }}
        />
      </div>
    </section>
  );
};

export default ModificationHistory;