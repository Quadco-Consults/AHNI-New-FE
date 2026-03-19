"use client";

import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, CheckCircle, AlertCircle, Eye, FileText } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/Table/DataTable";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import IconButton from "@/components/IconButton";
import { useGetAllActivityMemos, ActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { useState } from "react";
import { format } from "date-fns";
import { ActivityMemoApprovalAPI } from "@/features/procurement/controllers/activityMemoApprovalController";
import { useGetUserProfile } from "@/features/auth/controllers/userController";
import { toast } from "sonner";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import logoPng from "assets/imgs/logo.png";

interface ActivityMemoListProps {
  status: 'pending' | 'approved';
}

const ActivityMemoList = ({ status }: ActivityMemoListProps) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedMemoForDetails, setSelectedMemoForDetails] = useState<ActivityMemo | null>(null);
  const [activeTab, setActiveTab] = useState(0); // 0: Activity Memo, 1: Expense Table

  // Fetch activity memos from API
  const { data, isLoading, error, refetch } = useGetAllActivityMemos({
    page,
    size: 20,
    status: status === 'approved' ? 'APPROVED' : '',
  });

  // Get current user
  const { data: currentUser } = useGetUserProfile();

  // Check if user is admin/superuser or has admin role
  const isAdmin = currentUser?.data?.is_superuser ||
                 currentUser?.data?.is_staff ||
                 currentUser?.data?.roles?.some((role: any) =>
                   role.name?.toLowerCase().includes('admin') ||
                   role.name?.toLowerCase().includes('super')
                 );

  // Filter results based on tab selection and current user
  const filteredMemos = status === 'approved'
    ? (data?.data?.results || []).filter(memo => {
        // Debug logging commented to prevent render loops
        // console.log('📝 Activity Memo Debug (Approved):', {
        //   memoId: memo.id,
        //   memoStatus: memo.status,
        //   memoCreatedBy: memo.created_by,
        //   currentUserId: currentUser?.data?.id,
        //   statusMatch: memo.status === 'APPROVED',
        //   userMatch: memo.created_by === currentUser?.data?.id
        // });

        // Check status match first
        const statusMatch = memo.status === 'APPROVED';

        // If admin, skip user filtering - show all approved memos
        // If not admin, only show memos created by current user
        const userMatch = isAdmin || memo.created_by === currentUser?.data?.id;

        return statusMatch && userMatch;
      }) // Show APPROVED memos (all for admin, own for regular users)
    : (data?.data?.results || []).filter(memo => {
        // Debug logging commented to prevent render loops
        // console.log('📝 Activity Memo Debug (Pending):', {
        //   memoId: memo.id,
        //   memoStatus: memo.status,
        //   memoCreatedBy: memo.created_by,
        //   currentUserId: currentUser?.data?.id,
        //   statusMatch: memo.status === 'DRAFT' || memo.status === 'SUBMITTED',
        //   userMatch: memo.created_by === currentUser?.data?.id
        // });

        // Check status match first - for 'pending' tab, show DRAFT and SUBMITTED memos
        const statusMatch = memo.status === 'DRAFT' || memo.status === 'SUBMITTED';

        // If admin, skip user filtering - show all pending memos
        // If not admin, only show memos created by current user
        const userMatch = isAdmin || memo.created_by === currentUser?.data?.id;

        return statusMatch && userMatch;
      });

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
              onClick={() => setSelectedMemoForDetails(memo)}
              className="rounded-lg px-2 py-2 bg-blue-500 hover:bg-blue-600 text-white"
              title="Quick View"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() =>
                router.push(`/dashboard/procurement/activity-memo/${memo.id}`)
              }
              className="rounded-lg px-2 py-2 bg-[#F9F9F9] hover:text-primary dark:text-black dark:hover:text-primary"
              title="View Full Memo"
            >
              <FileText size={16} />
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

      {/* Tabbed View Details Modal */}
      {selectedMemoForDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto m-4">
            {/* Modal Header */}
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Activity Memo Details</h2>
                <span className="text-sm text-gray-600">Subject: {selectedMemoForDetails.subject}</span>
              </div>
              <button
                onClick={() => {
                  setSelectedMemoForDetails(null);
                  setActiveTab(0);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b bg-gray-50">
              {['Activity Memo', 'Expense Table'].map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(index)}
                  className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === index
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="relative">
              <div id="tab-content" className="p-8 bg-white min-h-[600px]">
                {/* Activity Memo Tab - Internal Memo Format */}
                {activeTab === 0 && (
                  <div>
                    {/* AHNI Header with Logo */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 border border-black flex items-center justify-center">
                          <img
                            src={(logoPng as any).src || logoPng}
                            alt="AHNI Logo"
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <div>
                          <h1 className="text-base font-bold">Achieving Health Nigeria Initiative</h1>
                        </div>
                      </div>
                      <div className="text-right">
                        <h2 className="text-lg font-bold">Internal Memo</h2>
                      </div>
                    </div>

                    {/* Memo Content */}
                    <div className="space-y-4">
                      {/* To/Through/From Section */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-4">
                          <span className="font-bold w-16">To:</span>
                          <div className="flex-1">
                            <div className="border-b border-black pb-1">
                              {selectedMemoForDetails.approved_by_details ? (
                                `${selectedMemoForDetails.approved_by_details.name ||
                                  `${selectedMemoForDetails.approved_by_details.first_name || ''} ${selectedMemoForDetails.approved_by_details.last_name || ''}`.trim() ||
                                  selectedMemoForDetails.approved_by_details.email || 'Approver'
                                } (MD, AHNI)`
                              ) : (
                                'Please select approver in form'
                              )}
                            </div>
                          </div>
                          <div className="text-right text-sm w-24">
                            <div>{selectedMemoForDetails.requested_date || new Date().toLocaleDateString()}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <span className="font-bold w-16">Through:</span>
                          <div className="flex-1">
                            <div className="border-b border-black pb-1">
                              {selectedMemoForDetails.through_details?.length > 0 ?
                                selectedMemoForDetails.through_details.map((person, idx) => {
                                  const personName = person.name ||
                                    `${person.first_name || ''} ${person.last_name || ''}`.trim() ||
                                    person.email ||
                                    'Personnel';
                                  return `${personName} (${person.designation || 'Staff'})`;
                                }).join(', ') :
                                'Please select through personnel in form'
                              }
                            </div>
                          </div>
                          <div className="text-right text-sm w-24">
                            <div>{selectedMemoForDetails.requested_date || new Date().toLocaleDateString()}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <span className="font-bold w-16">From:</span>
                          <div className="flex-1">
                            <div className="border-b border-black pb-1">
                              {selectedMemoForDetails.created_by_details ? (
                                `${selectedMemoForDetails.created_by_details.name ||
                                  `${selectedMemoForDetails.created_by_details.first_name || ''} ${selectedMemoForDetails.created_by_details.last_name || ''}`.trim() ||
                                  selectedMemoForDetails.created_by_details.email ||
                                  'Creator'
                                } (${selectedMemoForDetails.created_by_details.designation || 'Staff'})`
                              ) : (
                                'Creator'
                              )}
                            </div>
                          </div>
                          <div className="text-right text-sm w-24">
                            <div>{selectedMemoForDetails.requested_date || selectedMemoForDetails.created_date}</div>
                          </div>
                        </div>
                      </div>

                      {/* Budget and Administrative Details */}
                      <div className="grid grid-cols-2 gap-8 mt-6">
                        <div className="space-y-2">
                          <div className="flex gap-4">
                            <span className="font-bold">Budget Line #:</span>
                            <span>
                              {selectedMemoForDetails.budget_line_details?.map(bl => bl.name || bl.module_name || bl.code || bl.module_code).filter(Boolean).join(', ') ||
                               'N/A'}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <span className="font-bold">Module:</span>
                            <span>
                              {selectedMemoForDetails.module_details?.map(m => m.name || m.code).filter(Boolean).join(', ') ||
                               'N/A'}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <span className="font-bold">Intervention:</span>
                            <span>
                              {selectedMemoForDetails.intervention_areas_details?.map(ia => ia.description || ia.code || ia.name).filter(Boolean).join(', ') ||
                               'N/A'}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <span className="font-bold">Cost Grouping #:</span>
                            <span>
                              {selectedMemoForDetails.cost_categories_details?.map(cc => cc.module_name || cc.name || cc.code || cc.module_code).filter(Boolean).join(', ') ||
                               'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex gap-4">
                            <span className="font-bold">FCO#:</span>
                            <span>
                              {selectedMemoForDetails.fconumber_details?.map(fco => fco.module_name || fco.name || fco.module_code || fco.code).filter(Boolean).join(', ') ||
                               selectedMemoForDetails.activity_detail?.code ||
                               'N/A'}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <span className="font-bold">Funding Source:</span>
                            <span>
                              {selectedMemoForDetails.funding_sources_details?.map(fs => fs.name || fs.module_name).filter(Boolean).join(', ') ||
                               'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Date and Subject */}
                      <div className="mt-6">
                        <div className="flex gap-4 mb-4">
                          <span className="font-bold">Date:</span>
                          <span>{selectedMemoForDetails.requested_date}</span>
                        </div>
                        <div className="flex gap-4 mb-6">
                          <span className="font-bold">Subject:</span>
                          <span className="underline">{selectedMemoForDetails.subject}</span>
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="mt-6 leading-relaxed text-justify">
                        <p>{selectedMemoForDetails.comment || `
                          This memo seeks approval for the procurement implementation of activities under the ${selectedMemoForDetails.activity || 'program implementation'}.
                          The activities are requesting approval to implement operational activities as approved in budget line ${
                            selectedMemoForDetails.budget_line_details?.map(bl => bl.module_code).join(', ') ||
                            selectedMemoForDetails.budget_line?.join(', ') || '916'
                          } for effective operations in the state for the current reporting period.
                        `}</p>

                        <p className="mt-4">
                          This is therefore a request to approve the sum of
                          <strong> ₦{selectedMemoForDetails.activity_budget?.toLocaleString() ||
                            selectedMemoForDetails.expenses?.reduce((sum, expense) => {
                              const cost = parseFloat(expense.total_cost?.toString() || '0') || 0;
                              return sum + cost;
                            }, 0).toLocaleString() || '0'}</strong> only
                          to be charged to budget line {
                            selectedMemoForDetails.budget_line_details?.map(bl => bl.module_code).join(', ') ||
                            selectedMemoForDetails.budget_line?.join(', ') || '916'
                          } for immediate procurement of listed items/execution of activities for effective operations in the state.
                        </p>

                        <p className="mt-4">
                          Please, attached is the activity budget for your review and approval.
                        </p>

                        <p className="mt-4">Thank you.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expense Table Tab - AHNI Activity Expense Sheet Format */}
                {activeTab === 1 && (
                  <div>
                    {/* AHNI Header with proper layout */}
                    <div className="border border-black p-4 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 border border-black flex items-center justify-center font-bold text-xs">
                            AHNI
                          </div>
                          <div>
                            <h1 className="text-sm font-bold">Achieving Health Nigeria Initiative</h1>
                          </div>
                        </div>
                      </div>

                      {/* Activity Header */}
                      <div className="bg-blue-200 p-2 text-center font-bold text-sm mb-4">
                        Activity: {selectedMemoForDetails.activity || selectedMemoForDetails.subject || 'Activity Memo'}
                      </div>

                      {/* Request Details Grid */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex">
                            <span className="w-24 font-bold bg-gray-200 p-1 border border-black">Request Date:</span>
                            <span className="flex-1 p-1 border border-black">{selectedMemoForDetails.requested_date || '15/07/2024'}</span>
                          </div>
                          <div className="flex">
                            <span className="w-24 font-bold bg-gray-200 p-1 border border-black">Location:</span>
                            <span className="flex-1 p-1 border border-black">{selectedMemoForDetails.location || 'N/A'}</span>
                          </div>
                          <div className="flex">
                            <span className="w-24 font-bold bg-gray-200 p-1 border border-black">Duration:</span>
                            <span className="flex-1 p-1 border border-black">Q3 (July - September 2024)</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex">
                            <span className="w-24 font-bold bg-gray-200 p-1 border border-black">FCO #:</span>
                            <span className="flex-1 p-1 border border-black">
                              {selectedMemoForDetails.fconumber_details?.map(fco => fco.module_name || fco.name || fco.module_code || fco.code).filter(Boolean).join(', ') ||
                               selectedMemoForDetails.activity_detail?.code ||
                               'N/A'}
                            </span>
                          </div>
                          <div className="flex">
                            <span className="w-24 font-bold bg-gray-200 p-1 border border-black">Module:</span>
                            <span className="flex-1 p-1 border border-black">
                              {selectedMemoForDetails.module_details?.map(m => m.name || m.code).filter(Boolean).join(', ') ||
                               'N/A'}
                            </span>
                          </div>
                          <div className="flex">
                            <span className="w-24 font-bold bg-gray-200 p-1 border border-black">Budget Line #:</span>
                            <span className="flex-1 p-1 border border-black">
                              {selectedMemoForDetails.budget_line_details?.map(bl => bl.name || bl.module_name || bl.code || bl.module_code).filter(Boolean).join(', ') ||
                               'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                        <div className="flex">
                          <span className="w-24 font-bold bg-gray-200 p-1 border border-black">Cost Input #:</span>
                          <span className="flex-1 p-1 border border-black">
                            {selectedMemoForDetails.cost_inputs_details?.map(ci => ci.module_name || ci.name || ci.code || ci.module_code).filter(Boolean).join(', ') ||
                             'N/A'}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="w-24 font-bold bg-gray-200 p-1 border border-black">Funding Source:</span>
                          <span className="flex-1 p-1 border border-black">
                            {selectedMemoForDetails.funding_sources_details?.map(fs => fs.name || fs.module_name).filter(Boolean).join(', ') ||
                             'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedMemoForDetails.expenses && selectedMemoForDetails.expenses.length > 0 ? (
                      (() => {
                        // Detect if this is personnel expenses
                        const isPersonnelExpenses = selectedMemoForDetails.expenses.some(
                          expense => expense.num_of_persons || expense.num_of_months || expense.num_of_facilities ||
                          expense.expense_type === 'personnel'
                        );

                        return isPersonnelExpenses ? (
                          /* Personnel Payment Table Format */
                          <div>
                            <table className="w-full border-collapse border border-black text-xs">
                              <thead>
                                <tr className="bg-blue-200">
                                  <th className="border border-black px-2 py-2 text-center">Expense Item</th>
                                  <th className="border border-black px-2 py-2 text-center">Quantity/<br/># of Persons</th>
                                  <th className="border border-black px-2 py-2 text-center"># of<br/>months</th>
                                  <th className="border border-black px-2 py-2 text-center"># of<br/>Facilities</th>
                                  <th className="border border-black px-2 py-2 text-center">Unit cost<br/>₦</th>
                                  <th className="border border-black px-2 py-2 text-center">Total Cost<br/>₦</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedMemoForDetails.expenses.map((expense, index) => (
                                  <tr key={index}>
                                    <td className="border border-black px-2 py-1">
                                      {expense.item_detail?.name || expense.item || 'N/A'}
                                    </td>
                                    <td className="border border-black px-2 py-1 text-center">
                                      {expense.num_of_persons || expense.quantity || '1'}
                                    </td>
                                    <td className="border border-black px-2 py-1 text-center">
                                      {expense.num_of_months || '1'}
                                    </td>
                                    <td className="border border-black px-2 py-1 text-center">
                                      {expense.num_of_facilities || '1'}
                                    </td>
                                    <td className="border border-black px-2 py-1 text-right">
                                      {expense.unit_cost ? parseFloat(expense.unit_cost.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                    </td>
                                    <td className="border border-black px-2 py-1 text-right font-semibold">
                                      {expense.total_cost ? parseFloat(expense.total_cost.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                    </td>
                                  </tr>
                                ))}

                                {/* Overall Total Row */}
                                <tr className="bg-green-200 font-bold">
                                  <td colSpan={5} className="border border-black px-2 py-2 text-center">OVERALL TOTAL</td>
                                  <td className="border border-black px-2 py-2 text-right">
                                    {selectedMemoForDetails.expenses.reduce((sum, expense) => {
                                      const cost = parseFloat(expense.total_cost?.toString() || '0') || 0;
                                      return sum + cost;
                                    }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          /* Services/Items Table Format */
                          <div>
                            <table className="w-full border-collapse border border-black text-xs">
                              <thead>
                                <tr className="bg-blue-200">
                                  <th className="border border-black px-1 py-2 text-center w-8">#</th>
                                  <th className="border border-black px-2 py-2 text-center">Description/Item Name</th>
                                  <th className="border border-black px-1 py-2 text-center w-16">UOM</th>
                                  <th className="border border-black px-1 py-2 text-center w-16">QTY</th>
                                  <th className="border border-black px-2 py-2 text-center w-20">Unit cost</th>
                                  <th className="border border-black px-2 py-2 text-center w-24">Total Cost</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedMemoForDetails.expenses.map((expense, index) => (
                                  <tr key={index}>
                                    <td className="border border-black px-1 py-1 text-center">{index + 1}</td>
                                    <td className="border border-black px-2 py-1">
                                      {expense.item_detail?.name || expense.item || 'N/A'}
                                    </td>
                                    <td className="border border-black px-1 py-1 text-center">
                                      {expense.item_detail?.uom || 'Unit'}
                                    </td>
                                    <td className="border border-black px-1 py-1 text-center">{expense.quantity || '1'}</td>
                                    <td className="border border-black px-2 py-1 text-center">
                                      ₦{expense.unit_cost ? parseFloat(expense.unit_cost.toString()).toLocaleString() : '0'}
                                    </td>
                                    <td className="border border-black px-2 py-1 text-center font-semibold">
                                      ₦{expense.total_cost ? parseFloat(expense.total_cost.toString()).toLocaleString() : '0'}
                                    </td>
                                  </tr>
                                ))}

                                {/* Overall Total Row */}
                                <tr className="bg-green-200 font-bold">
                                  <td colSpan={5} className="border border-black px-2 py-2 text-right">OVERALL TOTAL</td>
                                  <td className="border border-black px-2 py-2 text-center">
                                    ₦{selectedMemoForDetails.expenses.reduce((sum, expense) => {
                                      const cost = parseFloat(expense.total_cost?.toString() || '0') || 0;
                                      return sum + cost;
                                    }, 0).toLocaleString()}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        );
                      })()
                    ) : (
                      /* No expense data */
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <p className="text-center text-yellow-800">No expense data available for this activity memo.</p>
                      </div>
                    )}

                    {/* Signature Section */}
                    <div className="mt-6 space-y-4">
                      <div className="grid grid-cols-3 gap-8 text-sm">
                        <div>
                          <p className="font-bold">Prepared by: {
                            selectedMemoForDetails.created_by_details?.name ||
                            'N/A'
                          }</p>
                          <div className="mt-2">
                            <p>Sign: _________________________</p>
                            <p className="mt-1">Date: {selectedMemoForDetails.created_date || selectedMemoForDetails.requested_date}</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-bold">Reviewed by: {
                            selectedMemoForDetails.through_details?.[0]?.name || 'N/A'
                          }</p>
                          <div className="mt-2">
                            <p>Sign: _________________________</p>
                            <p className="mt-1">Date: {selectedMemoForDetails.reviewed_date || ''}</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-bold">Approved by: {
                            selectedMemoForDetails.approved_by_details?.name || 'N/A'
                          }</p>
                          <div className="mt-2">
                            <p>Sign: _________________________</p>
                            <p className="mt-1">Date: {selectedMemoForDetails.approved_date || ''}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation and Action Buttons */}
              <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                    disabled={activeTab === 0}
                    variant="outline"
                    size="sm"
                  >
                    ← Previous
                  </Button>
                  <Button
                    onClick={() => setActiveTab(Math.min(1, activeTab + 1))}
                    disabled={activeTab === 1}
                    variant="outline"
                    size="sm"
                  >
                    Next →
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      const content = document.getElementById('tab-content');
                      if (content) {
                        const printWindow = window.open('', '_blank');
                        if (printWindow) {
                          printWindow.document.write(`
                            <html>
                              <head>
                                <title>Print Document</title>
                                <style>
                                  body { font-family: Arial, sans-serif; margin: 20px; }
                                  table { border-collapse: collapse; width: 100%; }
                                  th, td { border: 1px solid black; padding: 8px; text-align: left; }
                                  .text-center { text-align: center; }
                                  .font-bold { font-weight: bold; }
                                  .underline { text-decoration: underline; }
                                  .border-b { border-bottom: 1px solid black; }
                                  .bg-gray-50 { background-color: #f9fafb; }
                                  .bg-gray-100 { background-color: #f3f4f6; }
                                  @media print { body { margin: 0; } }
                                </style>
                              </head>
                              <body>${content.innerHTML}</body>
                            </html>
                          `);
                          printWindow.document.close();
                          printWindow.print();
                        }
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    🖨️ Print
                  </Button>
                  <Button
                    onClick={() => {
                      const content = document.getElementById('tab-content');
                      if (content) {
                        const link = document.createElement('a');
                        const file = new Blob([`
                          <html>
                            <head>
                              <title>Document</title>
                              <style>
                                body { font-family: Arial, sans-serif; margin: 20px; }
                                table { border-collapse: collapse; width: 100%; }
                                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                                .text-center { text-align: center; }
                                .font-bold { font-weight: bold; }
                                .underline { text-decoration: underline; }
                                .border-b { border-bottom: 1px solid black; }
                                .bg-gray-50 { background-color: #f9fafb; }
                                .bg-gray-100 { background-color: #f3f4f6; }
                              </style>
                            </head>
                            <body>${content.innerHTML}</body>
                          </html>
                        `], { type: 'text/html' });
                        link.href = URL.createObjectURL(file);
                        link.download = `${['Activity_Memo', 'Expense_Table'][activeTab]}_${selectedMemoForDetails.subject}.html`;
                        link.click();
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    💾 Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityMemoList;