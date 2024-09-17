import { Button } from "components/ui/button";
import {
  useLocationsQuery,
  useDeleteLocationsMutation,
} from "services/moduleConfig";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "atoms/TableAction";

const Locations = () => {
  const { data } = useLocationsQuery({
    no_paginate: false,
  });

  console.log(data);

  const dispatch = useAppDispatch();

  const [deleteLocations] = useDeleteLocationsMutation();

  const onSubmit = async (id: string) => {
    try {
      await deleteLocations(id).unwrap();
      toast.success("Deleted Successfully");
    } catch (error) {
      toast.error("Error deleteing item");
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
      <div className="flex justify-between items-center py-6 mb-6">
        <h1 className="text-[#D92D20] font-semibold text-sm">Locations</h1>
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
          variant="outline"
          className="gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-[#FFFFFF] text-[#DEA004] border-[1px] border-[#C7CBD5]"
          size="sm"
        >
          Click to add New
        </Button>
      </div>
      <div>
        <div className="flex gap-[8rem] text-[#756D6D] font-semibold text-sm border-b border-gray-300 pb-4">
          <h1 className="mr-[2.5rem]">Name</h1>
          <h1>Address</h1>
          <h1 className="">City</h1>
          <h1>State</h1>
          <h1>Email</h1>
          <h1 className="ml-[-1.5rem]">Phone</h1>
          <h1></h1>
        </div>
        <div>
          {data?.results.map((item) => (
            <div
              key={item.id}
              className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs"
            >
              <div className="w-[98%] flex justify-between">
                <p className="w-[15%]">{item.name}</p>
                <p className="w-[12%]">{item.address}</p>
                <p className="w-[10%]">{item.city}</p>
                <p className="w-[8%]">{item.state}</p>
                <p className="w-[10%]">{item.email}</p>
                <p className="w-[13%]">{item.phone}</p>
              </div>
              <div>
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
      </div>
    </div>
  );
};

export default Locations;
