import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "components/atoms/TableAction";
import { LoadingSpinner } from "components/Loading";
import { useState } from "react";
import {
  useDeleteLocationMutation,
  useGetAllLocationsQuery,
} from "@/features/modules/controllers/config/locationController";
import Pagination from "components/Pagination";

export default function AllLocations() {
  const [page, setPage] = useState(1);

  const { data: location, isFetching } = useGetAllLocationsQuery({
    page,
    size: 20,
  });

  const dispatch = useAppDispatch();

  const [deleteLocation, { isLoading: isDeleteLoading }] =
    useDeleteLocationMutation();

  const onSubmit = async (id: string) => {
    try {
      await deleteLocation(id);
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
        type: DialogType.AddLocations,
        dialogProps: {
          header: "Update Locations",
          data: item,
          type: "update",
        },
      })
    );
  };
  return (
    <div>
      <div className='flex justify-between items-center py-6 mb-6'>
        <h1 className='text-[#D92D20] font-semibold text-sm'>Locations</h1>
        <Button
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.AddLocations,
                dialogProps: {
                  header: "Add Location",
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
        <div className='flex text-[#756D6D] font-semibold text-sm border-b border-gray-300 pb-4'>
          <h1 className='flex-1'>Name</h1>
          <h1 className='flex-1'>Address</h1>
          <h1 className='flex-1'>City</h1>
          <h1 className='flex-1'>State</h1>
          <h1 className='flex-1'>Email</h1>
          <h1 className='flex-1'>Phone</h1>
          <h1 className='flex-1'></h1>
        </div>

        {isFetching || isDeleteLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            {location?.data?.results?.map((item) => (
              <div
                key={item.id}
                className='flex justify-between mt-6 text-[#756D6D] font-normal text-xs'
              >
                <p className='flex-1'>{item.name}</p>
                <p className='flex-1'>{item.address}</p>
                <p className='flex-1'>{item.city}</p>
                <p className='flex-1'>{item.state}</p>
                <p className='flex-1'>{item.email}</p>
                <p className='flex-1'>{item.phone}</p>
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
          total={location?.data.pagination.count ?? 0}
          itemsPerPage={location?.data.pagination.page_size ?? 0}
          onChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
}
