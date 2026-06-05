import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dailogs";
import TableAction from "@/components/TableAction";
import { LoadingSpinner } from "@/components/Loading";
import {
  useDeleteApprovalThresholdMutation,
  useGetAllApprovalThresholdsManager,
} from "@/features/modules/controllers/config/approvalThresholdController";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import { Search, Upload } from "lucide-react";
import BulkUploadDialog from "@/components/BulkUpload/BulkUploadDialog";

export default function AllApprovalThresholds() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [approvalLevel, setApprovalLevel] = useState("");
  const [isActive, setIsActive] = useState("");
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  const { data: thresholds, isFetching, refetch } = useGetAllApprovalThresholdsManager({
    page,
    size: 20,
    search,
    transaction_type: transactionType,
    approval_level: approvalLevel,
    is_active: isActive,
  });

  const dispatch = useAppDispatch();

  const [deleteThreshold, { isLoading: isDeleteLoading }] =
    useDeleteApprovalThresholdMutation();

  const onSubmit = async (id: string) => {
    try {
      await deleteThreshold(id);
      toast.success("Threshold Deleted Successfully");
      refetch();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
    }
  };

  const onUpdate = (item: any) => {
    dispatch(
      openDialog({
        type: DialogType.AddApprovalThreshold,
        dialogProps: {
          header: "Update Approval Threshold",
          data: item,
          type: "update",
        },
      })
    );
  };

  const formatAmount = (amount: string | null) => {
    if (!amount) return "∞";
    return `₦${parseFloat(amount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div>
      <div className='flex items-center justify-between py-6 mb-6'>
        <h1 className='text-[#D92D20] font-semibold text-sm'>Approval Thresholds</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-stretch gap-2 border border-gray-300 rounded-md shadow-sm px-4 py-2 w-[350px]">
            <Search size={20} className="text-gray-500" />
            <input
              className="w-full text-sm outline-none rounded-none border-none text-md h-[20px]"
              placeholder="Search thresholds..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <Button
            onClick={() => setBulkUploadOpen(true)}
            variant='outline'
            className='gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-[#FFFFFF] text-[#10B981] border-[1px] border-[#C7CBD5]'
            size='sm'
          >
            <Upload size={16} />
            Bulk Upload
          </Button>

          <Button
            onClick={() =>
              dispatch(
                openDialog({
                  type: DialogType.AddApprovalThreshold,
                  dialogProps: {
                    header: "Add Approval Threshold",
                  },
                })
              )
            }
            variant='outline'
            className='gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-[#FFFFFF] text-[#DEA004] border-[1px] border-[#C7CBD5]'
            size='sm'
          >
            Click to add New
          </Button>
        </div>
      </div>

      <BulkUploadDialog
        open={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        apiEndpoint="/config/approval-thresholds"
        title="Approval Thresholds"
        onUploadComplete={() => {
          refetch();
          setBulkUploadOpen(false);
        }}
      />

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-600">Transaction Type</label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={transactionType}
            onChange={(e) => {
              setTransactionType(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Types</option>
            <option value="PURCHASE_REQUEST">Purchase Request</option>
            <option value="PAYMENT_REQUEST">Payment Request</option>
            <option value="PURCHASE_ORDER">Purchase Order</option>
            <option value="EXPENSE_AUTHORIZATION">Expense Authorization</option>
            <option value="TRAVEL_EXPENSE">Travel Expense Report</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-600">Approval Level</label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={approvalLevel}
            onChange={(e) => {
              setApprovalLevel(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Levels</option>
            <option value="STATE_HEAD">State Head</option>
            <option value="DIRECTOR">Director</option>
            <option value="MD">Managing Director</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-600">Status</label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={isActive}
            onChange={(e) => {
              setIsActive(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <div className='flex justify-between text-[#756D6D] font-semibold text-sm border-b border-gray-300 pb-4'>
          <h1 className='flex-[1.2]'>Transaction Type</h1>
          <h1 className='flex-1'>Approval Level</h1>
          <h1 className='flex-1'>Position</h1>
          <h1 className='flex-[0.8]'>Min Amount</h1>
          <h1 className='flex-[0.8]'>Max Amount</h1>
          <h1 className='flex-1'>Location</h1>
          <h1 className='flex-[0.5]'>Status</h1>
          <h1 className='flex-[0.6]'></h1>
        </div>

        {isFetching || isDeleteLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            {thresholds?.data?.results?.map((item) => (
              <div
                key={item.id}
                className='flex justify-between mt-6 text-[#756D6D] font-normal text-xs items-center'
              >
                <p className='flex-[1.2]'>{item.transaction_type_display}</p>
                <p className='flex-1'>{item.approval_level_display}</p>
                <p className='flex-1'>{item.position_name}</p>
                <p className='flex-[0.8]'>{formatAmount(item.min_amount)}</p>
                <p className='flex-[0.8]'>{formatAmount(item.max_amount)}</p>
                <p className='flex-1'>{item.location_name || "System-wide"}</p>
                <div className='flex-[0.5]'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className='flex-[0.6]'>
                  <TableAction
                    update
                    removeView
                    action={() => {
                      onSubmit(item.id);
                    }}
                    updateAction={() => onUpdate(item)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          total={thresholds?.data.pagination.count ?? 0}
          itemsPerPage={thresholds?.data.pagination.page_size ?? 0}
          onChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
}
