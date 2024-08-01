import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import AddBeneficiaries from "./AddBeneficiaries";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "components/ui/dialog";
import { useBeneficiariesQuery } from "services/moduleProjects";

const Beneficiaries = () => {
  const { data } = useBeneficiariesQuery({
    no_paginate: false,
  });

  return (
    <Card className="mt-10 pb-8 px-6">
      <div className="flex justify-between items-center py-6 mb-6">
        <h1 className="text-[#D92D20] font-semibold text-sm">Beneficiaries</h1>
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
            <DialogTitle>Beneficiaries</DialogTitle>
            <AddBeneficiaries />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <div className="flex justify-between text-[#756D6D] font-semibold text-sm mb-10">
          <h1>Name</h1>
          <h1>Description</h1>
          <h1></h1>
        </div>
        <div>
          {data?.results.map((item) => (
            <div key={item.id} className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs">
              <div className="w-[53%] lg:w-[52%] flex justify-between">
                <p>{item.name}</p>
                <p>{item.description}</p>
              </div>
              <div>
                <img
                  src="../../../../public/imgs/module.png"
                  className="w-[20px]"
                  alt=""
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default Beneficiaries;
