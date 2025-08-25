import CheckIcon from "assets/svgs/CheckIcon";
import PendingIcon from "assets/svgs/PendingIcon";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { Separator } from "components/ui/separator";
import { ProcurementPlanResultsData } from "definations/procurement-types/procurementPlan";
import React, { useState } from "react";

const ProcurementMilestones = (data: ProcurementPlanResultsData) => {
  const [currentStep, setcurrentStep] = useState(2);

  const milestones = [
    { step: 1, date: "12-jul-2024", description: "Bid Document Finalization " },
    {
      step: 2,
      date: "13-jul-2024",
      description:
        "Advertise Bid (national dailies, short-listed vendors, website etc.)",
    },
    { step: 3, date: "14-aug-2024", description: "Evaluation " },
    { step: 4, date: "14-dec-2024", description: "Evaluation  " },
  ];
  return (
    <div className="w-[95%] mx-auto space-y-4">
      <h3 className="text-primary text-xl font-semibold py-12">
        Procurement Milestones
      </h3>

      <div className="grid justify-between w-full grid-row-6 px-4 py-2 gap-y-4">
        {milestones.map((milestone, index) => (
          <div
            className="flex flex-col items-start justify-center relative"
            key={index}
          >
            <div className="w-[600px] overflow-hidden h-[8rem] flex items-start justify-start gap-5">
              <div className="mx-4">
                <Checkbox
                  checked={currentStep >= index + 1}
                  onCheckedChange={() => {}}
                  className="w-6 h-6 border-black data-[state=checked]:bg-black"
                />
              </div>
              <span>
                {index < currentStep ? <CheckIcon /> : <PendingIcon />}
              </span>
              <div className="space-y-1">
                <div className="text-[10px] font-semibold text-gray-400 capitalize">
                  {milestone.date}
                </div>
                <div className="text-sm font-semibold">
                  {milestone.description}
                </div>
              </div>
            </div>
            {index !== milestones.length - 1 && (
              <div className="flex items-center justify-start w-full text-center absolute top-[37%] left-[15.5%]">
                <Separator className="w-[2px] text-center h-[80px] rounded-full bg-[#756D6D]" />
              </div>
            )}
          </div>
        ))}
      </div>
      <span className="w-full flex items-center justify-end gap-5">
        <Button
          type="button"
          className="bg-[#FFF2F2] text-primary dark:text-gray-500"
          onClick={() => {}}
        >
          Cancel
        </Button>
        <Button onClick={() => {}}>Save Changes</Button>
      </span>
    </div>
  );
};

export default ProcurementMilestones;
