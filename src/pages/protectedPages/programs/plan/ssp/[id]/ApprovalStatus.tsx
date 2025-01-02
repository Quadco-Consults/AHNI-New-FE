import CheckIcon from "assets/svgs/CheckIcon";
import PendingIcon from "assets/svgs/PendingIcon";
import { Checkbox } from "components/ui/checkbox";
import { Separator } from "components/ui/separator";
import { useState } from "react";

type Props = {};

const ApprovalStatus = (props: Props) => {
  const [currentStep, setcurrentStep] = useState(2);

  const milestones = [
    { step: 1, description: "Approved by admin" },
    {
      step: 2,

      description: "Waiting for Manger approval",
    },
    { step: 3, description: "Waiting for HOD approval" },
    { step: 4, description: "Waiting for Principal official approval" },
    { step: 5, description: "Signing/ Final Approval" },
  ];

  return (
    <div className="h-max">
      <h3 className="text-primary text-xl font-semibold py-10">
        Approval Stages
      </h3>

      <div className="grid justify-between w-full grid-row-6 px-4 py-2 gap-y-4">
        {milestones.map((milestone, index) => (
          <div
            className="flex flex-col items-start justify-center relative h-full"
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
              <div className="text-sm mt-1 font-semibold">
                {milestone.description}
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
    </div>
  );
};

export default ApprovalStatus;
