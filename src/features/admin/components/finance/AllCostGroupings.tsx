import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "components/atoms/TableAction";
import { LoadingSpinner } from "components/Loading";
import { useState } from "react";
import { useDeleteCostInputMutation } from "@/features/modules/controllers/finance/costInputController";
import Pagination from "components/Pagination";
import { useGetAllCostGroupingsQuery } from "@/features/modules/controllers/finance/costGroupingController";

export default function AllCostGroupings() {
  const [page, setPage] = useState(1);

  const { data: costGrouping, isFetching } = useGetAllCostGroupingsQuery({
    page,
    size: 20,
  });

  const [deleteCostInput, { isLoading: isDeleteLoading }] =
    useDeleteCostInputMutation();

  const dispatch = useAppDispatch();

  const onSubmit = async (id: string) => {
    try {
      await deleteCostInput(id);
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
        type: DialogType.AddCostInput,
        dialogProps: {
          header: "Update Cost Input",
          data: item,
          type: "update",
        },
      })
    );
  };
  return (
    <div>
      <div className='flex items-center justify-between py-6 mb-6'>
        <h1 className='text-[#D92D20] font-semibold text-sm'>Cost Input</h1>

        <Button
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.AddCostGrouping,
                dialogProps: {
                  header: "Add Cost Grouping",
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
        <div className='flex justify-between text-[#756D6D] font-semibold text-sm border-b border-gray-300 pb-4'>
          <h1 className='flex-1'>Name</h1>
          <h1 className='flex-1'>Description</h1>
          <h1 className='flex-1'>Code</h1>
          <h1 className='flex-1'></h1>
        </div>

        {isFetching || isDeleteLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            {costGrouping?.data?.results?.map((item) => (
              <div
                key={item.id}
                className='flex justify-between mt-6 text-[#756D6D] font-normal text-xs'
              >
                <p className='flex-1'>{item.name}</p>
                <p className='flex-1'>{item.description || "N/A"}</p>
                <p className='flex-1'>{item.code}</p>
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
          total={costGrouping?.data.pagination.count ?? 0}
          itemsPerPage={costGrouping?.data.pagination.page_size ?? 0}
          onChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
}
