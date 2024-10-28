import { Button } from "components/ui/button";
import {
  useLotsQuery,
  useDeleteLotsMutation,
} from "services/moduleProcurement";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "atoms/TableAction";

const Lots = () => {
  const { data } = useLotsQuery({
    no_paginate: false,
  });

  const dispatch = useAppDispatch();

  const [deleteLots] = useDeleteLotsMutation();

  const onSubmit = async (id: string) => {
    try {
      await deleteLots(id).unwrap();
      toast.success("Deleted Successfully");
    } catch (error) {
      toast.error("Error deleteing item");
    }
  };

  const onUpdate = (item: any) => {
    dispatch(
      openDialog({
        type: DialogType.AddLots,
        dialogProps: {
          header: "Update Lot",
          data: item,
          type: "update",
        },
      })
    );
  };
  return (
    <div>
      <div className="flex items-center justify-between py-6 mb-6">
        <h1 className="text-[#D92D20] font-semibold text-sm">Lots</h1>

        <Button
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.AddLots,
                dialogProps: {
                  header: "Add Lot",
                },
              })
            )
          }
          variant="outline"
          className="gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-[#FFFFFF] text-[#DEA004] border-[1px] border-[#C7CBD5]"
          size="sm"
        >
          Click to add New
        </Button>
      </div>
      <div>
        <div className="flex justify-between text-[#756D6D] font-semibold text-sm border-b border-gray-300 pb-4">
          <h1>Name</h1>
          <h1 className="">Packet Number</h1>
          <h1></h1>
        </div>
        <div>
          {data?.results.map((item) => (
            <div
              key={item.id}
              className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs"
            >
              <p className="w-[30%]">{item.name}</p>
              <p className="w-[25%]">{item.packet_number}</p>
              <TableAction
                update
                removeView
                action={() => onSubmit(item.id)}
                updateAction={() => onUpdate(item)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lots;
