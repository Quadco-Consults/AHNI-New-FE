"use client";

import { ColumnDef } from "@tanstack/react-table";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import DownIcon from "@/components/icons/DownIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import FilterIcon from "@/components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HrRoutes } from "@/constants/RouterConstants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { useGetSeparationManagement, useDeleteSeparationManagement } from "@/features/hr/controllers/separationManagementController";
import { SeparationManagement as SeparationManagementType } from "@/features/hr/types/separation-management";
import useDebounce from "@/utils/useDebounce";

const SeparationManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: separationData, isLoading, refetch } = useGetSeparationManagement({
    search: debouncedSearch,
    status: selectedStatus,
    page: 1,
    size: 20,
  });

  const { deleteSeparationManagement } = useDeleteSeparationManagement(itemToDelete || "");

  const handleDelete = (id: string) => {
    setItemToDelete(id);
  };

  // Handle delete effect
  React.useEffect(() => {
    if (itemToDelete && deleteSeparationManagement) {
      const performDelete = async () => {
        try {
          await deleteSeparationManagement();
          toast.success("Separation record deleted successfully");
          refetch();
        } catch (error) {
          toast.error("Failed to delete separation record");
        } finally {
          setItemToDelete(null);
        }
      };
      performDelete();
    }
  }, [itemToDelete, deleteSeparationManagement, refetch]);

  const columns: ColumnDef<SeparationManagementType>[] = [
    {
      id: "select",
      size: 80,
      header: ({ table }) => {
        return (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
            }}
          />
        );
      },
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
            }}
          />
        );
      },
    },
    {
      header: "Name",
      accessorKey: "employee",
      size: 250,
      cell: ({ row }) => (
        <p>{row.original.employee?.legal_firstname} {row.original.employee?.legal_lastname}</p>
      ),
    },
    {
      header: "Position",
      accessorKey: "employee.position",
      size: 250,
      cell: ({ row }) => <p>{row.original.employee?.position?.name || "N/A"}</p>,
    },
    {
      header: "Method",
      accessorKey: "exit_method",
      cell: ({ row }) => <p>{row.original.exit_method}</p>,
    },
    {
      header: "Location",
      accessorKey: "employee.location",
      cell: ({ row }) => <p>{row.original.employee?.location?.name || "N/A"}</p>,
    },
    {
      header: "Project",
      accessorKey: "project",
      cell: ({ row }) => <p>{row.original.project?.title || row.original.project?.project_name || "N/A"}</p>,
    },
    {
      header: "Grade",
      accessorKey: "employee.grade",
      cell: ({ row }) => <p>{row.original.employee?.grade || "N/A"}</p>,
    },
    {
      header: "Submit Date",
      accessorKey: "submit_date",
      cell: ({ row }) => <p>{new Date(row.original.submit_date).toLocaleDateString()}</p>,
    },
    {
      header: "Exit Date",
      accessorKey: "exit_date",
      cell: ({ row }) => <p>{new Date(row.original.exit_date).toLocaleDateString()}</p>,
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 100,
      cell: ({ getValue }) => {
        return (
          <Badge
            variant='default'
            className={cn(
              "p-1 rounded-lg",
              getValue() === "Completed"
                ? "bg-green-200 text-green-500"
                : "bg-red-200 text-red-500"
            )}
          >
            {getValue() as string}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      size: 50,
      cell: ({ row }) => <ActionList id={row.original.id} onDelete={handleDelete} />,
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex-items'>
        <Button variant='custom' className='bg-brand-light text-primary'>
          <p>Bulk Actions</p>
          <DownIcon />
        </Button>
        <Link href={HrRoutes.SEPARATION_MANAGEMENT_CREATE}>
          <Button>
            <AddSquareIcon />
            Add New
          </Button>
        </Link>
      </div>

      <Card className='space-y-4'>
        <div className='flex items-center justify-start gap-2'>
          <span className='flex items-center w-1/3 px-2 py-2 border rounded-lg'>
            <SearchIcon />
            <input
              placeholder='Search by name'
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='ml-2 h-6 border-none bg-none focus:outline-none outline-none'
            />
          </span>
          <Button className='shadow-sm' variant='ghost'>
            <FilterIcon />
          </Button>
        </div>
        <DataTable
          data={separationData?.data?.results || []}
          columns={columns}
          isLoading={isLoading}
          pagination={{
            total: separationData?.data?.pagination?.count || 0,
            pageSize: 20,
            onChange: (page: number) => {},
          }}
        />
      </Card>
    </div>
  );
};

export default SeparationManagement;

interface ActionListProps {
  id: string;
  onDelete: (id: string) => void;
}

const ActionList: React.FC<ActionListProps> = ({ id, onDelete }) => {
  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this separation record?")) {
      onDelete(id);
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost' className='flex gap-2 py-6'>
              <MoreOptionsHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=' w-fit'>
            <div className='flex flex-col items-start justify-between gap-1'>
              <Link
                href={`/dashboard/hr/separation-management/${id}`}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EyeIcon />
                  View
                </Button>
              </Link>

              <Button
                onClick={handleDeleteClick}
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <DeleteIcon />
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </>
    </div>
  );
};
