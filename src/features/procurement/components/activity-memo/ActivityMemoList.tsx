"use client";

import Card from "components/Card";
import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import IconButton from "components/IconButton";
import { useGetAllActivityMemos } from "@/features/procurement/controllers/activityMemoController";
import { useState } from "react";
import { format } from "date-fns";

type ActivityMemoData = {
  id: string;
  subject: string;
  activity?: string;
  requested_date: string;
  status?: string;
  created_by?: string;
  approved_by?: string;
  expenses?: Array<{
    total_cost?: number;
  }>;
  created_at?: string;
};

interface ActivityMemoListProps {
  status: 'pending' | 'approved';
}

const ActivityMemoList = ({ status }: ActivityMemoListProps) => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  // Fetch activity memos from API
  const { data, isLoading, error } = useGetAllActivityMemos({
    page,
    size: 20,
    status: status === 'approved' ? 'approved' : '',
  });

  const activityMemos = data?.data?.results || [];

  const columns: ColumnDef<ActivityMemoData>[] = [
    {
      header: "Subject",
      accessorKey: "subject",
      size: 300,
      cell: ({ getValue }) => {
        const subject = getValue() as string;
        return subject || "No subject";
      },
    },
    {
      header: "Activity",
      accessorKey: "activity",
      size: 250,
      cell: ({ row }) => {
        const activityDetail = (row.original as any).activity_detail;
        if (activityDetail) {
          return activityDetail.name || activityDetail.code || "-";
        }
        return (row.original as any).activity || "-";
      },
    },
    {
      header: "Total Amount",
      id: "total_amount",
      cell: ({ row }) => {
        // Calculate total from expenses array
        const expenses = row.original.expenses || [];
        const total = expenses.reduce((sum, expense) => {
          return sum + (expense.total_cost || 0);
        }, 0);
        return `₦${total.toLocaleString()}`;
      },
    },
    {
      header: "Requested Date",
      accessorKey: "requested_date",
      cell: ({ getValue }) => {
        const date = getValue() as string;
        try {
          return date ? format(new Date(date), "PP") : "N/A";
        } catch {
          return date || "N/A";
        }
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const statusValue = row.original.status || (status === 'approved' ? 'Approved' : 'Pending');
        const displayStatus = statusValue.charAt(0).toUpperCase() + statusValue.slice(1);

        return (
          <Badge
            className={
              statusValue.toLowerCase() === "approved"
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-yellow-100 text-yellow-700 border-yellow-300"
            }
          >
            {displayStatus}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              router.push(`/dashboard/procurement/activity-memo/${row.original.id}`)
            }
            className="rounded-lg px-2 py-2 bg-[#F9F9F9] hover:text-primary dark:text-black dark:hover:text-primary"
          >
            <Icon icon="solar:eye-bold-duotone" fontSize={15} />
          </button>
          <button
            onClick={() =>
              router.push(`/dashboard/procurement/activity-memo/${row.original.id}/edit`)
            }
            className="rounded-lg px-2 py-2 bg-[#F9F9F9] hover:text-primary dark:text-black dark:hover:text-primary"
          >
            <Icon icon="solar:pen-bold-duotone" fontSize={15} />
          </button>
          <IconButton className="bg-[#F9F9F9] hover:text-primary">
            <Icon icon="ant-design:delete-twotone" fontSize={15} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold">
            {status === 'pending' ? 'Created Activity Memos' : 'Approved Activity Memos'}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {status === 'pending'
              ? 'View and manage activity memos pending approval'
              : 'View all approved activity memos'}
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/procurement/activity-memo/create")}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Create Activity Memo
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card>
          <div className="p-6 text-center">
            <div className="text-red-600 mb-2">
              <Icon icon="mdi:alert-circle" fontSize={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Activity Memos</h3>
            <p className="text-gray-600">{error.message || "Failed to load activity memos"}</p>
          </div>
        </Card>
      )}

      {/* Data Table */}
      {!error && (
        <Card>
          <DataTable
            data={activityMemos}
            columns={columns}
            isLoading={isLoading}
            pagination={{
              total: data?.data?.pagination?.count || 0,
              pageSize: 20,
              onChange: setPage,
            }}
          />
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && activityMemos.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Icon icon="mdi:file-document-outline" fontSize={64} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Activity Memos Found
            </h3>
            <p className="text-gray-600 mb-4">
              {status === 'pending'
                ? 'No pending activity memos. Create one to get started.'
                : 'No approved activity memos yet.'}
            </p>
            {status === 'pending' && (
              <Button
                onClick={() => router.push("/dashboard/procurement/activity-memo/create")}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus size={20} />
                Create Activity Memo
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ActivityMemoList;