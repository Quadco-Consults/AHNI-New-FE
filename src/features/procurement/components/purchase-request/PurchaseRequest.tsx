import Link from "next/link";
import Card from "@/components/Card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import FilterIcon from "@/components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "@/constants/RouterConstants";
import EyeIcon from "@/components/icons/EyeIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/Table/DataTable";
import { useGetPurchaseRequests, useDeletePurchaseRequest } from "@/features/procurement/controllers/purchaseRequestController";
import { PurchaseRequestResultsData } from "definations/procurement-types/purchase-request";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dailogs";
import PencilIcon from "@/components/icons/PencilIcon";
import ApprovalWorkflow from "./ApprovalWorkflow";
import ApprovalHistory from "./ApprovalHistory";
import { useGetUserProfile } from "@/features/auth/controllers/userController";
import { useGetActivityMemo, useGetAllActivityMemos } from "@/features/procurement/controllers/activityMemoController";
import { useState } from "react";
import logoPng from "assets/imgs/logo.png";

function PurchaseRequest({
  status = "pending",
}: {
  status: "pending" | "approved";
}) {
  const dispatch = useAppDispatch();
  const [selectedPR, setSelectedPR] = useState<PurchaseRequestResultsData | null>(null);
  const [selectedPRForDetails, setSelectedPRForDetails] = useState<PurchaseRequestResultsData | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState(0); // 0: Activity Memo, 1: Expense Table, 2: Purchase Request

  const { data, isLoading, refetch } = useGetPurchaseRequests({});
  const { data: currentUser } = useGetUserProfile();

  // Handle status updates from approval workflow
  const handleStatusUpdate = () => {
    refetch();
    setRefreshKey(prev => prev + 1);
  };

  // Get activity memo data for selected PR (for approval workflow)
  const activityMemoId = selectedPR?.request_memo;
  const isValidActivityMemoId = activityMemoId && activityMemoId !== 'undefined' && activityMemoId.trim().length > 0;
  const { data: activityMemoData } = useGetActivityMemo(activityMemoId as string, !!isValidActivityMemoId);

  // Get activity memo data for selected PR details view
  // Try multiple possible field names for activity memo ID
  const detailsActivityMemoId = selectedPRForDetails?.request_memo || selectedPRForDetails?.activity_memo || selectedPRForDetails?.memo_id;
  const isValidDetailsActivityMemoId = detailsActivityMemoId &&
    detailsActivityMemoId !== 'undefined' &&
    detailsActivityMemoId !== 'null' &&
    detailsActivityMemoId.toString().trim().length > 0;
  const { data: detailsActivityMemoData, isLoading: isLoadingActivityMemo, error: activityMemoError } = useGetActivityMemo(detailsActivityMemoId as string, !!isValidDetailsActivityMemoId);

  // Also get all activity memos to see what's available in the system (for debugging)
  const { data: allActivityMemos } = useGetAllActivityMemos({ size: 5 });


  // Filter and sort results based on status and current user
  const filteredAndSortedResults = data?.data?.results
    ?.slice()
    .filter((item) => {
      // Check if user is admin/superuser or has admin role
      const isAdmin = currentUser?.data?.is_superuser ||
                     currentUser?.data?.is_staff ||
                     currentUser?.data?.roles?.some((role: any) =>
                       role.name?.toLowerCase().includes('admin') ||
                       role.name?.toLowerCase().includes('super')
                     );

      // If user is admin, skip user filtering - show all data
      // If not admin, only show items requested by current user
      if (!isAdmin) {
        const isUserRequested = item.requested_by?.id === currentUser?.data?.id;
        if (!isUserRequested) return false;
      }

      // Then filter by status
      if (status === "pending") {
        // Show pending, under_review, review, or any non-approved status
        return !item.status || item.status.toLowerCase() !== 'approved';
      } else if (status === "approved") {
        // Show only approved requests
        return item.status && item.status.toLowerCase() === 'approved';
      }
      return true; // fallback to show all
    })
    .sort(
      (a, b) =>
        new Date(b.created_datetime).getTime() -
        new Date(a.created_datetime).getTime()
    );

  const columns: ColumnDef<PurchaseRequestResultsData>[] = [
    {
      header: "Purchase Request Number",
      accessorKey: "ref_number",
      size: 250,
    },
    {
      header: "Requesting dept",
      accessorKey: "requesting_department",
      size: 250,
      cell: ({ row }) => (
        <div className=''>
          <p>{row.original?.requesting_department_detail?.name}</p>
        </div>
      ),
    },
    {
      header: "Date of Request",
      accessorKey: "date_of_request",
      size: 150,
    },
    {
      header: "Required Date",
      accessorKey: "date_required",
      size: 150,
    },

    {
      header: "Deliver to",
      accessorKey: "location",
      size: 250,
      cell: ({ row }) => (
        <div className=''>
          <p>{row.original?.location_detail?.name}</p>
        </div>
      ),
    },
    {
      header: "Total Amount",
      accessorKey: "total_cost",
      size: 150,
      cell: ({ row }) => {
        const totalAmount = row.original.items.reduce(
          // @ts-ignore
          (sum, item) => sum + parseFloat(item.amount || "0"),
          0
        );

        return <div> ₦{totalAmount?.toLocaleString()}.00</div>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 150,
      cell: ({ row }) => {
        const getStatusColor = (status: string) => {
          switch (status?.toLowerCase()) {
            case 'approved':
              return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
              return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
              return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'under_review':
            case 'review':
              return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
              return 'bg-gray-100 text-gray-800 border-gray-200';
          }
        };

        const status = row.original.status || 'pending';
        const displayStatus = status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');

        return (
          <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
            {displayStatus}
          </div>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => <ActionListAction data={row.original} />,
    },
  ];

  const ActionListAction = ({ data }: any) => {
    const { deletePurchaseRequest } = useDeletePurchaseRequest(data?.id);

    const deletePurchaseRequestHandler = async () => {
      try {
        deletePurchaseRequest();
        toast.success("Document successfully deleted.");
      } catch (error) {
        toast.error("Something went wrong");
      }
    };

    // Check if this is an approved PR
    const isApproved = data?.status?.toLowerCase() === 'approved';

    return (
      <div className='flex items-center gap-2'>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost' className='flex gap-2 py-6'>
              <MoreOptionsHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=' w-fit'>
            <div className='flex flex-col items-start justify-between gap-1'>
              {/* View Details - Always first for both tabs */}
              <Button
                className='flex w-full items-center justify-start gap-2'
                variant='ghost'
                onClick={() => setSelectedPRForDetails(data)}
              >
                <EyeIcon />
                View Details
              </Button>

              {/* View Activity Memo - Navigate to dedicated page */}
              {data?.request_memo && (
                <Link
                  href={`/dashboard/procurement/purchase-request/final-preview?id=${data.request_memo}`}
                >
                  <Button
                    className='flex w-full items-center justify-start gap-2'
                    variant='ghost'
                  >
                    <EyeIcon />
                    View Activity Memo
                  </Button>
                </Link>
              )}

              {/* View Purchase Request - Navigate to dedicated page */}
              <Link
                href={`/dashboard/procurement/purchase-request/${data?.id}/details`}
              >
                <Button
                  className='flex w-full items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EyeIcon />
                  View Purchase Request
                </Button>
              </Link>

              {/* For Pending PR Tab: Show Approval Flow */}
              {!isApproved && (
                <Button
                  className='flex w-full items-center justify-start gap-2'
                  variant='ghost'
                  onClick={() => setSelectedPR(data)}
                >
                  <EyeIcon />
                  Approval Flow
                </Button>
              )}

              {/* For Approved PR Tab: Show Assign To */}
              {isApproved && (
                <Button
                  className='flex w-full items-center justify-start gap-2'
                  variant='ghost'
                  onClick={() => {
                    dispatch(
                      openDialog({
                        type: DialogType.AssignPurchaseRequestModal,
                        dialogProps: { id: data?.id, assignedTo: data?.assigned_to },
                      })
                    );
                  }}
                >
                  Assign To
                </Button>
              )}

              {/* Edit - Always available for both tabs */}
              <Link
                href={`/dashboard/procurement/purchase-request/${data?.id}/edit`}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <PencilIcon />
                  Edit
                </Button>
              </Link>

              {/* Delete - Always last for both tabs */}
              <Button
                className='flex w-full items-center justify-start gap-2'
                variant='ghost'
                onClick={deletePurchaseRequestHandler}
              >
                <DeleteIcon />
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  // Get counts for display
  const totalCount = data?.data?.results?.length || 0;
  const currentTabCount = filteredAndSortedResults?.length || 0;


  return (
    <section className='min-h-screen space-y-8'>
      <div className='flex w-full items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <h2 className='text-lg font-semibold'>
            {status === 'pending' ? 'Pending Purchase Requests' : 'Approved Purchase Requests'}
          </h2>
          <span className='px-3 py-1 text-sm bg-gray-100 rounded-full'>
            {currentTabCount} item{currentTabCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className='flex gap-3'>
          <Link className='w-fit' href="/dashboard/procurement/purchase-request/create">
            <Button className='flex gap-2 py-6' variant='outline'>
              <AddSquareIcon />
              Create Purchase Request
            </Button>
          </Link>
          <Link className='w-fit' href="/dashboard/procurement/purchase-request/activity-memo">
            <Button className='flex gap-2 py-6'>
              <AddSquareIcon />
              Create with Activity Memo
            </Button>
          </Link>
        </div>
      </div>
      <Card className='space-y-5'>
        <div className='flex items-center justify-start gap-2'>
          <span className='flex w-1/3 items-center rounded-lg border px-2 py-2'>
            <SearchIcon />
            <input
              placeholder='Search'
              type='text'
              className='ml-2 h-6 border-none bg-none outline-none focus:outline-none'
            />
          </span>
          <Button className='shadow-sm' variant='ghost'>
            <FilterIcon />
          </Button>
        </div>
        <DataTable
          // @ts-ignore
          data={filteredAndSortedResults || []}
          columns={columns}
          isLoading={isLoading}
        />
      </Card>

      {/* Approval Workflow Modal/Panel */}
      {selectedPR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Approval Workflow - {selectedPR.ref_number}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPR(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <ApprovalWorkflow
                purchaseRequestData={{ data: selectedPR }}
                activityMemoData={activityMemoData}
                currentUser={currentUser}
                purchaseRequestId={selectedPR.id}
                onStatusUpdate={handleStatusUpdate}
                key={refreshKey}
              />
              <ApprovalHistory
                purchaseRequestData={{ data: selectedPR }}
                activityMemoData={activityMemoData}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabbed View Details Modal */}
      {selectedPRForDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto m-4">
            {/* Modal Header */}
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Purchase Request Details</h2>
                <span className="text-sm text-gray-600">Ref: {selectedPRForDetails.ref_number}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedPRForDetails(null);
                  setActiveTab(0);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b bg-gray-50">
              {['Activity Memo', 'Expense Table', 'Purchase Request'].map((tab, index) => (
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
              {/* Tab Content Container */}
              <div id="tab-content" className="p-8 bg-white min-h-[600px]">

                {/* Activity Memo Tab - AHNI Internal Memo Format */}
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

                    {detailsActivityMemoData ? (
                      /* Real Activity Memo Content */
                      <div className="space-y-4">
                        {/* To/Through/From Section */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-4">
                            <span className="font-bold w-16">To:</span>
                            <div className="flex-1">
                              <div className="border-b border-black pb-1">
                                {selectedPRForDetails.approved_by_detail ? (
                                  `${selectedPRForDetails.approved_by_detail.name ||
                                    `${selectedPRForDetails.approved_by_detail.first_name || ''} ${selectedPRForDetails.approved_by_detail.last_name || ''}`.trim() ||
                                    selectedPRForDetails.approved_by_detail.email || 'Approver'
                                  } (MD, AHNI)`
                                ) : (
                                  'Please select approver in form'
                                )}
                              </div>
                              <div className="border-b border-black pb-1 mt-2">
                                {selectedPRForDetails.authorised_by_detail ? (
                                  `${selectedPRForDetails.authorised_by_detail.name ||
                                    `${selectedPRForDetails.authorised_by_detail.first_name || ''} ${selectedPRForDetails.authorised_by_detail.last_name || ''}`.trim() ||
                                    selectedPRForDetails.authorised_by_detail.email || 'Authorizer'
                                  } (Director of Operations, AHNI)`
                                ) : (
                                  'Please select authorizer in form'
                                )}
                              </div>
                              <div className="border-b border-black pb-1 mt-2">
                                {selectedPRForDetails.reviewed_by_detail ? (
                                  `${selectedPRForDetails.reviewed_by_detail.name ||
                                    `${selectedPRForDetails.reviewed_by_detail.first_name || ''} ${selectedPRForDetails.reviewed_by_detail.last_name || ''}`.trim() ||
                                    selectedPRForDetails.reviewed_by_detail.email || 'Reviewer'
                                  } (Director of Finance, AHNI)`
                                ) : (
                                  'Please select reviewer in form'
                                )}
                              </div>
                            </div>
                            <div className="text-right text-sm w-24">
                              <div>{selectedPRForDetails.approved_date || new Date().toLocaleDateString()}</div>
                              <div className="mt-6">{selectedPRForDetails.authorized_date || new Date().toLocaleDateString()}</div>
                              <div className="mt-6">{selectedPRForDetails.reviewed_date || new Date().toLocaleDateString()}</div>
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <span className="font-bold w-16">Through:</span>
                            <div className="flex-1">
                              <div className="border-b border-black pb-1">
                                {detailsActivityMemoData.through_details?.length > 0 ?
                                  detailsActivityMemoData.through_details.map((person, idx) => {
                                    const personName = person.name ||
                                      `${person.first_name || ''} ${person.last_name || ''}`.trim() ||
                                      person.email ||
                                      'Personnel';
                                    return `${personName} (${person.designation || 'Staff'})`;
                                  }).join(', ') :
                                  detailsActivityMemoData.through_details?.length > 0 ?
                                    detailsActivityMemoData.through_details.map(id => id).join(', ') :
                                    'Please select through personnel in form'
                                }
                              </div>
                            </div>
                            <div className="text-right text-sm w-24">
                              <div>{detailsActivityMemoData.requested_date || new Date().toLocaleDateString()}</div>
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <span className="font-bold w-16">From:</span>
                            <div className="flex-1">
                              <div className="border-b border-black pb-1">
                                {selectedPRForDetails.requested_by ? (
                                  `${selectedPRForDetails.requested_by.name ||
                                    `${selectedPRForDetails.requested_by.first_name || ''} ${selectedPRForDetails.requested_by.last_name || ''}`.trim() ||
                                    selectedPRForDetails.requested_by.email ||
                                    'Requester'
                                  } (${selectedPRForDetails.requested_by.designation || 'Staff'})`
                                ) : selectedPRForDetails.requested_by_detail ? (
                                  `${selectedPRForDetails.requested_by_detail.name ||
                                    `${selectedPRForDetails.requested_by_detail.first_name || ''} ${selectedPRForDetails.requested_by_detail.last_name || ''}`.trim() ||
                                    selectedPRForDetails.requested_by_detail.email ||
                                    'Requester'
                                  } (Staff)`
                                ) : (
                                  'Please select requester in form'
                                )}
                              </div>
                            </div>
                            <div className="text-right text-sm w-24">
                              <div>{selectedPRForDetails.date_of_request || selectedPRForDetails.request_date}</div>
                            </div>
                          </div>
                        </div>

                        {/* Budget and Administrative Details */}
                        <div className="grid grid-cols-2 gap-8 mt-6">
                          <div className="space-y-2">
                            <div className="flex gap-4">
                              <span className="font-bold">Budget Line #:</span>
                              <span>
                                {detailsActivityMemoData.budget_line_details?.map(bl => bl.name || bl.module_name || bl.code || bl.module_code).filter(Boolean).join(', ') ||
                                 'N/A'}
                              </span>
                            </div>
                            <div className="flex gap-4">
                              <span className="font-bold">Module:</span>
                              <span>
                                {detailsActivityMemoData.module_details?.map(m => m.name || m.code).filter(Boolean).join(', ') ||
                                 'N/A'}
                              </span>
                            </div>
                            <div className="flex gap-4">
                              <span className="font-bold">Intervention:</span>
                              <span>
                                {detailsActivityMemoData.intervention_areas_details?.map(ia => ia.description || ia.code || ia.name).filter(Boolean).join(', ') ||
                                 'N/A'}
                              </span>
                            </div>
                            <div className="flex gap-4">
                              <span className="font-bold">Cost Grouping #:</span>
                              <span>
                                {detailsActivityMemoData.cost_categories_details?.map(cc => cc.module_name || cc.name || cc.code || cc.module_code).filter(Boolean).join(', ') ||
                                 'N/A'}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex gap-4">
                              <span className="font-bold">FCO#:</span>
                              <span>
                                {detailsActivityMemoData.fconumber_details?.map(fco => fco.module_name || fco.name || fco.module_code || fco.code).filter(Boolean).join(', ') ||
                                 detailsActivityMemoData.activity_detail?.code ||
                                 'N/A'}
                              </span>
                            </div>
                            <div className="flex gap-4">
                              <span className="font-bold">Funding Source:</span>
                              <span>
                                {detailsActivityMemoData.funding_sources_details?.map(fs => fs.name || fs.module_name).filter(Boolean).join(', ') ||
                                 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Date and Subject */}
                        <div className="mt-6">
                          <div className="flex gap-4 mb-4">
                            <span className="font-bold">Date:</span>
                            <span>{detailsActivityMemoData.requested_date || selectedPRForDetails.date_of_request}</span>
                          </div>
                          <div className="flex gap-4 mb-6">
                            <span className="font-bold">Subject:</span>
                            <span className="underline">{detailsActivityMemoData.subject || selectedPRForDetails.title}</span>
                          </div>
                        </div>

                        {/* Main Content */}
                        <div className="mt-6 leading-relaxed text-justify">
                          <p>{detailsActivityMemoData.comment || `
                            This memo seeks approval for the procurement implementation of activities under the ${detailsActivityMemoData.activity || 'program implementation'}.
                            The activities are requesting approval to implement operational activities as approved in budget line ${
                              detailsActivityMemoData.budget_line_details?.map(bl => bl.module_code).join(', ') ||
                              detailsActivityMemoData.budget_line?.join(', ') || '916'
                            } for effective operations in the state for the current reporting period.
                          `}</p>

                          <p className="mt-4">
                            This is therefore a request to approve the sum of
                            <strong> ₦{detailsActivityMemoData.activity_budget?.toLocaleString() ||
                              detailsActivityMemoData.expenses?.reduce((sum, expense) => {
                                const cost = parseFloat(expense.total_cost?.toString() || '0') || 0;
                                return sum + cost;
                              }, 0).toLocaleString() || '0'}</strong> only
                            to be charged to budget line {
                              detailsActivityMemoData.budget_line_details?.map(bl => bl.module_code).join(', ') ||
                              detailsActivityMemoData.budget_line?.join(', ') || '916'
                            } for immediate procurement of listed items/execution of activities for effective operations in the state.
                          </p>

                          <p className="mt-4">
                            Please, attached is the activity budget for your review and approval.
                          </p>

                          <p className="mt-4">Thank you.</p>
                        </div>
                      </div>
                    ) : (
                      /* Fallback using Purchase Request data when no activity memo */
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-blue-800 text-sm text-center">
                            This Purchase Request was created directly (not through Activity Memo flow). Showing Purchase Request details below.
                          </p>
                        </div>

                        {/* Use Purchase Request data */}
                        <div className="space-y-4">
                          {/* To/Through/From Section */}
                          <div className="space-y-3">
                            <div className="flex items-start gap-4">
                              <span className="font-bold w-16">To:</span>
                              <div className="flex-1">
                                <div className="border-b border-black pb-1">
                                  {selectedPRForDetails.approved_by_detail ? (
                                    `${selectedPRForDetails.approved_by_detail.name ||
                                      `${selectedPRForDetails.approved_by_detail.first_name || ''} ${selectedPRForDetails.approved_by_detail.last_name || ''}`.trim() ||
                                      selectedPRForDetails.approved_by_detail.email || 'Approver'
                                    } (MD, AHNI)`
                                  ) : (
                                    'Please select approver in form'
                                  )}
                                </div>
                                <div className="border-b border-black pb-1 mt-2">
                                  {selectedPRForDetails.authorised_by_detail ? (
                                    `${selectedPRForDetails.authorised_by_detail.name ||
                                      `${selectedPRForDetails.authorised_by_detail.first_name || ''} ${selectedPRForDetails.authorised_by_detail.last_name || ''}`.trim() ||
                                      selectedPRForDetails.authorised_by_detail.email || 'Authorizer'
                                    } (Director of Operations, AHNI)`
                                  ) : (
                                    'Please select authorizer in form'
                                  )}
                                </div>
                                <div className="border-b border-black pb-1 mt-2">
                                  {selectedPRForDetails.reviewed_by_detail ? (
                                    `${selectedPRForDetails.reviewed_by_detail.name ||
                                      `${selectedPRForDetails.reviewed_by_detail.first_name || ''} ${selectedPRForDetails.reviewed_by_detail.last_name || ''}`.trim() ||
                                      selectedPRForDetails.reviewed_by_detail.email || 'Reviewer'
                                    } (Director of Finance, AHNI)`
                                  ) : (
                                    'Please select reviewer in form'
                                  )}
                                </div>
                              </div>
                              <div className="text-right text-sm w-24">
                                <div>{selectedPRForDetails.approved_date || selectedPRForDetails.date_of_request}</div>
                                <div className="mt-6">{selectedPRForDetails.authorised_date || selectedPRForDetails.date_of_request}</div>
                                <div className="mt-6">{selectedPRForDetails.reviewed_date || selectedPRForDetails.date_of_request}</div>
                              </div>
                            </div>

                            <div className="flex items-start gap-4">
                              <span className="font-bold w-16">Through:</span>
                              <div className="flex-1">
                                <div className="border-b border-black pb-1">
                                  {selectedPRForDetails.reviewed_by_detail ? (
                                    `${selectedPRForDetails.reviewed_by_detail.name ||
                                      `${selectedPRForDetails.reviewed_by_detail.first_name || ''} ${selectedPRForDetails.reviewed_by_detail.last_name || ''}`.trim() ||
                                      selectedPRForDetails.reviewed_by_detail.email || 'Reviewer'
                                    } (Reviewer)`
                                  ) : (
                                    'Please select reviewer in form'
                                  )}
                                </div>
                              </div>
                              <div className="text-right text-sm w-24">
                                <div>{selectedPRForDetails.date_of_request}</div>
                              </div>
                            </div>

                            <div className="flex items-start gap-4">
                              <span className="font-bold w-16">From:</span>
                              <div className="flex-1">
                                <div className="border-b border-black pb-1">
                                  {selectedPRForDetails.requested_by ? (
                                    `${selectedPRForDetails.requested_by.name ||
                                      `${selectedPRForDetails.requested_by.first_name || ''} ${selectedPRForDetails.requested_by.last_name || ''}`.trim() ||
                                      selectedPRForDetails.requested_by.email ||
                                      'Requester'
                                    } (${selectedPRForDetails.requested_by.designation || 'Staff'})`
                                  ) : selectedPRForDetails.requested_by_detail ? (
                                    `${selectedPRForDetails.requested_by_detail.name ||
                                      `${selectedPRForDetails.requested_by_detail.first_name || ''} ${selectedPRForDetails.requested_by_detail.last_name || ''}`.trim() ||
                                      selectedPRForDetails.requested_by_detail.email ||
                                      'Requester'
                                    } (Staff)`
                                  ) : (
                                    'Please select requester in form'
                                  )}
                                </div>
                              </div>
                              <div className="text-right text-sm w-24">
                                <div>{selectedPRForDetails.date_of_request || selectedPRForDetails.request_date}</div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-8 mt-6">
                            <div className="space-y-2">
                              <div className="flex gap-4">
                                <span className="font-bold">Department:</span>
                                <span>{selectedPRForDetails.requesting_department_detail?.name || 'N/A'}</span>
                              </div>
                              <div className="flex gap-4">
                                <span className="font-bold">Location:</span>
                                <span>{selectedPRForDetails.location_detail?.name || 'N/A'}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex gap-4">
                                <span className="font-bold">Total Amount:</span>
                                <span>
                                  ₦{selectedPRForDetails.items?.reduce((sum: number, item: any) => {
                                    const amount = parseFloat(item.sub_total_amount?.toString() || item.amount?.toString() || "0");
                                    return sum + amount;
                                  }, 0).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6">
                            <div className="flex gap-4 mb-4">
                              <span className="font-bold">Date:</span>
                              <span>{selectedPRForDetails.date_of_request}</span>
                            </div>
                            <div className="flex gap-4 mb-6">
                              <span className="font-bold">Subject:</span>
                              <span className="underline">{selectedPRForDetails.title || 'Purchase Request'}</span>
                            </div>
                          </div>

                          <div className="mt-6 leading-relaxed text-justify">
                            <p>
                              This is a purchase request for {selectedPRForDetails.requesting_department_detail?.name || 'department'} operations.
                              The request is for procurement of {selectedPRForDetails.items?.length || 0} item(s) to be delivered to {selectedPRForDetails.location_detail?.name || 'specified location'}.
                            </p>

                            <p className="mt-4">
                              This is therefore a request to approve the sum of
                              <strong> ₦{selectedPRForDetails.items?.reduce((sum: number, item: any) => {
                                const amount = parseFloat(item.sub_total_amount?.toString() || item.amount?.toString() || "0");
                                return sum + amount;
                              }, 0).toLocaleString()}</strong> for immediate procurement of listed items.
                            </p>

                            <p className="mt-4">
                              Please find the item details in the Purchase Request tab for your review and approval.
                            </p>

                            <p className="mt-4">Thank you.</p>
                          </div>
                        </div>
                      </div>
                    )}

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
                        Activity: {detailsActivityMemoData?.activity || selectedPRForDetails.title || '9.2.2 Anambra State Office Admin Cost Q3(July - September 2024)'}
                      </div>

                      {/* Request Details Grid */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex">
                            <span className="w-24 font-bold bg-gray-200 p-1 border border-black">Request Date:</span>
                            <span className="flex-1 p-1 border border-black">{detailsActivityMemoData?.requested_date || selectedPRForDetails.date_of_request || '15/07/2024'}</span>
                          </div>
                          <div className="flex">
                            <span className="w-24 font-bold bg-gray-200 p-1 border border-black">Location:</span>
                            <span className="flex-1 p-1 border border-black">{detailsActivityMemoData?.location || selectedPRForDetails.location_detail?.name || 'Anambra'}</span>
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
                              {detailsActivityMemoData?.fconumber_details?.map(fco => fco.module_name || fco.name || fco.module_code || fco.code).filter(Boolean).join(', ') ||
                               detailsActivityMemoData?.activity_detail?.code ||
                               'N/A'}
                            </span>
                          </div>
                          <div className="flex">
                            <span className="w-24 font-bold bg-gray-200 p-1 border border-black">Module:</span>
                            <span className="flex-1 p-1 border border-black">
                              {detailsActivityMemoData?.module_details?.map(m => m.name || m.code).filter(Boolean).join(', ') ||
                               'N/A'}
                            </span>
                          </div>
                          <div className="flex">
                            <span className="w-24 font-bold bg-gray-200 p-1 border border-black">Budget Line #:</span>
                            <span className="flex-1 p-1 border border-black">
                              {detailsActivityMemoData?.budget_line_details?.map(bl => bl.name || bl.module_name || bl.code || bl.module_code).filter(Boolean).join(', ') ||
                               'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                        <div className="flex">
                          <span className="w-24 font-bold bg-gray-200 p-1 border border-black">Cost Input #:</span>
                          <span className="flex-1 p-1 border border-black">
                            {detailsActivityMemoData?.cost_inputs_details?.map(ci => ci.module_name || ci.name || ci.code || ci.module_code).filter(Boolean).join(', ') ||
                             'N/A'}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="w-24 font-bold bg-gray-200 p-1 border border-black">Funding Source:</span>
                          <span className="flex-1 p-1 border border-black">
                            {detailsActivityMemoData?.funding_sources_details?.map(fs => fs.name || fs.module_name).filter(Boolean).join(', ') ||
                             'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {detailsActivityMemoData?.expenses && detailsActivityMemoData.expenses.length > 0 ? (
                      (() => {
                        // Detect if this is personnel expenses
                        const isPersonnelExpenses = detailsActivityMemoData.expenses.some(
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
                                {detailsActivityMemoData.expenses.map((expense, index) => (
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
                                    {detailsActivityMemoData.expenses.reduce((sum, expense) => {
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
                                {detailsActivityMemoData.expenses.map((expense, index) => (
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
                                    ₦{detailsActivityMemoData.expenses.reduce((sum, expense) => {
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
                      /* Fallback with sample AHNI expense data */
                      <div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                          <div className="text-center mb-4">
                            <p className="text-yellow-800 mb-2">No Expense data available</p>
                            <p className="text-sm text-yellow-600">No expenses found in the linked Activity Memo. Showing sample AHNI expense structure.</p>
                          </div>
                        </div>

                        <table className="w-full border-collapse border border-black text-xs opacity-75">
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
                            <tr>
                              <td className="border border-black px-1 py-1 text-center">1</td>
                              <td className="border border-black px-2 py-1">Driver (ACD)</td>
                              <td className="border border-black px-1 py-1 text-center">Unit</td>
                              <td className="border border-black px-1 py-1 text-center">1000</td>
                              <td className="border border-black px-2 py-1 text-center">1,500</td>
                              <td className="border border-black px-2 py-1 text-center">1,500,000.00</td>
                            </tr>
                            <tr>
                              <td className="border border-black px-1 py-1 text-center">2</td>
                              <td className="border border-black px-2 py-1">Generator Maintenance</td>
                              <td className="border border-black px-1 py-1 text-center">Unit</td>
                              <td className="border border-black px-1 py-1 text-center">1</td>
                              <td className="border border-black px-2 py-1 text-center">186,500</td>
                              <td className="border border-black px-2 py-1 text-center">186,500.00</td>
                            </tr>
                            <tr>
                              <td className="border border-black px-1 py-1 text-center">3</td>
                              <td className="border border-black px-2 py-1">Office Generator Maintenance (25 units)</td>
                              <td className="border border-black px-1 py-1 text-center">Unit</td>
                              <td className="border border-black px-1 py-1 text-center">25</td>
                              <td className="border border-black px-2 py-1 text-center">6,752</td>
                              <td className="border border-black px-2 py-1 text-center">168,810.00</td>
                            </tr>
                            <tr>
                              <td className="border border-black px-1 py-1 text-center">4</td>
                              <td className="border border-black px-2 py-1">Office Support</td>
                              <td className="border border-black px-1 py-1 text-center">Unit</td>
                              <td className="border border-black px-1 py-1 text-center">3</td>
                              <td className="border border-black px-2 py-1 text-center">3,000</td>
                              <td className="border border-black px-2 py-1 text-center">9,000.00</td>
                            </tr>
                            <tr>
                              <td className="border border-black px-1 py-1 text-center">5</td>
                              <td className="border border-black px-2 py-1">Janitorial Services</td>
                              <td className="border border-black px-1 py-1 text-center">Unit</td>
                              <td className="border border-black px-1 py-1 text-center">3</td>
                              <td className="border border-black px-2 py-1 text-center">180,483</td>
                              <td className="border border-black px-2 py-1 text-center">541,449.00</td>
                            </tr>

                            {/* Overall Total Row */}
                            <tr className="bg-green-200 font-bold">
                              <td colSpan={5} className="border border-black px-2 py-2 text-right">OVERALL TOTAL</td>
                              <td className="border border-black px-2 py-2 text-center">₦ 2,405,759.00</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Signature Section */}
                    <div className="mt-6 space-y-4">
                      <div className="grid grid-cols-3 gap-8 text-sm">
                        <div>
                          <p className="font-bold">Prepared by: {
                            detailsActivityMemoData?.created_by_details?.name ||
                            (selectedPRForDetails.requested_by ? (
                              selectedPRForDetails.requested_by.name ||
                              `${selectedPRForDetails.requested_by.first_name || ''} ${selectedPRForDetails.requested_by.last_name || ''}`.trim() ||
                              selectedPRForDetails.requested_by.email ||
                              'N/A'
                            ) : selectedPRForDetails.requested_by_detail ? (
                              selectedPRForDetails.requested_by_detail.name ||
                              `${selectedPRForDetails.requested_by_detail.first_name || ''} ${selectedPRForDetails.requested_by_detail.last_name || ''}`.trim() ||
                              selectedPRForDetails.requested_by_detail.email ||
                              'N/A'
                            ) : 'N/A')
                          }</p>
                          <div className="mt-2">
                            <p>Sign: _________________________</p>
                            <p className="mt-1">Date: {detailsActivityMemoData?.created_date || selectedPRForDetails.date_of_request}</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-bold">Reviewed by: {
                            detailsActivityMemoData?.reviewed_by_details?.[0]?.name ||
                            (selectedPRForDetails.reviewed_by_detail?.name) ||
                            (selectedPRForDetails.reviewed_by_detail?.first_name && selectedPRForDetails.reviewed_by_detail?.last_name ?
                              `${selectedPRForDetails.reviewed_by_detail.first_name} ${selectedPRForDetails.reviewed_by_detail.last_name}` :
                              selectedPRForDetails.reviewed_by_detail?.email || 'N/A')
                          }</p>
                          <div className="mt-2">
                            <p>Sign: _________________________</p>
                            <p className="mt-1">Date: {detailsActivityMemoData?.reviewed_date || selectedPRForDetails.reviewed_date}</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-bold">Approved by: {
                            detailsActivityMemoData?.approved_by_details?.name ||
                            (selectedPRForDetails.approved_by_detail?.name) ||
                            (selectedPRForDetails.approved_by_detail?.first_name && selectedPRForDetails.approved_by_detail?.last_name ?
                              `${selectedPRForDetails.approved_by_detail.first_name} ${selectedPRForDetails.approved_by_detail.last_name}` :
                              selectedPRForDetails.approved_by_detail?.email || 'N/A')
                          }</p>
                          <div className="mt-2">
                            <p>Sign: _________________________</p>
                            <p className="mt-1">Date: {detailsActivityMemoData?.approved_date || selectedPRForDetails.approved_date}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* Purchase Request Tab - AHNI Purchase Request Form Format */}
                {activeTab === 2 && (
                  <div>
                    {/* AHNI Header with Logo and Contact Details */}
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-20 h-16 border-2 border-black flex items-center justify-center">
                          <img
                            src={(logoPng as any).src || logoPng}
                            alt="AHNI Logo"
                            className="w-16 h-14 object-contain"
                          />
                        </div>
                        <div>
                          <h1 className="text-xl font-bold">Achieving Health Nigeria Initiative (AHNI)</h1>
                          <p className="text-sm">23 Celina Ayom Crescent, Cadastral Zone B09, behind NAF Conference Center, Jabi, Abuja</p>
                          <p className="text-sm">Tel: +234-09-4615555 / +234-09-461500    Fax: +234-09-4615511</p>
                        </div>
                      </div>
                      <h2 className="text-lg font-bold underline">PURCHASE REQUEST FORM</h2>
                    </div>

                    {/* Request Information Grid */}
                    <div className="border border-black p-4 mb-4">
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">Date of Request:</span>
                            <span className="border border-black px-2 py-1 flex-1 text-center">
                              {selectedPRForDetails.date_of_request || selectedPRForDetails.request_date || '4/27/2023'}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">Required Date:</span>
                            <span className="border border-black px-2 py-1 flex-1 text-center">
                              {selectedPRForDetails.date_required || selectedPRForDetails.required_date || '16-May-23'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">Requesting Dept.:</span>
                            <span className="border border-black px-2 py-1 flex-1 text-center">
                              {selectedPRForDetails.requesting_department_detail?.name || 'Admin'}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">Deliver to:</span>
                            <span className="border border-black px-2 py-1 flex-1 text-center">
                              {selectedPRForDetails.location_detail?.name || 'AHNI HQ-Abuja'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Items Table */}
                    <table className="w-full border-collapse border border-black text-sm mb-4">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border border-black px-2 py-3 text-center font-bold">S/N</th>
                          <th className="border border-black px-4 py-3 text-center font-bold">Description of items/services</th>
                          <th className="border border-black px-2 py-3 text-center font-bold">UOM</th>
                          <th className="border border-black px-2 py-3 text-center font-bold">FCO</th>
                          <th className="border border-black px-2 py-3 text-center font-bold">QTY</th>
                          <th className="border border-black px-2 py-3 text-center font-bold">Unit Cost</th>
                          <th className="border border-black px-2 py-3 text-center font-bold">Total Amount =N=</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPRForDetails.items && selectedPRForDetails.items.length > 0 ? (
                          selectedPRForDetails.items.map((item: any, index: number) => (
                            <tr key={index}>
                              <td className="border border-black px-2 py-2 text-center font-bold">{index + 1}</td>
                              <td className="border border-black px-4 py-2">
                                <div className="font-bold">{item.item?.name || item.item_detail?.name}</div>
                                {item.item?.description && (
                                  <div className="text-xs mt-1">{item.item.description}</div>
                                )}
                              </td>
                              <td className="border border-black px-2 py-2 text-center">
                                {item.item?.uom || item.uom || 'Unit'}
                              </td>
                              <td className="border border-black px-2 py-2 text-center">
                                {item.fconumber_details?.[0]?.module_name ||
                                 item.fconumber_details?.[0]?.name ||
                                 item.fconumber_details?.[0]?.module_code ||
                                 item.fconumber_details?.[0]?.code ||
                                 item.fconumber ||
                                 item.fco_number ||
                                 item.fco ||
                                 'N/A'}
                              </td>
                              <td className="border border-black px-2 py-2 text-center">
                                {item.quantity || item.units || '0'}
                              </td>
                              <td className="border border-black px-2 py-2 text-center">
                                ₦{item.unit_cost ? parseFloat(item.unit_cost.toString()).toLocaleString() : '0'}
                              </td>
                              <td className="border border-black px-2 py-2 text-center font-bold">
                                ₦{item.sub_total_amount ? parseFloat(item.sub_total_amount.toString()).toLocaleString() :
                                   item.amount ? parseFloat(item.amount.toString()).toLocaleString() : '0'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          /* Sample data when no items */
                          <>
                            <tr>
                              <td className="border border-black px-2 py-2 text-center font-bold">1</td>
                              <td className="border border-black px-4 py-2">
                                <div className="font-bold">FEEDING</div>
                                <div className="text-xs">Dinner (Day 1)</div>
                                <div className="text-xs">Tea Break (AM & PM) - Day 2</div>
                                <div className="text-xs">Lunch - Day 2</div>
                                <div className="text-xs">Tea Break (AM & PM) - Day 3</div>
                                <div className="text-xs">Lunch - Day 3</div>
                              </td>
                              <td className="border border-black px-2 py-2 text-center">Unit</td>
                              <td className="border border-black px-2 py-2 text-center">004-HOPM</td>
                              <td className="border border-black px-2 py-2 text-center">83</td>
                              <td className="border border-black px-2 py-2 text-center">8,000</td>
                              <td className="border border-black px-2 py-2 text-center font-bold">662,500</td>
                            </tr>
                            <tr>
                              <td className="border border-black px-2 py-2 text-center font-bold">2</td>
                              <td className="border border-black px-4 py-2">
                                <div className="font-bold">ACCOMMODATION</div>
                                <div className="text-xs">Accommodation for participants</div>
                              </td>
                              <td className="border border-black px-2 py-2 text-center">Unit</td>
                              <td className="border border-black px-2 py-2 text-center">004-HOPM</td>
                              <td className="border border-black px-2 py-2 text-center">21</td>
                              <td className="border border-black px-2 py-2 text-center">47,143</td>
                              <td className="border border-black px-2 py-2 text-center font-bold">990,000</td>
                            </tr>
                            <tr>
                              <td className="border border-black px-2 py-2 text-center font-bold">3</td>
                              <td className="border border-black px-4 py-2">
                                <div className="font-bold">HALL RENTAL</div>
                                <div className="text-xs">Hall Rental for 3 days</div>
                              </td>
                              <td className="border border-black px-2 py-2 text-center">Unit</td>
                              <td className="border border-black px-2 py-2 text-center">004-HOPM</td>
                              <td className="border border-black px-2 py-2 text-center">3</td>
                              <td className="border border-black px-2 py-2 text-center">200,000</td>
                              <td className="border border-black px-2 py-2 text-center font-bold">600,000</td>
                            </tr>
                            <tr>
                              <td className="border border-black px-2 py-2 text-center font-bold">4</td>
                              <td className="border border-black px-4 py-2">
                                <div className="font-bold">MEETING MATERIALS</div>
                                <div className="text-xs">Writing Material</div>
                                <div className="text-xs">Branded bags</div>
                                <div className="text-xs">Printed Annual Report</div>
                              </td>
                              <td className="border border-black px-2 py-2 text-center">Unit</td>
                              <td className="border border-black px-2 py-2 text-center">004-HOPM</td>
                              <td className="border border-black px-2 py-2 text-center">34</td>
                              <td className="border border-black px-2 py-2 text-center">19,706</td>
                              <td className="border border-black px-2 py-2 text-center font-bold">670,000</td>
                            </tr>
                          </>
                        )}

                        {/* Total Row */}
                        <tr className="bg-gray-100">
                          <td colSpan={6} className="border border-black px-4 py-3 text-right font-bold text-lg">TOTAL</td>
                          <td className="border border-black px-2 py-3 text-center font-bold text-lg">
                            {selectedPRForDetails.items && selectedPRForDetails.items.length > 0
                              ? `₦${selectedPRForDetails.items.reduce((sum: number, item: any) => {
                                  const amount = parseFloat(item.sub_total_amount?.toString() || item.amount?.toString() || "0");
                                  return sum + amount;
                                }, 0).toLocaleString()}`
                              : selectedPRForDetails.total_amount
                                ? `₦${parseFloat(selectedPRForDetails.total_amount.toString()).toLocaleString()}`
                                : '₦0'
                            }
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Special Instructions */}
                    <div className="mb-6">
                      <div className="flex items-start gap-2">
                        <span className="font-bold">Special instructions/specification:</span>
                        <span className="border-b border-black px-2 flex-1 min-h-[24px]">
                          {selectedPRForDetails.title || 'AHNI BOT Retreat'}
                        </span>
                      </div>
                    </div>

                    {/* Signature Section */}
                    <div className="border border-black">
                      <table className="w-full text-sm">
                        <tbody>
                          {/* Requested By */}
                          <tr>
                            <td className="border border-black px-4 py-3 font-bold w-1/6">Requested By:</td>
                            <td className="border border-black px-4 py-3 w-1/4">
                              <div>
                                <span className="font-bold">Name:</span>
                                <span className="ml-2">
                                  {selectedPRForDetails.requested_by ? (
                                    selectedPRForDetails.requested_by.name ||
                                    `${selectedPRForDetails.requested_by.first_name || ''} ${selectedPRForDetails.requested_by.last_name || ''}`.trim() ||
                                    selectedPRForDetails.requested_by.email ||
                                    'Requester'
                                  ) : selectedPRForDetails.requested_by_detail ? (
                                    selectedPRForDetails.requested_by_detail.name ||
                                    `${selectedPRForDetails.requested_by_detail.first_name || ''} ${selectedPRForDetails.requested_by_detail.last_name || ''}`.trim() ||
                                    selectedPRForDetails.requested_by_detail.email ||
                                    'Requester'
                                  ) : (
                                    'N/A'
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="border border-black px-4 py-3 w-1/4">
                              <span className="font-bold">Signature:</span>
                              <span className="ml-8">_________________________</span>
                            </td>
                            <td className="border border-black px-4 py-3 w-1/4">
                              <span className="font-bold">Date:</span>
                              <span className="ml-2">{selectedPRForDetails.date_of_request || selectedPRForDetails.request_date || ''}</span>
                            </td>
                          </tr>

                          {/* Reviewed By */}
                          <tr>
                            <td className="border border-black px-4 py-3 font-bold">Reviewed By:</td>
                            <td className="border border-black px-4 py-3">
                              <div>
                                <span className="font-bold">Name:</span>
                                <span className="ml-2">
                                  {selectedPRForDetails.reviewed_by_detail ? (
                                    selectedPRForDetails.reviewed_by_detail.name ||
                                    `${selectedPRForDetails.reviewed_by_detail.first_name || ''} ${selectedPRForDetails.reviewed_by_detail.last_name || ''}`.trim() ||
                                    selectedPRForDetails.reviewed_by_detail.email ||
                                    'Reviewer'
                                  ) : (
                                    'N/A'
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="border border-black px-4 py-3">
                              <span className="font-bold">Signature:</span>
                              <span className="ml-8">_________________________</span>
                            </td>
                            <td className="border border-black px-4 py-3">
                              <span className="font-bold">Date:</span>
                              <span className="ml-2">{selectedPRForDetails.reviewed_date || ''}</span>
                            </td>
                          </tr>

                          {/* Authorised By */}
                          <tr>
                            <td className="border border-black px-4 py-3 font-bold">Authorised By:</td>
                            <td className="border border-black px-4 py-3">
                              <div>
                                <span className="font-bold">Name:</span>
                                <span className="ml-2">
                                  {(selectedPRForDetails.authorised_by_detail || selectedPRForDetails.authorized_by_detail) ? (
                                    (selectedPRForDetails.authorised_by_detail || selectedPRForDetails.authorized_by_detail).name ||
                                    `${(selectedPRForDetails.authorised_by_detail || selectedPRForDetails.authorized_by_detail).first_name || ''} ${(selectedPRForDetails.authorised_by_detail || selectedPRForDetails.authorized_by_detail).last_name || ''}`.trim() ||
                                    (selectedPRForDetails.authorised_by_detail || selectedPRForDetails.authorized_by_detail).email ||
                                    'Authorizer'
                                  ) : (
                                    'N/A'
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="border border-black px-4 py-3">
                              <span className="font-bold">Signature:</span>
                              <span className="ml-8">_________________________</span>
                            </td>
                            <td className="border border-black px-4 py-3">
                              <span className="font-bold">Date:</span>
                              <span className="ml-2">{selectedPRForDetails.authorized_date || ''}</span>
                            </td>
                          </tr>

                          {/* Approved By */}
                          <tr>
                            <td className="border border-black px-4 py-3 font-bold">Approved By:</td>
                            <td className="border border-black px-4 py-3">
                              <div>
                                <span className="font-bold">Name:</span>
                                <span className="ml-2">
                                  {selectedPRForDetails.approved_by_detail ? (
                                    selectedPRForDetails.approved_by_detail.name ||
                                    `${selectedPRForDetails.approved_by_detail.first_name || ''} ${selectedPRForDetails.approved_by_detail.last_name || ''}`.trim() ||
                                    selectedPRForDetails.approved_by_detail.email ||
                                    'Approver'
                                  ) : (
                                    'N/A'
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="border border-black px-4 py-3">
                              <span className="font-bold">Signature:</span>
                              <span className="ml-8">_________________________</span>
                            </td>
                            <td className="border border-black px-4 py-3">
                              <span className="font-bold">Date:</span>
                              <span className="ml-2">{selectedPRForDetails.approved_date || ''}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
                    onClick={() => setActiveTab(Math.min(2, activeTab + 1))}
                    disabled={activeTab === 2}
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
                        link.download = `${['Activity_Memo', 'Expense_Table', 'Purchase_Request'][activeTab]}_${selectedPRForDetails.ref_number}.html`;
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
    </section>
  );
}

export default PurchaseRequest;
