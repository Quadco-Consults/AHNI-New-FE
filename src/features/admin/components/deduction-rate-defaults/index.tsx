"use client";

import { useState } from "react";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { useGetAllDeductionRateDefaults } from "@/features/admin/controllers/deductionRateDefaultsController";
import DeductionRateDefaultsModal from "./modal";
import type { IDeductionRateDefaults } from "@/features/admin/controllers/deductionRateDefaultsController";

export default function DeductionRateDefaultsHome() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IDeductionRateDefaults | null>(null);

  const { data, isLoading, error, isError } = useGetAllDeductionRateDefaults({
    page,
    size: 20,
  });

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: IDeductionRateDefaults) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const columns = [
    {
      accessorKey: "effective_date",
      header: "Effective Date",
      cell: ({ row }: any) => {
        const date = new Date(row.original.effective_date);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      },
    },
    {
      accessorKey: "default_wht_rate",
      header: "WHT Rate (%)",
      cell: ({ row }: any) => {
        return `${Number(row.original.default_wht_rate).toFixed(2)}%`;
      },
    },
    {
      accessorKey: "default_pension_rate",
      header: "Pension Rate (%)",
      cell: ({ row }: any) => {
        return `${Number(row.original.default_pension_rate).toFixed(2)}%`;
      },
    },
    {
      accessorKey: "default_nhis_rate",
      header: "NHIS Rate (%)",
      cell: ({ row }: any) => {
        return `${Number(row.original.default_nhis_rate).toFixed(2)}%`;
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
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }: any) => {
        return (
          <span className="text-sm text-gray-600">
            {row.original.notes || "-"}
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
      <div className="space-y-6 pt-6">
        <div className="flex justify-end">
          <Button onClick={handleCreate}>
            <Plus size={20} /> Add Rate Configuration
          </Button>
        </div>

        <div className="p-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Unable to Load Deduction Rate Defaults
            </h3>
            <p className="text-red-600 mb-4">
              There&apos;s a server issue preventing deduction rate defaults from loading.
            </p>
            <div className="text-sm text-red-500 bg-red-100 p-3 rounded mb-4 text-left">
              <strong>Technical Details:</strong>
              <br />
              {error?.message || "Server returned 500 Internal Server Error"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4 pt-6">
        <div>
          <h3 className="text-lg font-semibold">Deduction Rate Defaults</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage system-wide default deduction rates (WHT, Pension, NHIS) for automatic calculation
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus size={20} /> Add Rate Configuration
        </Button>
      </div>

      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">How This Works:</h4>
        <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
          <li>These percentage rates are used to auto-calculate deductions on payment requests</li>
          <li>Only ONE configuration can be active at a time</li>
          <li>Individual staff members can have custom rates that override these defaults</li>
          <li>Example: 5% WHT means ₦100,000 payment = ₦5,000 WHT deduction</li>
        </ul>
      </div>

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

      <DeductionRateDefaultsModal
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
