"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/Loading";
import { useGetAllItemRequisitions } from "@/features/admin/controllers/itemRequisitionController";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TItemRequisitionPaginatedData } from "@/features/admin/types/inventory-management/item-requisition";

interface ConsumableRequisitionsProps {
  consumableId: string;
}

export default function ConsumableRequisitions({ consumableId }: ConsumableRequisitionsProps) {
  const [page, setPage] = useState(1);

  const { data: requisitions, isLoading } = useGetAllItemRequisitions({
    page,
    size: 20,
    search: "",
    status: "",
  });

  // Filter requisitions that contain this consumable
  const filteredRequisitions = useMemo(() => {
    if (!requisitions?.data?.results) return [];

    return requisitions.data.results.filter((requisition) => {
      return requisition.consummables?.some((item) => {
        // Check both item.id and item.item?.id to match the consumable
        const itemId = item.item?.id || item.consummable;
        return itemId === consumableId;
      });
    });
  }, [requisitions, consumableId]);

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'issued':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: ColumnDef<TItemRequisitionPaginatedData>[] = [
    {
      header: "Requestor",
      cell: ({ row }) => {
        const requisition = row.original;
        return (
          <div>
            <p className="font-medium">{requisition.created_by?.full_name || 'N/A'}</p>
            <p className="text-xs text-gray-600">{requisition.created_by?.email || ''}</p>
          </div>
        );
      },
    },
    {
      header: "Department",
      cell: ({ row }) => {
        return row.original.department?.name || 'N/A';
      },
    },
    {
      header: "Quantity Requested",
      cell: ({ row }) => {
        const requisition = row.original;
        // Find the quantity for this specific consumable
        const consumableItem = requisition.consummables?.find((item) => {
          const itemId = item.item?.id || item.consummable;
          return itemId === consumableId;
        });
        return consumableItem?.quantity || 0;
      },
    },
    {
      header: "Date Requested",
      cell: ({ row }) => {
        return format(new Date(row.original.created_datetime), "dd MMM, yyyy");
      },
    },
    {
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || 'Pending';
        return (
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
        );
      },
    },
    {
      header: "Action",
      cell: ({ row }) => {
        return (
          <Link href={`/dashboard/admin/item-requisition/${row.original.id}`}>
            <Button variant="outline" size="sm">
              <Eye size={16} />
              View
            </Button>
          </Link>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <Card className="p-6">
        <LoadingSpinner />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Item Requisitions</h3>
        <p className="text-sm text-gray-600">
          All requisitions that include this consumable item
        </p>
      </div>

      {filteredRequisitions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No requisitions found for this consumable item.</p>
        </div>
      ) : (
        <TableFilters>
          <DataTable
            data={filteredRequisitions}
            columns={columns}
            isLoading={isLoading}
            pagination={{
              total: filteredRequisitions.length,
              pageSize: 20,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      )}
    </Card>
  );
}
