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
  useDeleteMarketPrice,
  useGetAllMarketPrices,
} from "@/features/modules/controllers/config/marketPriceController";
import { formatNumberCurrency } from "utils/utls";

export default function MarketPrice() {
  const [page, setPage] = useState(1);

  const { data: item, isFetching } = useGetAllMarketPrices({
    page,
    size: 20,
    search: "",
  });

  const dispatch = useAppDispatch();

  const { deleteMarketPrice: deleteItem, isLoading: isDeleteLoading } =
    useDeleteMarketPrice();

  const onSubmit = async (id: string) => {
    try {
      await deleteItem(id);
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
        type: DialogType.AddMarketPrice,
        dialogProps: {
          header: "Update Item",
          data: item,
          type: "update",
        },
      })
    );
  };

  console.log({ item });

  return (
    <div>
      <div className='flex items-center justify-between py-6 mb-6'>
        <h1 className='text-[#D92D20] font-semibold text-sm'>Market Prices</h1>

        <Button
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.AddMarketPrice,
                dialogProps: {
                  header: "Add Market Price",
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
          <h1 className='flex-1'>Source</h1>
          <h1 className='flex-1'>Unit Price</h1>
          <h1 className='flex-1'>Date</h1>
          <h1 className='flex-1'>Actions</h1>
        </div>

        {isFetching || isDeleteLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            {item?.data?.results?.map((item, idx) => (
              <div
                key={idx}
                className='flex justify-between mt-6 text-[#756D6D] font-normal text-xs'
              >
                <p className='flex-1'>{item.item_detail?.name}</p>
                <p className='flex-1'>{item.source || "N/A"}</p>
                <p className='flex-1'>
                  {formatNumberCurrency(item.unit_price, "NGN")}
                </p>
                <p className='flex-1'>{item.date}</p>
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
          total={item?.data.pagination.count ?? 0}
          itemsPerPage={item?.data.pagination.page_size ?? 0}
          onChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
}
