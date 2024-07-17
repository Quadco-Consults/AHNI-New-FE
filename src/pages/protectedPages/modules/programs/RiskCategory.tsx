import { Button } from "components/ui/button";
import AddRiskCategory from "./AddRiskCategory";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "components/ui/dialog";
import { RISK_CATEGORY } from "./list";

const RiskCategory = () => {
  return (
    <div>
      <div className="flex justify-between items-center py-6 mb-6">
        <h1 className="text-[#D92D20] font-semibold text-sm">
          Team Members
        </h1>
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
            <DialogTitle>Add Risk Category</DialogTitle>
            <AddRiskCategory />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <div className="flex gap-[6.1rem] text-[#756D6D] font-semibold text-sm border-b border-gray-300 pb-4">
          <h1>Facility Name</h1>
          <h1>Gender</h1>
          <h1 className="ml-[-0.5rem]">Designation</h1>
          <h1 className="ml-[1.6rem]">Number</h1>
          <h1 className="ml-[2.6rem]">Email</h1>
          {/* <h1></h1> */}
        </div>
        <div>
          {RISK_CATEGORY.map((table, index) => (
            <div
              key={index}
              className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs"
            >
              <p>{table.name}</p>
              <p>{table.gender}</p>
              <p>{table.designation}</p>
              <p>{table.phone}</p>
              <p>{table.email}</p>
              <img src={table.icon} className="w-[20px] object-contain" alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskCategory;
