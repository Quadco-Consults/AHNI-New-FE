import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "components/atoms/TableAction";
import { LoadingSpinner } from "components/Loading";
import {
  useDeleteAssetTypeMutation,
  useGetAllAssetTypeQuery,
} from "@/features/modules/controllers/admin/assetTypeController";
import { useState } from "react";
import Pagination from "components/Pagination";

export default function AllAssetTypes() {
  const [page, setPage] = useState(1);

  const { data: assetType, isFetching } = useGetAllAssetTypeQuery({
    page,
    size: 20,
  });

  const dispatch = useAppDispatch();

  const [deleteAssetTypes, { isLoading: isDeleteLoading }] =
    useDeleteAssetTypeMutation();

  const onSubmit = async (id: string) => {
    try {
      await deleteAssetTypes(id);
      toast.success("Deleted Successfully");
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  const onUpdate = (item: any) => {
    dispatch(
      openDialog({
        type: DialogType.AddAssetTypes,
        dialogProps: {
          header: "Update Asset Types",
          data: item,
          type: "update",
        },
      })
    );
  };
  return (
    <div>
      <div className='flex items-center justify-between py-6 mb-6'>
        <h1 className='text-[#D92D20] font-semibold text-sm'>Asset Types</h1>

        <Button
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.AddAssetTypes,
                dialogProps: {
                  header: "Add Asset Types",
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
        <div className='flex justify-between text-[#756D6D] font-semibold text-sm mb-10'>
          <h1 className='flex-1'>Name</h1>
          <h1 className='flex-1'>Manufacturer</h1>
          <h1 className='flex-1'>Model</h1>
          <h1 className='flex-1'>Serial Number</h1>
          <h1 className='flex-1'></h1>
        </div>

        {isFetching || isDeleteLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            {assetType?.data?.results.map((item) => {
              return (
                <div
                  key={item.id}
                  className='flex justify-between mt-6 text-[#756D6D] font-normal text-xs'
                >
                  <p className='flex-1'>{item.name}</p>
                  <p className='flex-1'>{item.manufacturer}</p>
                  <p className='flex-1'>{item.model}</p>
                  <p className='flex-1'>{item.serial_number}</p>
                  <div className='flex-1'>
                    <TableAction
                      update
                      removeView
                      action={() => onSubmit(item.id)}
                      updateAction={() => onUpdate(item)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Pagination
          total={assetType?.data.pagination.count ?? 0}
          itemsPerPage={assetType?.data.pagination.page_size ?? 0}
          onChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
}
