import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import TableAction from "@/components/TableAction";
import { LoadingSpinner } from "@/components/Loading";
import {
  useDeleteRiskCategory,
  useGetAllRiskCategory,
} from "@/features/modules/controllers/program/riskCategoryController";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import { Upload } from "lucide-react";
import BulkUploadDialog from "@/components/BulkUpload/BulkUploadDialog";

export default function AllRiskCategory() {
  const [page, setPage] = useState(1);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  const { data: riskCategory, isFetching, refetch } = useGetAllRiskCategory({
    page,
    size: 20,
  });
  const dispatch = useAppDispatch();

  const [deleteRiskCategory, { isLoading: isDeleteLoading }] =
    useDeleteRiskCategory();

  const onSubmit = async (id: string) => {
    try {
      await deleteRiskCategory(id);
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
        type: DialogType.AddRiskCategory,
        dialogProps: {
          header: "Update Risk Category",
          data: item,
          type: "update",
        },
      })
    );
  };
  return (
    <div>
      <div className='flex justify-between items-center py-6 mb-6'>
        <h1 className='text-[#D92D20] font-semibold text-sm'>Risk Categories</h1>
        <div className='flex gap-2'>
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
                  type: DialogType.AddRiskCategory,
                  dialogProps: {
                    header: "Add Risk Category",
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
        apiEndpoint="/programs/configs/risk-categories"
        title="Risk Categories"
        onUploadComplete={() => {
          refetch();
          setBulkUploadOpen(false);
        }}
      />
      <div>
        <div className='flex text-[#756D6D] font-semibold text-sm mb-10'>
          <h1 className='flex-1'>Name</h1>
          <h1 className='flex-1'>Description</h1>
          <h1 className='flex-1'></h1>
        </div>

        {isFetching || isDeleteLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {riskCategory?.data?.results.map((item) => (
              <div
                key={item.id}
                className='flex justify-between mt-6 text-[#756D6D] font-normal text-xs'
              >
                <p className='flex-1'>{item.name}</p>
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
          </>
        )}

        <Pagination
          total={riskCategory?.data.pagination.count ?? 0}
          itemsPerPage={riskCategory?.data.pagination.page_size ?? 0}
          onChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
}
