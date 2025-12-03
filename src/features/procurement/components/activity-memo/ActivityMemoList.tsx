"use client";

import Card from "components/Card";
import { Button } from "components/ui/button";
import { Plus, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from "components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import IconButton from "components/IconButton";
import { useGetAllActivityMemos, ActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { useState } from "react";
import { format } from "date-fns";
import { ActivityMemoApprovalAPI } from "@/features/procurement/controllers/activityMemoApprovalController";
import { useGetUserProfile } from "@/features/auth/controllers/userController";
import { toast } from "sonner";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

interface ActivityMemoListProps {
  status: 'pending' | 'approved';
}

const ActivityMemoList = ({ status }: ActivityMemoListProps) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch activity memos from API
  const { data, isLoading, error, refetch } = useGetAllActivityMemos({
    page,
    size: 20,
    status: status === 'approved' ? 'APPROVED' : '',
  });

  // Get current user
  const { data: currentUser } = useGetUserProfile();

  // Filter results based on tab selection
  const filteredMemos = status === 'approved'
    ? (data?.data?.results || []).filter(memo => memo.status === 'APPROVED') // Show only APPROVED memos
    : (data?.data?.results || []).filter(memo =>
        // For 'pending' tab, show only DRAFT and SUBMITTED memos
        memo.status === 'DRAFT' || memo.status === 'SUBMITTED'
      );

  // Helper function to check if user can approve
  const canUserApprove = (memo: any) => {
    if (!currentUser?.data?.id) return false;
    const userId = currentUser.data.id;

    // Can approve if user is the approver and status is REVIEWED
    return memo.status === 'REVIEWED' && memo.approved_by === userId;
  };

  // Helper function to check if user can review
  const canUserReview = (memo: any) => {
    if (!currentUser?.data?.id) return false;
    const userId = currentUser.data.id;

    // Can review if user is in reviewers list and status is PENDING
    return memo.status === 'PENDING' && memo.reviewed_by?.includes(userId);
  };

  // Handle quick approve
  const handleQuickApprove = async (memoId: string | undefined) => {
    if (!memoId) return;
    setProcessingId(memoId);
    try {
      await ActivityMemoApprovalAPI.approve(memoId);
      toast.success("Activity memo approved successfully!");
      refetch();
    } catch (error: any) {
      toast.error(`Failed to approve: ${error.message || 'Unknown error'}`);
    } finally {
      setProcessingId(null);
    }
  };

  // Handle quick review
  const handleQuickReview = async (memoId: string | undefined) => {
    if (!memoId) return;
    setProcessingId(memoId);
    try {
      await ActivityMemoApprovalAPI.review(memoId);
      toast.success("Activity memo reviewed successfully!");
      refetch();
    } catch (error: any) {
      toast.error(`Failed to review: ${error.message || 'Unknown error'}`);
    } finally {
      setProcessingId(null);
    }
  };

  // Handle delete
  const handleDelete = async (memoId: string | undefined) => {
    if (!memoId) return;

    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this activity memo? This action cannot be undone.")) {
      return;
    }

    setProcessingId(memoId);
    try {
      await AxiosWithToken.delete(`procurements/purchase-request-memo/${memoId}/`);
      toast.success("Activity memo deleted successfully!");
      refetch();
    } catch (error: any) {
      toast.error(`Failed to delete: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    } finally {
      setProcessingId(null);
    }
  };

  const columns: ColumnDef<ActivityMemo>[] = [
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
          // Ensure total_cost is a number
          const cost = typeof expense.total_cost === 'string'
            ? parseFloat(expense.total_cost)
            : (expense.total_cost || 0);
          return sum + (isNaN(cost) ? 0 : cost);
        }, 0);

        // Format with proper thousands separators and 2 decimal places
        return `₦${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
      cell: ({ row }) => {
        const memo = row.original;
        const isProcessing = processingId === memo.id;
        const showReview = canUserReview(memo);
        const showApprove = canUserApprove(memo);

        return (
          <div className="flex items-center gap-2">
            {/* Review Button - only for reviewers when status is PENDING */}
            {showReview && (
              <button
                onClick={() => handleQuickReview(memo.id)}
                disabled={isProcessing}
                className="rounded-lg px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                title="Review this memo"
              >
                <CheckCircle size={16} />
                {isProcessing ? 'Processing...' : 'Review'}
              </button>
            )}

            {/* Approve Button - only for approvers when status is REVIEWED */}
            {showApprove && (
              <button
                onClick={() => handleQuickApprove(memo.id)}
                disabled={isProcessing}
                className="rounded-lg px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                title="Approve this memo"
              >
                <CheckCircle size={16} />
                {isProcessing ? 'Processing...' : 'Approve'}
              </button>
            )}

            <button
              onClick={() =>
                router.push(`/dashboard/procurement/activity-memo/${memo.id}`)
              }
              className="rounded-lg px-2 py-2 bg-[#F9F9F9] hover:text-primary dark:text-black dark:hover:text-primary"
              title="View details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() =>
                router.push(`/dashboard/procurement/activity-memo/${memo.id}/edit`)
              }
              className="rounded-lg px-2 py-2 bg-[#F9F9F9] hover:text-primary dark:text-black dark:hover:text-primary"
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDelete(memo.id)}
              disabled={isProcessing}
              className="rounded-lg px-2 py-2 bg-[#F9F9F9] hover:text-red-600 dark:text-black dark:hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
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
              <AlertCircle size={16} />
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
            data={filteredMemos}
            columns={columns}
            isLoading={isLoading}
            pagination={{
              total: data?.data?.paginator?.count || 0,
              pageSize: 20,
              onChange: setPage,
            }}
          />
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredMemos.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FileText size={16} />
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