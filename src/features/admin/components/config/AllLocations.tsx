import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import TableAction from "@/components/TableAction";
import { LoadingSpinner } from "@/components/Loading";
import { useState } from "react";
import {
  useDeleteLocationMutation,
  useGetAllLocationsQuery,
} from "@/features/modules/controllers/config/locationController";
import Pagination from "@/components/Pagination";
import { Search, Upload } from "lucide-react";
import BulkUploadDialog from "@/components/BulkUpload/BulkUploadDialog";

export default function AllLocations() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  const { data: location, isFetching, refetch } = useGetAllLocationsQuery({
    page,
    size: 20,
    search,
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
        <div className="flex items-center gap-4">
          <div className="flex items-stretch gap-2 border border-gray-300 rounded-md shadow-sm px-4 py-2 w-[350px]">
            <Search size={20} className="text-gray-500" />
            <input
              className="w-full text-sm outline-none rounded-none border-none text-md h-[20px]"
              placeholder="Search locations..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
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
      </div>

      <BulkUploadDialog
        open={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        apiEndpoint="/config/locations"
        title="Locations"
        onUploadComplete={() => {
          refetch();
          setBulkUploadOpen(false);
        }}
      />
      <div>
        <div className='flex text-[#756D6D] font-semibold text-sm border-b border-gray-300 pb-4'>
          <h1 className='flex-1'>Name</h1>
          <h1 className='flex-1'>Code</h1>
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
                <p className='flex-1 font-mono text-blue-600'>{item.code || 'N/A'}</p>
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
