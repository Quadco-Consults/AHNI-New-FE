import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StartPrequalification = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-5">
      <Button
        onClick={() => navigate(-1)}
        variant="outline"
        className="gap-2 text-primary border-primary"
      >
        <span>
          <ArrowLeft size={15} />
        </span>
        View Vendor info
      </Button>

      <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="p-5 ">
          <h4 className="font-bold text-lg">1st Stage</h4>
        </div>

        <hr />

        <div className="space-y-5 p-5">
          <Card className="border-yellow-darker flex gap-2 justify-between">
            <h2 className="font-semibold text-base">
              Complete conformity to Tender Submission Requirement
            </h2>
            <div className="flex gap-5 items-center">
              <div className="flex gap-2 items-center text-green-dark">
                <Checkbox className="border-green-dark data-[state=checked]:bg-inherit data-[state=checked]:text-green-dark" />
                <h6>Pass</h6>
              </div>
              <div className="flex gap-2 items-center">
                <Checkbox />
                <h6>Fail</h6>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="p-5 ">
          <h4 className="font-bold text-lg">2nd Stage</h4>
        </div>

        <hr />

        <div className="space-y-5 p-5">
          <Card className="border-yellow-darker flex gap-2 justify-between">
            <h2 className="font-semibold text-base">
              Conformity to Minimum Eligibility Requirement listed 1-6
            </h2>
            <div className="flex gap-5 items-center">
              <div className="flex gap-2 items-center text-green-dark">
                <Checkbox className="border-green-dark data-[state=checked]:bg-inherit data-[state=checked]:text-green-dark" />
                <h6>Pass</h6>
              </div>
              <div className="flex gap-2 items-center">
                <Checkbox />
                <h6>Fail</h6>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="p-5 ">
          <h4 className="font-bold text-lg">Selected Category</h4>
        </div>

        <hr />

        <div className="p-5">
          <Card className="space-y-5 border-yellow-darker">
            <div className="flex gap-2 justify-between">
              <div className="space-y-2">
                <h2 className="font-semibold">EOIAHNi01</h2>
                <h6 className="font-light">
                  Medical Laboratory Consumables (General, Viral Load,
                  Diagnostic, OSS, and PCR Lab consumables)
                </h6>
              </div>
              <div className="flex gap-5 items-center">
                <div className="flex gap-2 items-center text-green-dark">
                  <Checkbox className="border-green-dark data-[state=checked]:bg-inherit data-[state=checked]:text-green-dark" />
                  <h6>Pass</h6>
                </div>
                <div className="flex gap-2 items-center">
                  <Checkbox />
                  <h6>Fail</h6>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-between">
              <div className="space-y-2">
                <h2 className="font-semibold">EOIAHNi03</h2>
                <h6 className="font-light">
                  Medical Laboratory Consumables (General, Viral Load,
                  Diagnostic, OSS, and PCR Lab consumables)
                </h6>
              </div>
              <div className="flex gap-5 items-center">
                <div className="flex gap-2 items-center text-green-dark">
                  <Checkbox className="border-green-dark data-[state=checked]:bg-inherit data-[state=checked]:text-green-dark" />
                  <h6>Pass</h6>
                </div>
                <div className="flex gap-2 items-center">
                  <Checkbox />
                  <h6>Fail</h6>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-between">
              <div className="space-y-2">
                <h2 className="font-semibold">EOIAHNi13</h2>
                <h6 className="font-light">
                  Non- Food Relief Items and Dignity Kits (E.g., Tents, plastic
                  chairs, plastic tables, sanitary pad, toothpaste, bathing
                  soap, laundry soap, slippers, wrappers, veil, bucket, cups,
                  jerrycan etc)
                </h6>
              </div>
              <div className="flex gap-5 items-center">
                <div className="flex gap-2 items-center text-green-dark">
                  <Checkbox className="border-green-dark data-[state=checked]:bg-inherit data-[state=checked]:text-green-dark" />
                  <h6>Pass</h6>
                </div>
                <div className="flex gap-2 items-center">
                  <Checkbox />
                  <h6>Fail</h6>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Finish</Button>
      </div>
    </div>
  );
};

export default StartPrequalification;
