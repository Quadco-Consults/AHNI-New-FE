import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { Edit, RefreshCw } from "lucide-react";
import { Button } from "components/ui/button";
import AddFacility from "./AddFacility";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "components/ui/dialog";
import { ChevronDown } from "lucide-react";
import { useFacilitiesQuery } from "services/module-programs";

const Facility = () => {
  const { data } = useFacilitiesQuery({
    no_paginate: false,
  });



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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-8 h-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer ">
                    <Edit className="w-4 h-4 mr-2" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer ">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    <span>Update Role</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Facility;
