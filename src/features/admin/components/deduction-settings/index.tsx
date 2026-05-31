"use client";

import { useState } from "react";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useGetAllDeductionSettings } from "@/features/admin/controllers/deductionSettingsController";
import DeductionSettingsModal from "./modal";
import type { IDeductionSetting } from "@/features/admin/controllers/deductionSettingsController";

export default function DeductionSettingsHome() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IDeductionSetting | null>(null);

  const { data, isLoading, error, isError } = useGetAllDeductionSettings({
    page,
    size: 20,
  });

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: IDeductionSetting) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const columns = [
    {
      accessorKey: "payment_type_display",
      header: "Payment Type",
    },
    {
      accessorKey: "deduction_name",
      header: "Deduction Name",
    },
    {
      accessorKey: "amount",
      header: "Amount (₦)",
      cell: ({ row }: any) => {
        return `₦${Number(row.original.amount).toLocaleString()}`;
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }: any) => {
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              row.original.is_active
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {row.original.is_active ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => {
        return (
          <span className="text-sm text-gray-600">
            {row.original.description || "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "created_by_name",
      header: "Created By",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(row.original)}
            >
              <Pencil size={16} />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={handleCreate}>
            <Plus size={20} /> Add Deduction Setting
          </Button>
        </div>

        <Card className="mt-10">
          <div className="p-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Unable to Load Deduction Settings
              </h3>
              <p className="text-red-600 mb-4">
                There&apos;s a server issue preventing deduction settings from loading.
              </p>
              <div className="text-sm text-red-500 bg-red-100 p-3 rounded mb-4 text-left">
                <strong>Technical Details:</strong>
                <br />
                {error?.message || "Server returned 500 Internal Server Error"}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Deduction Settings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage system-wide default deductions for different payment types
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus size={20} /> Add Deduction Setting
        </Button>
      </div>

      <Card>
        <TableFilters>
          <DataTable
            columns={columns}
            data={data?.data.results || []}
            isLoading={isLoading}
            pagination={{
              total: data?.data?.paginator?.count ?? 0,
              pageSize: data?.data?.paginator?.page_size ?? 20,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>

      <DeductionSettingsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
      />
    </>
  );
}
