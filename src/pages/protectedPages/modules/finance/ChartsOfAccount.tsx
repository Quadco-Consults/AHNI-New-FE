import { Button } from "components/ui/button";
import {
  // useCategoriesQuery,
  useDeleteCategoriesMutation,
} from "services/moduleConfig";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "atoms/TableAction";

const ChartsOfAccount = () => {
//   const { data } = useCategoriesQuery({
//     no_paginate: false,
//   });
const data = [
    {
        "id": "1",
        "name": "Travel: International Travel",
        "description": "Expenses related to international travel, including flights, accommodations, and meals.",
        "code": "TRAVEL_INTL"
    },
    {
        "id": "2",
        "name": "Travel: Domestic Travel",
        "description": "Expenses for domestic travel within the country, covering transportation, lodging, and per diem.",
        "code": "TRAVEL_DOM"
    },
    {
        "id": "3",
        "name": "Equipment: Health Equipment",
        "description": "Medical and health-related equipment used in healthcare settings, such as monitors and diagnostic tools.",
        "code": "EQP_HEALTH"
    },
    {
        "id": "4",
        "name": "Equipment: Non-Health Equipment",
        "description": "Non-medical equipment used for general purposes, including office supplies, furniture, and IT hardware.",
        "code": "EQP_NONHEALTH"
    },
    {
        "id": "5",
        "name": "Fringe Benefits",
        "description": "Employee benefits offered in addition to wages, such as insurance, retirement plans, and paid time off.",
        "code": "FRINGE_BEN"
    }
];


  console.log(data)

  const dispatch = useAppDispatch();

  const [deleteCategories] = useDeleteCategoriesMutation();

  const onSubmit = async (id: string) => {
    try {
      await deleteCategories(id).unwrap();
      toast.success("Deleted Successfully");
    } catch (error) {
      toast.error("Error deleteing item");
    }
  };

  const onUpdate = (item: any) => {
    dispatch(
      openDialog({
        type: DialogType.AddChartsOfAccounts,
        dialogProps: {
          header: "Update Charts of Account",
          data: item,
          type: "update",
        },
      })
    );
  };
  return (
    <div>
      <div className="flex items-center justify-between py-6 mb-6">
        <h1 className="text-[#D92D20] font-semibold text-sm">Charts of Account</h1>

        <Button
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.AddChartsOfAccounts,
                dialogProps: {
                  header: "Add Chart of Account",
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
          <h1 className="ml-[8rem]">Description</h1>
          <h1 className="ml-[5rem]">Code</h1>
          <h1></h1>
        </div>
        <div>
          {
            data?.map((item) => (
              <div key={item.id} className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs">
                <p className="w-[20%]">{item.name}</p>
                <p className="w-[25%]">{item.description}</p>
                <p className="w-[15%]">{item.code}</p>
                <TableAction
                    update
                    removeView
                    action={() => onSubmit(item.id)}
                    updateAction={() => onUpdate(item)}
                  />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default ChartsOfAccount;
