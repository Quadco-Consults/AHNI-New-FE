import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "components/atoms/TableAction";
import { LoadingSpinner } from "components/Loading";
import { useState, useMemo } from "react";
import {
  useDeleteLot,
  useGetAllLots,
} from "@/features/modules/controllers/procurement/lotController";
import Pagination from "components/Pagination";

export default function AllSubLots() {
  const [page, setPage] = useState(1);

  const { data: lot, isFetching } = useGetAllLots({
    page,
    size: 1000, // Get all lots to filter sub-lots
  });

  const dispatch = useAppDispatch();

  const [deleteLot, { isLoading: isDeleteLoading }] = useDeleteLot();

  // Debug: Log the data structure
  console.log("🔍 AllSubLots - Lot Data:", lot);
  console.log("🔍 AllSubLots - Results:", lot?.results);

  // Filter only sub-lots (lots that have a parent)
  const subLots = useMemo(() => {
    const allLots = (lot as any)?.results || [];
    console.log("🔍 AllSubLots - All Lots:", allLots);
    const filtered = allLots.filter((item: any) => item.parent !== null && item.parent !== undefined);
    console.log("🔍 AllSubLots - Sub-Lots (filtered):", filtered);
    return filtered;
  }, [lot]);

  const onSubmit = async (id: string) => {
    try {
      await deleteLot(id);
      toast.success("Sub-Lot Deleted Successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
    }
  };

  const onUpdate = (item: any) => {
    dispatch(
      openDialog({
        type: DialogType.AddLots,
        dialogProps: {
          header: "Update Sub-Lot",
          data: item,
          type: "update",
          isSubLot: true, // Flag to open sub-lot tab
        },
      })
    );
  };

  const onAddSubLot = () => {
    dispatch(
      openDialog({
        type: DialogType.AddLots,
        dialogProps: {
          header: "Add Sub-Lot",
          isSubLot: true, // Flag to open sub-lot tab
        },
      })
    );
  };

  return (
    <div>
      <div className='flex items-center justify-between py-6 mb-6'>
        <h1 className='text-[#D92D20] font-semibold text-sm'>Sub-Lots</h1>

        <Button
          onClick={onAddSubLot}
          variant='outline'
          className='gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-[#FFFFFF] text-[#DEA004] border-[1px] border-[#C7CBD5]'
          size='sm'
        >
          Click to add New Sub-Lot
        </Button>
      </div>
      <div>
        <div className='flex justify-between text-[#756D6D] font-semibold text-sm border-b border-gray-300 pb-4'>
          <h1 className='flex-1'>Sub-Lot Name</h1>
          <h1 className='flex-1'>Parent Lot</h1>
          <h1 className='flex-1'>Packet Number</h1>
          <h1 className='flex-1'></h1>
        </div>

        {isFetching || isDeleteLoading ? (
          <LoadingSpinner />
        ) : subLots.length === 0 ? (
          <div className='mt-8 text-center'>
            <p className='text-gray-500 text-sm'>No sub-lots found.</p>
            <p className='text-gray-400 text-xs mt-2'>
              Create a sub-lot by clicking the "Add New Sub-Lot" button above.
            </p>
          </div>
        ) : (
          <div>
            {subLots.map((item: any) => (
              <div
                key={item.id}
                className='flex justify-between mt-6 text-[#756D6D] font-normal text-xs'
              >
                <p className='flex-1'>{item.name}</p>
                <p className='flex-1'>{item.parent_name || "—"}</p>
                <p className='flex-1'>{item.packet_number}</p>
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

        {/* Note: Pagination disabled for now since we're filtering client-side */}
        {/* You can implement server-side filtering later if needed */}
      </div>
    </div>
  );
}
