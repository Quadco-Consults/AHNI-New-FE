import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "components/atoms/TableAction";
import { LoadingSpinner } from "components/Loading";
import { useState } from "react";
import {
  useDeleteItem,
  useGetAllItems,
} from "@/features/modules/controllers/config/itemController";
import Pagination from "components/Pagination";

export default function AllItems() {
  const [page, setPage] = useState(1);

  const { data: item, isFetching } = useGetAllItems({
    page,
    size: 20,
  });

  const dispatch = useAppDispatch();

  const [deleteItem, { isLoading: isDeleteLoading }] = useDeleteItem();

  const onSubmit = async (id: string) => {
    try {
      await deleteItem(id);
      toast.success("Deleted Successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? error.message ?? "Something went wrong");
    }
  };

  const onUpdate = (item: any) => {
    dispatch(
      openDialog({
        type: DialogType.AddItems,
        dialogProps: {
          header: "Update Item",
          data: item,
          type: "update",
        },
      })
    );
  };

  return (
    <div>
      <div className='flex items-center justify-between py-6 mb-6'>
        <h1 className='text-[#D92D20] font-semibold text-sm'>Items</h1>

        <Button
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.AddItems,
                dialogProps: {
                  header: "Add Item",
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
          <h1 className='flex-1'>UOM</h1>
          <h1 className='flex-1'>Category</h1>
          <h1 className='flex-1'></h1>
        </div>

        {isFetching || isDeleteLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            {item?.data?.results?.map((itemData: any) => (
              <div
                key={itemData.id}
                className='flex justify-between mt-6 text-[#756D6D] font-normal text-xs'
              >
                <p className='flex-1'>{itemData.name}</p>
                <p className='flex-1'>{itemData.description || "N/A"}</p>
                <p className='flex-1'>{itemData.uom}</p>
                <p className='flex-1'>{itemData.category?.name}</p>
                <div className='flex-1'>
                  <TableAction
                    update
                    removeView
                    action={() => onSubmit(itemData.id)}
                    updateAction={() => onUpdate(itemData)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          total={item?.data?.pagination?.count ?? 0}
          itemsPerPage={item?.data?.pagination?.page_size ?? 0}
          onChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
}
