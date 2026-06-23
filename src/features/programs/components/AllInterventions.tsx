import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import TableAction from "@/components/TableAction";
import { LoadingSpinner } from "@/components/Loading";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import {
  useDeleteInterventionArea,
  useGetAllInterventionAreas,
} from "@/features/modules/controllers/program/interventionAreaController";
import { Upload } from "lucide-react";
import BulkUploadDialog from "@/components/BulkUpload/BulkUploadDialog";

export default function AllInterventions() {
  const [page, setPage] = useState(1);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  const { data: interventions, isFetching, refetch } = useGetAllInterventionAreas({
    page,
    size: 20,
    search: "",
  });
  const dispatch = useAppDispatch();

  const [deleteInterventionArea, { isLoading: isDeleteLoading }] =
    useDeleteInterventionArea();

  const onSubmit = async (id: string) => {
    try {
      await deleteInterventionArea(id);
      toast.success("Deleted Successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error?.message ?? "Something went wrong");
    }
  };

  const onUpdate = (item: any) => {
    dispatch(
      openDialog({
        type: DialogType.AddInterventionArea,
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
        <h1 className='text-error font-semibold text-sm'>
          Intervention Areas
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
                  type: DialogType.AddInterventionArea,
                  dialogProps: {
                    header: "Add Intervention Area",
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
        apiEndpoint="/procurements/intervention-areas"
        title="Intervention Areas"
        onUploadComplete={() => {
          refetch();
          setBulkUploadOpen(false);
        }}
      />
      <div>
        <div className='flex text-gray-text font-semibold text-sm mb-10'>
          <h1 className='flex-1'>Code</h1>
          <h1 className='flex-1'>Description</h1>
          <h1 className='flex-1'></h1>
        </div>

        {isFetching || isDeleteLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {interventions?.data?.results.map((item) => (
              <div
                key={item.id}
                className='flex justify-between mt-6 text-gray-text font-normal text-xs'
              >
                <p className='flex-1'>{item.code}</p>
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
          total={interventions?.data.pagination.count ?? 0}
          itemsPerPage={interventions?.data.pagination.page_size ?? 0}
          onChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
}
