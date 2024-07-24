import { Button } from "components/ui/button";
import AddSupervisionCategory from "./AddSupervisionCategory";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "components/ui/dialog";
import { useSupervisionCategoryQuery } from "services/module-programs";

const SupervisionCategory = () => {
  const {data} = useSupervisionCategoryQuery({
    no_paginate: false
  })
  return (
    <div>
      <div className="flex justify-between items-center py-6 mb-6">
        <h1 className="text-[#D92D20] font-semibold text-sm">Supervision Evaluation Category</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-[#FFFFFF] text-[#DEA004] border-[1px] border-[#C7CBD5]"
              size="sm"
            >
              Click to add New
            </Button>
          </DialogTrigger>
          <DialogContent className="">
            <DialogTitle>Supervision Evaluation Category</DialogTitle>
            <AddSupervisionCategory />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <div className="flex justify-between text-[#756D6D] font-semibold text-sm border-b border-gray-300 pb-4">
          <h1>Name</h1>
          <h1 className="ml-[8rem]">Description</h1>
          <h1 className="ml-[5rem]">Code</h1>
          <h1>Serial Number</h1>
          <h1>Job Category</h1>
          <h1></h1>
        </div>
        <div>
          {
            data?.map((item) => (
              <div key={item.id} className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs">
                <p className="w-[20%]">{item.name}</p>
                <p className="w-[25%]">{item.description}</p>
                <p className="w-[15%]">{item.code}</p>
                <p className="w-[5%]">{item.serial_number}</p>
                <p  className="w-[5%]">{item.job_category}</p>
                <img src="../../../../public/imgs/module.png" className="w-[20px] object-contain" alt="" />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default SupervisionCategory;
