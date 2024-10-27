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

const BudgetLine = () => {
//   const { data } = useCategoriesQuery({
//     no_paginate: false,
//   });
const data = [
    {
        "id": "1",
        "name": "Budget Line: International Travel",
        "description": "Allocated budget for expenses related to international travel, covering flights, accommodation, and meals.",
        "code": "BUDGET_TRAVEL_INTL"
    },
    {
        "id": "2",
        "name": "Budget Line: Domestic Travel",
        "description": "Allocated budget for domestic travel within the country, including transportation, lodging, and daily allowances.",
        "code": "BUDGET_TRAVEL_DOM"
    },
    {
        "id": "3",
        "name": "Budget Line: Health Equipment",
        "description": "Allocated budget for acquiring medical and health-related equipment necessary for healthcare operations.",
        "code": "BUDGET_EQP_HEALTH"
    },
    {
        "id": "4",
        "name": "Budget Line: Non-Health Equipment",
        "description": "Allocated budget for general-purpose equipment such as office supplies, furniture, and IT hardware.",
        "code": "BUDGET_EQP_NONHEALTH"
    },
    {
        "id": "5",
        "name": "Budget Line: Fringe Benefits",
        "description": "Allocated budget for employee benefits, including insurance, retirement plans, and other non-wage compensations.",
        "code": "BUDGET_FRINGE_BEN"
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
        type: DialogType.AddBudgetLine,
        dialogProps: {
          header: "Update Budget Line",
          data: item,
          type: "update",
        },
      })
    );
  };
  return (
    <div>
      <div className="flex items-center justify-between py-6 mb-6">
        <h1 className="text-[#D92D20] font-semibold text-sm">Budget Line</h1>

        <Button
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.AddBudgetLine,
                dialogProps: {
                  header: "Add Budget Line",
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

export default BudgetLine;
