import { Button } from "components/ui/button";
import AddFacility from "./AddFacility";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "components/ui/dialog";
import { FACILITY } from "./list";

const Facility = () => {
  return (
    <div>
      <div className="flex justify-between items-center py-6 mb-6">
        <h1 className="text-[#D92D20] font-semibold text-sm">
          Facility & Team Composition
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
            <DialogTitle>Add Facility</DialogTitle>
            <AddFacility />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <div className="flex gap-[6.5rem] text-[#756D6D] font-semibold text-sm border-b border-gray-300 pb-4">
          <h1>Facility Name</h1>
          <h1>Contact Person</h1>
          <h1 className="ml-[-2.8rem]">Position</h1>
          <h1 className="ml-[3.5rem]">Phone Number</h1>
          <h1 className="ml-[-2rem]">State</h1>
          <h1 className="ml-[-2rem]">LGA</h1>
          {/* <h1></h1> */}
        </div>
        <div>
          {FACILITY.map((table, index) => (
            <div
              key={index}
              className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs"
            >
              <p>{table.facilityName}</p>
              <p>{table.contactPerson}</p>
              <p>{table.position}</p>
              <p>{table.phoneNumber}</p>
              <p>{table.state}</p>
              <p>{table.lga}</p>
              <img src={table.icon} className="w-[20px] object-contain" alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Facility;
