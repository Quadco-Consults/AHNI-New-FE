import CheckIcon from "@/assets/svgs/CheckIcon";
import PendingIcon from "@/assets/svgs/PendingIcon";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BreadcrumbCard from "@/components/Breadcrumb";

interface Step {
  step: number;
  stepName: string;
  route: string;
}

const steps: Step[] = [
  {
    step: 1,
    stepName: "Proposal",
    route: "proposal",
  },
  { step: 2, stepName: "Uploads", route: "uploads" },
];

const RfpHeading = () => {
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(() => {
    // Retrieve the completion state from local storage or initialize if not present
    const savedSteps = sessionStorage.getItem("rfqCompletedSteps");
    return savedSteps
      ? JSON.parse(savedSteps)
      : new Array(steps.length).fill(false);
  });
  const pathname = usePathname();

  const currentPath = pathname.split("/").at(-1);

  useEffect(() => {
    const currentStepIndex = steps.findIndex(
      (step) => step.route === currentPath
    );
    // Mark the previous step as completed when navigating to a new step
    if (currentStepIndex > 0) {
      setCompletedSteps((prev) => {
        const updatedSteps = [...prev];
        updatedSteps[currentStepIndex - 1] = true; // Mark the previous step as completed
        sessionStorage.setItem(
          "rfqCompletedSteps",
          JSON.stringify(updatedSteps)
        );
        return updatedSteps;
      });
    }
  }, [currentPath]);

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Solicitation Management", icon: true },
    { name: "RFP", icon: true },
    { name: "Create", icon: false },
  ];

  return (
    <section className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />

      <div className='grid justify-between w-1/2 grid-cols-2 px-4 py-2 gap-y-4'>
        {steps.map((item, i) => {
          return (
            <div className='flex items-center' key={i}>
              {completedSteps[i] ? <CheckIcon /> : <PendingIcon />}

              {i !== steps.length - 1 && (
                <div className='flex items-center justify-center w-full text-center '>
                  <Separator className='w-[70%] text-center h-[2px] bg-[#756D6D] ' />
                </div>
              )}
            </div>
          );
        })}
        {steps.map((step, index) => {
          return (
            <div className='flex items-center ' key={index}>
              <div className='text-sm '>
                <div className='space-y-1'>
                  <div className='text-xs'>STEP {step.step}</div>
                  <div className='text-sm font-semibold'>{step.stepName}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RfpHeading;
