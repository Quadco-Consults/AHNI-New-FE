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

const ProjectClasses = () => {
//   const { data } = useCategoriesQuery({
//     no_paginate: false,
//   });
const data = [
    {
        "id": "1",
        "name": "Project Class: Health Initiatives",
        "description": "Projects aimed at improving community health, such as vaccination drives, health camps, and awareness programs.",
        "code": "CLASS_HEALTH"
    },
    {
        "id": "2",
        "name": "Project Class: Education Programs",
        "description": "Educational projects focusing on literacy, skill development, and school support for underprivileged communities.",
        "code": "CLASS_EDUCATION"
    },
    {
        "id": "3",
        "name": "Project Class: Environmental Conservation",
        "description": "Projects dedicated to protecting the environment, including reforestation, waste management, and clean water initiatives.",
        "code": "CLASS_ENVIRONMENT"
    },
    {
        "id": "4",
        "name": "Project Class: Economic Development",
        "description": "Projects focused on economic empowerment, such as microfinance, vocational training, and small business support.",
        "code": "CLASS_ECONOMIC"
    },
    {
        "id": "5",
        "name": "Project Class: Disaster Relief",
        "description": "Emergency response projects providing relief during natural disasters, including food, shelter, and medical aid.",
        "code": "CLASS_RELIEF"
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
        type: DialogType.AddProjectClasses,
        dialogProps: {
          header: "Update Project Classes",
          data: item,
          type: "update",
        },
      })
    );
  };
  return (
    <div>
      <div className="flex items-center justify-between py-6 mb-6">
        <h1 className="text-[#D92D20] font-semibold text-sm">Project Classes</h1>

        <Button
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.AddProjectClasses,
                dialogProps: {
                  header: "Add Project Classes",
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

export default ProjectClasses;
