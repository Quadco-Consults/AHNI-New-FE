import { CONSORTIUM_PARTNERS } from "./list";
import { Button } from "components/ui/button";
import AddPartners from "./AddPartners";
import { Dialog, DialogContent, DialogTrigger } from "components/ui/dialog";
import { usePartnersQuery } from "services/moduleProjects";

const Partners = () => {
  const { data } = usePartnersQuery({
    no_paginate: false,
  });

  return (
    <div>
      <div className="flex justify-between items-center py-6 mb-6">
        <h1 className="text-[#D92D20] font-semibold text-sm">Partners</h1>
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
            <AddPartners />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <div className="flex justify-between text-[#756D6D] font-semibold text-sm mb-4 border-b border-gray-300 pb-4">
          <h1>Logo</h1>
          <h1 className="ml-[-2rem]">Name</h1>
          <h1 className="ml-[-1rem]">Address</h1>
          <h1>City</h1>
          <h1>State</h1>
          <h1>Phone</h1>
          <h1>Email</h1>
          <h1>Website</h1>
          <h1></h1>
        </div>
        <div>
          {data?.results.map((item) => (
            <div key={item.id} className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs">
              <div className="w-[98%] flex justify-between">
                <img className="w-[20px] object-contain" src="../../../../public/imgs/fhi-logo.png" alt="" />
                <p className="w-[10%] ml-[3.5rem]">{item.name}</p>
                <p className="w-[12%] mr-[1.5rem]">{item.address}</p>
                <p className="w-[6%] mr-[3rem]">{item.city}</p>
                <p className="w-[8%] mr-[2.5rem]">{item.state}</p>
                <p className="w-[10%]">{item.phone}</p>
                <p className="w-[13%]">{item.email}</p>
                <p className="w-[10%] mr-[1.8rem]">{item.website}</p>
              </div>
              <div>
                <img
                  src="../../../../public/imgs/module.png"
                  className="w-[20px] object-contain"
                  alt=""
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partners;
