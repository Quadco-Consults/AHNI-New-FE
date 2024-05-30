import CheckIcon from "assets/svgs/CheckIcon";
import PendingIcon from "assets/svgs/PendingIcon";
import { Separator } from "components/ui/separator";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface Step {
  step: number;
  stepName: string;
  route: string;
}

const steps: Step[] = [
  {
    step: 1,
    stepName: "Project Summary",
    route: "summary",
  },
  { step: 2, stepName: "Project Performance", route: "performance" },
  { step: 3, stepName: "Uploads", route: "uploads" },
];

const ProjectsHeading = () => {
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(() => {
    // Retrieve the completion state from local storage or initialize if not present
    const savedSteps = sessionStorage.getItem("projectsCompletedSteps");
    return savedSteps
      ? JSON.parse(savedSteps)
      : new Array(steps.length).fill(false);
  });
  const { pathname } = useLocation();

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
          "projectsCompletedSteps",
          JSON.stringify(updatedSteps)
        );
        return updatedSteps;
      });
    }
  }, [currentPath]);

  return (
    <div className="grid justify-between w-2/3 grid-cols-3 px-4 py-2 gap-y-4">
      {steps.map((item, i) => {
        return (
          <div className="flex items-center" key={i}>
            {completedSteps[i] ? <CheckIcon /> : <PendingIcon />}

            {i !== steps.length - 1 && (
              <div className="flex items-center justify-center w-full text-center ">
                <Separator className="w-[70%] text-center h-[2px] bg-[#756D6D] " />
              </div>
            )}
          </div>
        );
      })}
      {steps.map((step, index) => {
        return (
          <div className="flex items-center " key={index}>
            <div className="text-sm ">
              <div className="space-y-1">
                <div className="text-xs">STEP {step.step}</div>
                <div className="text-sm font-semibold">{step.stepName}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectsHeading;
