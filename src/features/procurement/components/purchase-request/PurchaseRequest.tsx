import Link from "next/link";
import Card from "components/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { useGetPurchaseRequests, useDeletePurchaseRequest } from "@/features/procurement/controllers/purchaseRequestController";
import { PurchaseRequestResultsData } from "definations/procurement-types/purchase-request";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import PencilIcon from "components/icons/PencilIcon";
import ApprovalWorkflow from "./ApprovalWorkflow";
import ApprovalHistory from "./ApprovalHistory";
import { useGetUserProfile } from "@/features/auth/controllers/userController";
import { useGetActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { useState } from "react";

function PurchaseRequest({
  status = "pending",
}: {
  status: "pending" | "approved";
}) {
  const dispatch = useAppDispatch();
  const [selectedPR, setSelectedPR] = useState<PurchaseRequestResultsData | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isLoading, refetch } = useGetPurchaseRequests({});
  const { data: currentUser } = useGetUserProfile();

  // Handle status updates from approval workflow
  const handleStatusUpdate = () => {
    refetch();
    setRefreshKey(prev => prev + 1);
  };

  // Get activity memo data for selected PR
  const activityMemoId = selectedPR?.request_memo;
  const { data: activityMemoData } = useGetActivityMemo(activityMemoId as string, !!activityMemoId);

  // Filter and sort results based on status
  const filteredAndSortedResults = data?.data?.results
    ?.slice()
    .filter((item) => {
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
        console.log(error);
      }
    };

    return (
      <div className='flex items-center gap-2'>
        {/* Quick access to details */}
        <Link href={`/dashboard/procurement/purchase-request/${data?.id}/details`}>
          <Button variant='ghost' size='sm' className='text-blue-600 hover:text-blue-800'>
            <EyeIcon />
          </Button>
        </Link>

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
                  className='w-full'
                  href={`/dashboard/procurement/purchase-request/${data?.id}/details`}
                >
                  <Button
                    className='flex w-full items-center justify-start gap-2'
                    variant='ghost'
                  >
                    <EyeIcon />
                    View Details
                  </Button>
                </Link>

                {data?.request_memo && (
                  <Link
                    className='w-full'
                    href={`/dashboard/procurement/purchase-request/preview-letter?id=${data?.request_memo}&request=${data?.id}`}
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

                <Button
                  className='flex w-full items-center justify-start gap-2'
                  variant='ghost'
                  onClick={() => setSelectedPR(data)}
                >
                  <EyeIcon />
                  View Workflow
                </Button>
                {status === "approved" && (
                  <Button
                    className='flex w-full items-center justify-start gap-2'
                    variant='ghost'
                    onClick={() => {
                      dispatch(
                        openDialog({
                          type: DialogType.AssignToModal,
                          // dialogProps: { id, status },
                        })
                      );
                    }}
                  >
                    Assign to
                  </Button>
                )}
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

                <Button
                  className='flex w-full items-center justify-start gap-2'
                  variant='ghost'
                  onClick={deletePurchaseRequestHandler}
                >
                  <DeleteIcon />
                  delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </>
      </div>
    );
  };

  // Get counts for display
  const totalCount = data?.data?.results?.length || 0;
  const currentTabCount = filteredAndSortedResults?.length || 0;

  // Debug logging
  console.log(`=== ${status.toUpperCase()} TAB DEBUG ===`);
  console.log("Total purchase requests:", totalCount);
  console.log("Filtered count:", currentTabCount);
  console.log("Raw data statuses:", data?.data?.results?.map(item => ({ id: item.id, status: item.status })));
  console.log("Filtered items:", filteredAndSortedResults?.map(item => ({ id: item.id, status: item.status })));

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
        <Link className='w-fit' href="/dashboard/procurement/purchase-request/activity-memo">
          <Button className='flex gap-2 py-6'>
            <AddSquareIcon />
            Activity Memo
          </Button>
        </Link>
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
    </section>
  );
}

export default PurchaseRequest;
