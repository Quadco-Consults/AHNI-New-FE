import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import TableAction from "@/components/TableAction";
import { LoadingSpinner } from "@/components/Loading";
import { useState } from "react";
import {
  useDeleteChartAccountMutation,
  useGetAllChartAccountsQuery,
} from "@/features/modules/controllers/finance/chartAccountController";
import Pagination from "@/components/Pagination";
import { Upload } from "lucide-react";
import BulkUploadDialog from "@/components/BulkUpload/BulkUploadDialog";

export default function AllChartAccounts() {
  const [page, setPage] = useState(1);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  const { data: chartAccount, isFetching, refetch } = useGetAllChartAccountsQuery({
    page,
    size: 20,
  });

  const [deleteChartAccount, { isLoading: isDeleteLoading }] =
    useDeleteChartAccountMutation();

  const dispatch = useAppDispatch();

  const onSubmit = async (id: string) => {
    try {
      await deleteChartAccount(id);
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
        type: DialogType.AddChartsOfAccounts,
        dialogProps: {
          header: "Update Charts of Account",
          data: item,
          type: "update",
        },
      })
    );
  };
  return (
    <div>
      <div className='flex items-center justify-between py-6 mb-6'>
        <h1 className='text-error font-semibold text-sm'>
          Charts of Account
        </h1>

        <div className='flex gap-2'>
          <Button
            onClick={() => setBulkUploadOpen(true)}
            variant='outline'
            className='gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-white text-success border-[1px] border-gray-border'
            size='sm'
          >
            <Upload size={16} />
            Bulk Upload
          </Button>
          <Button
            onClick={() =>
              dispatch(
                openDialog({
                  type: DialogType.AddChartsOfAccounts,
                  dialogProps: {
                    header: "Add Chart of Account",
                  },
                })
              )
            }
            variant='outline'
            className='gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-white text-yellow-darker border-[1px] border-gray-border'
            size='sm'
          >
            Click to add New
          </Button>
        </div>
      </div>

      <BulkUploadDialog
        open={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        apiEndpoint="/finance/charts-of-account"
        title="Chart of Accounts"
        onUploadComplete={() => {
          refetch();
          setBulkUploadOpen(false);
        }}
      />
      <div>
        <div className='flex justify-between text-gray-text font-semibold text-sm border-b border-gray-300 pb-4'>
          <h1 className='flex-1'>Account Code</h1>
          <h1 className='flex-1'>Account Name</h1>
          <h1 className='flex-1'>Account Type</h1>
          <h1 className='flex-1'>Description</h1>
          <h1 className='flex-1'></h1>
        </div>

        {isFetching || isDeleteLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            {chartAccount?.data?.results?.map((item) => (
              <div
                key={item.id}
                className='flex justify-between mt-6 text-gray-text font-normal text-xs'
              >
                <p className='flex-1'>{item.account_code}</p>
                <p className='flex-1'>{item.account_name}</p>
                <p className='flex-1'>{item.account_type || "N/A"}</p>
                <p className='flex-1'>{item.description || "N/A"}</p>
                <div className='flex-1'>
                  <TableAction
                    update
                    removeView
                    action={() => onSubmit(item.id)}
                    updateAction={() => onUpdate(item)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          total={chartAccount?.data.pagination.count ?? 0}
          itemsPerPage={chartAccount?.data.pagination.page_size ?? 0}
          onChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
}
