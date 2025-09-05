import { Button } from "components/ui/button";

import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "components/atoms/TableAction";
import { LoadingSpinner } from "components/Loading";
import {
  useDeleteSupervisionCategory,
  useGetAllSupervisionCategory,
} from "@/features/modules/controllers/program/supervisionCategoryController";
import { useState } from "react";
import Pagination from "components/Pagination";

export default function AllSupervisionCategory() {
  const [page, setPage] = useState(1);

  const { data: supervisionCategory, isFetching } =
    useGetAllSupervisionCategory({
      page,
      size: 20,
    });

  const handleChangePagination = (page: number) => {
    setPage(page);
  };

  const dispatch = useAppDispatch();

  const [deleteSupervisionCategory, { isLoading: isDeleteLoading }] =
    useDeleteSupervisionCategory();

  const onSubmit = async (id: string) => {
    try {
      await deleteSupervisionCategory(id);
      toast.success("Deleted Successfully");
    } catch (error) {
      toast.error("Error deleteing item");
    }
  };

  const onUpdate = (item: any) => {
    dispatch(
      openDialog({
        type: DialogType.AddSupervisionCategory,
        dialogProps: {
          header: "Update Supervision Category",
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
          Supervision Evaluation Category
        </h1>
        <Button
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.AddSupervisionCategory,
                dialogProps: {
                  header: "Add Supervision Evaluation Category",
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
          <h1 className='flex-1'></h1>
        </div>
        {isFetching || isDeleteLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            {supervisionCategory?.data?.results?.map((item) => (
              <div
                key={item.id}
                className='flex justify-between mt-6 text-[#756D6D] font-normal text-xs'
              >
                <p className='flex-1'>{item.name}</p>
                <p className='flex-1'>{item.description ?? ""}</p>
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
          total={supervisionCategory?.data.pagination.count ?? 0}
          itemsPerPage={supervisionCategory?.data.pagination.page_size ?? 0}
          onChange={handleChangePagination}
        />
      </div>
    </div>
  );
}
