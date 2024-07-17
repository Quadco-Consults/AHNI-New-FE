import { CONSORTIUM_PARTNERS } from "./list";
import { Button } from "components/ui/button";
import AddProjects from "./AddProjects";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "components/ui/dialog";

const ConsortiumPartners = () => {
  return (
    <div>
      <div className="flex justify-between items-center py-6 mb-6">
        <h1 className="text-[#D92D20] font-semibold text-sm">Funding Source</h1>
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
            <AddProjects />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <div className="flex text-[#756D6D] font-semibold text-sm mb-4 border-b border-gray-300 pb-4">
          <h1 className="mr-8">Logo</h1>
          <h1 className="mr-[6.8rem]">Name</h1>
          <h1 className="mr-[2.3rem]">Address</h1>
          <h1 className="mr-[3.5rem]">City</h1>
          <h1 className="mr-[5.6rem]">State</h1>
          <h1 className="mr-[6.3rem]">Phone</h1>
          <h1 className="mr-[8.8rem]">Email</h1>
          <h1 className="">Website</h1>
          <h1 className=""></h1>
        </div>
        <div>
          {CONSORTIUM_PARTNERS.map((table, index) => (
            <div
              key={index}
              className="flex justify-between items-center mt-6 text-[#756D6D] font-normal text-xs"
            >
              <img
                src={table.logo}
                className="w-[20px] object-contain"
                alt=""
              />
              <p className="w-[10%]">{table.name}</p>
              <p className="w-[5%]">{table.address}</p>
              <p className="w-[%]">{table.city}</p>
              <p className="w-[8%]">{table.state}</p>
              <p className="w-[10%]">{table.phone}</p>
              <p className="w-[13%]">{table.email}</p>
              <p className="w-[10%]">{table.website}</p>
              <img
                src={table.icon}
                className="w-[20px] object-contain"
                alt=""
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsortiumPartners;
