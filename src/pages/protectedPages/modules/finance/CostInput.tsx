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

const CostInput = () => {
//   const { data } = useCategoriesQuery({
//     no_paginate: false,
//   });
const data = [
    {
        "id": "1",
        "name": "Cost Input: International Travel",
        "description": "Cost input for expenses incurred from international travel, including flights, accommodations, and meals.",
        "code": "COST_TRAVEL_INTL"
    },
    {
        "id": "2",
        "name": "Cost Input: Domestic Travel",
        "description": "Cost input for domestic travel expenses, covering transportation, lodging, and per diem within the country.",
        "code": "COST_TRAVEL_DOM"
    },
    {
        "id": "3",
        "name": "Cost Input: Health Equipment",
        "description": "Cost input for acquiring and maintaining medical and health-related equipment essential for healthcare services.",
        "code": "COST_EQP_HEALTH"
    },
    {
        "id": "4",
        "name": "Cost Input: Non-Health Equipment",
        "description": "Cost input for purchasing general equipment such as office supplies, furniture, and IT hardware.",
        "code": "COST_EQP_NONHEALTH"
    },
    {
        "id": "5",
        "name": "Cost Input: Fringe Benefits",
        "description": "Cost input for employee fringe benefits, including insurance, retirement contributions, and additional compensation.",
        "code": "COST_FRINGE_BEN"
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
        type: DialogType.AddCostInput,
        dialogProps: {
          header: "Update Cost Input",
          data: item,
          type: "update",
        },
      })
    );
  };
  return (
    <div>
      <div className="flex items-center justify-between py-6 mb-6">
        <h1 className="text-[#D92D20] font-semibold text-sm">Cost Input</h1>

        <Button
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.AddCostInput,
                dialogProps: {
                  header: "Add Cost Input",
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

export default CostInput;
