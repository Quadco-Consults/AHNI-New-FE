import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import TableAction from "@/components/TableAction";
import { LoadingSpinner } from "@/components/Loading";
import { useState } from "react";
import {
  useDeleteFinancialYearMutation,
  useGetAllFinancialYearsQuery,
} from "@/features/modules/controllers/config/financialYearController";
import Pagination from "@/components/Pagination";
import { Upload } from "lucide-react";
import BulkUploadDialog from "@/components/BulkUpload/BulkUploadDialog";

export default function AllFinancialYear() {
  const [page, setPage] = useState(1);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  const { data: financialYear, isFetching, refetch } = useGetAllFinancialYearsQuery({
    page,
    size: 20,
  });

  const dispatch = useAppDispatch();

  const [deleteFinancialYear, { isLoading: isDeleteLoading }] =
    useDeleteFinancialYearMutation();

  const onSubmit = async (id: string) => {
    try {
      await deleteFinancialYear(id);
      toast.success("Deleted Successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
    }
  };

  const onUpdate = (item: any) => {
    dispatch(
      openDialog({
        type: DialogType.AddFinancialYear,
        dialogProps: {
          header: "Update Financial Year",
          data: item,
          type: "update",
        },
      })
    );
  };
  return (
    <div>
      <div className='flex items-center justify-between py-6 mb-6'>
        <h1 className='text-[#D92D20] font-semibold text-sm'>Financial Year</h1>

        <div className="flex items-center gap-4">
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
                  type: DialogType.AddFinancialYear,
                  dialogProps: {
                    header: "Add Financial Year",
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
        apiEndpoint="/config/financial-year"
        title="Financial Years"
        onUploadComplete={() => {
          refetch();
          setBulkUploadOpen(false);
        }}
      />
      <div>
        <div className='flex justify-between text-[#756D6D] font-semibold text-sm border-b border-gray-300 pb-4'>
          <h1 className='flex-1'>Year</h1>
          {/* <h1 className="flex-1">Dynamic Order</h1> */}
          {/* <h1 className="flex-1">Current</h1> */}
          <h1 className='flex-1'></h1>
        </div>

        {isFetching || isDeleteLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            {financialYear?.data?.results?.map((item) => (
              <div
                key={item.id}
                className='flex justify-between mt-6 text-[#756D6D] font-normal text-xs'
              >
                <p className='flex-1'>{item.year}</p>
                {/* <p className="flex-1">{item.dyanmic_order}</p> */}
                {/* <p className="flex-1">{item.current}</p> */}
                <div className='flex-1'>
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
          total={financialYear?.data.pagination.count ?? 0}
          itemsPerPage={financialYear?.data.pagination.page_size ?? 0}
          onChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
}
