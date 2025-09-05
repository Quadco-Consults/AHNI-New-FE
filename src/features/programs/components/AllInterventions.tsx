import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "components/atoms/TableAction";
import { LoadingSpinner } from "components/Loading";
import { useState } from "react";
import Pagination from "components/Pagination";
import {
  useDeleteInterventionArea,
  useGetAllInterventionAreas,
} from "@/features/modules/controllers/program/interventionAreaController";

export default function AllInterventions() {
  const [page, setPage] = useState(1);

  const { data: interventions, isFetching } = useGetAllInterventionAreas({
    page,
    size: 20,
    search: "",
  });
  const dispatch = useAppDispatch();

  const { deleteInterventionArea: deleteIntervention, isLoading: isDeleteLoading } =
    useDeleteInterventionArea();

  const onSubmit = async (id: string) => {
    try {
      await deleteIntervention(id);
      toast.success("Deleted Successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? error.message ?? "Something went wrong");
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
        <h1 className='text-[#D92D20] font-semibold text-sm'>
          Intervention Areas
        </h1>
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
          className='gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-[#FFFFFF] text-[#DEA004] border-[1px] border-[#C7CBD5]'
          size='sm'
        >
          Click to add New
        </Button>
      </div>
      <div>
        <div className='flex text-[#756D6D] font-semibold text-sm mb-10'>
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
                className='flex justify-between mt-6 text-[#756D6D] font-normal text-xs'
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
