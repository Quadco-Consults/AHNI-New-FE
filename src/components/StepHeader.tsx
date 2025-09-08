import { useRouter } from "next/navigation";
import CheckIcon from "assets/svgs/CheckIcon";
import PendingIcon from "assets/svgs/PendingIcon";
import LongArrowLeft from "components/icons/LongArrowLeft";
import { Separator } from "components/ui/separator";

interface Step {
  step: number;
  stepName: string;
}

interface StepHeaderProps {
  steps: Step[];
  currentStep: number;
}

const StepHeader = ({ steps, currentStep }: StepHeaderProps) => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <section className="space-y-4">
      <button
        onClick={goBack}
        className="w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
      >
        <LongArrowLeft />
      </button>
      <div className="grid justify-between w-full grid-cols-6 px-4 py-2 gap-y-4">
        {steps.map((step, index) => (
          <div className="relative flex items-start justify-center" key={index}>
            <div className="w-[15rem] overflow-hidden h-[8rem] flex flex-col items-start justify-start gap-5">
              <span>
                {index < currentStep - 1 ? <CheckIcon /> : <PendingIcon />}
              </span>
              <div className="space-y-1">
                <div className="text-[10px] font-semibold text-gray-400">
                  STEP {step.step}
                </div>
                <div className="text-sm font-semibold">{step.stepName}</div>
              </div>
            </div>
            {index !== steps.length - 1 && (
              <div className="flex items-center justify-center w-full text-center absolute top-[12%] left-[8%]">
                <Separator className="w-[50%] text-center h-[2px] rounded-full bg-[#756D6D]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepHeader;
