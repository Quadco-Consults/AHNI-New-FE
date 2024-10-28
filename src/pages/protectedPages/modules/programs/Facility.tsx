import { Button } from "components/ui/button";
import {
  useFacilitiesQuery,
  useDeleteFacilitiesMutation,
} from "services/module-programs";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "atoms/TableAction";

const Facility = () => {
  const { data } = useFacilitiesQuery({
    no_paginate: false,
  });
  console.log(data)

  const dispatch = useAppDispatch();

  const [deleteFacility] = useDeleteFacilitiesMutation();

  const onSubmit = async (id: string) => {
    try {
      await deleteFacility(id).unwrap();
      toast.success("Deleted Successfully");
    } catch (error) {
      toast.error("Error deleteing item");
    }
  };

  const onUpdate = (item: any) => {
    dispatch(
      openDialog({
        type: DialogType.AddFacility,
        dialogProps: {
          header: "Update Facility",
          data: item,
          type: "update",
        },
      })
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center py-6 mb-6">
        <h1 className="text-[#D92D20] font-semibold text-sm">
          Facility & Team Composition
        </h1>
        <Button
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.AddFacility,
                dialogProps: {
                  header: "Add Facility",
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
        <div className="flex gap-[5rem] text-[#756D6D] font-semibold text-sm border-b border-gray-300 pb-4">
          <h1 className="">Facility Name</h1>
          <h1>Contact Person</h1>
          <h1 className="">Position</h1>
          <h1>Phone Number</h1>
          <h1>Email</h1>
          <h1 className="">State</h1>
          <h1>LGA</h1>
          <h1></h1>
        </div>
        <div>
          {data?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs"
            >
              <p>{item.name}</p>
              {item.facility_contacts.map((contact) => (
                <div key={contact.id} className="flex gap-[4rem]">
                  <p>{contact.name}</p>
                  <p>{contact.position}</p>
                  <p>{contact.phone_number}</p>
                  <p>{contact.email}</p>
                </div>
              ))}
              <p>{item.state}</p>
              <p>{item.local_govt}</p>
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

export default Facility;
